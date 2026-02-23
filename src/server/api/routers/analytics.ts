import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const analyticsRouter = createTRPCRouter({
  getOverview: protectedProcedure.query(async ({ ctx }) => {
    const [totalReviews, completedReviews, avgRiskScore, recentReviews] =
      await Promise.all([
        ctx.db.review.count({
          where: { userId: ctx.user.id },
        }),
        ctx.db.review.count({
          where: { userId: ctx.user.id, status: "COMPLETED" },
        }),
        ctx.db.review.aggregate({
          where: { userId: ctx.user.id, status: "COMPLETED", riskScore: { not: null } },
          _avg: { riskScore: true },
        }),
        ctx.db.review.findMany({
          where: { userId: ctx.user.id },
          orderBy: { createdAt: "desc" },
          take: 7,
          select: {
            createdAt: true,
            status: true,
            riskScore: true,
          },
        }),
      ]);

    const failedReviews = await ctx.db.review.count({
      where: { userId: ctx.user.id, status: "FAILED" },
    });

    return {
      totalReviews,
      completedReviews,
      failedReviews,
      avgRiskScore: avgRiskScore._avg.riskScore ?? 0,
      recentReviews,
    };
  }),

  getReviewsByRepository: protectedProcedure.query(async ({ ctx }) => {
    const reviews = await ctx.db.review.groupBy({
      by: ["repositoryId"],
      where: { userId: ctx.user.id },
      _count: { id: true },
      _avg: { riskScore: true },
    });

    const repositories = await ctx.db.repository.findMany({
      where: {
        id: { in: reviews.map((r) => r.repositoryId) },
      },
      select: { id: true, name: true, fullName: true },
    });

    return reviews.map((review) => {
      const repo = repositories.find((r) => r.id === review.repositoryId);
      return {
        repositoryId: review.repositoryId,
        repositoryName: repo?.name ?? "Unknown",
        repositoryFullName: repo?.fullName ?? "Unknown",
        count: review._count.id,
        avgRiskScore: review._avg.riskScore ?? 0,
      };
    });
  }),

  getReviewTrend: protectedProcedure
    .input(
      z.object({
        days: z.number().min(7).max(90).default(30),
      }),
    )
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const reviews = await ctx.db.review.findMany({
        where: {
          userId: ctx.user.id,
          createdAt: { gte: startDate },
        },
        select: {
          createdAt: true,
          riskScore: true,
          status: true,
        },
        orderBy: { createdAt: "asc" },
      });

      return reviews;
    }),

  getSeverityBreakdown: protectedProcedure.query(async ({ ctx }) => {
    const reviews = await ctx.db.review.findMany({
      where: {
        userId: ctx.user.id,
        status: "COMPLETED",
        riskScore: { not: null },
      },
      select: { riskScore: true },
    });

    const breakdown = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    reviews.forEach((review) => {
      const score = review.riskScore ?? 0;
      if (score >= 75) breakdown.critical++;
      else if (score >= 50) breakdown.high++;
      else if (score >= 25) breakdown.medium++;
      else breakdown.low++;
    });

    return breakdown;
  }),
});
