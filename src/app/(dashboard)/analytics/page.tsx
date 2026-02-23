"use client";

import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const { data: overview, isLoading: overviewLoading } =
    trpc.analytics.getOverview.useQuery();
  const { data: byRepo, isLoading: repoLoading } =
    trpc.analytics.getReviewsByRepository.useQuery();
  const { data: severity, isLoading: severityLoading } =
    trpc.analytics.getSeverityBreakdown.useQuery();

  if (overviewLoading || repoLoading || severityLoading) {
    return (
      <div className="p-8 space-y-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const successRate = overview?.totalReviews
    ? ((overview.completedReviews / overview.totalReviews) * 100).toFixed(1)
    : "0";

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-black border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview?.totalReviews}</div>
          </CardContent>
        </Card>

        <Card className="bg-black border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {overview?.completedReviews}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {successRate}% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Avg Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(overview?.avgRiskScore ?? 0).toFixed(0)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">out of 100</p>
          </CardContent>
        </Card>

        <Card className="bg-black border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {overview?.failedReviews}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-black border-zinc-800">
          <CardHeader>
            <CardTitle>Reviews by Repository</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[150px] overflow-y-auto scrollbar-custom">
              <div className="px-6 py-4 space-y-6">
                {byRepo?.map((repo) => {
                  const riskScore = repo.avgRiskScore ?? 0;
                  return (
                    <div key={repo.repositoryId} className="space-y-2">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-medium truncate" title={repo.repositoryName}>
                          {repo.repositoryName}
                        </span>
                        <span className="text-sm text-zinc-400 shrink-0">{repo.count} reviews</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              riskScore >= 75
                                ? "bg-red-500"
                                : riskScore >= 50
                                  ? "bg-orange-500"
                                  : riskScore >= 25
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.max(riskScore, 2)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500 w-10 text-right shrink-0 tabular-nums">
                          {riskScore.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {!byRepo?.length && (
                  <p className="text-sm text-zinc-500">No reviews yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-zinc-800">
          <CardHeader>
            <CardTitle>Risk Severity Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm">Critical (75-100)</span>
                </div>
                <span className="text-sm font-medium">{severity?.critical}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm">High (50-74)</span>
                </div>
                <span className="text-sm font-medium">{severity?.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Medium (25-49)</span>
                </div>
                <span className="text-sm font-medium">{severity?.medium}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">Low (0-24)</span>
                </div>
                <span className="text-sm font-medium">{severity?.low}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
