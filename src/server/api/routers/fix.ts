import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { generateCodeFix } from "@/server/services/ai";
import {
  getFileContent,
  createCommitWithFix,
  getGitHubAccessToken,
} from "@/server/services/github";

export const fixRouter = createTRPCRouter({
  generateFix: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        fileName: z.string(),
        prNumber: z.number(),
        issue: z.string(),
        suggestion: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const repository = await ctx.db.repository.findUnique({
        where: { id: input.repositoryId, userId: ctx.user.id },
      });

      if (!repository) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Repository not found",
        });
      }

      const accessToken = await getGitHubAccessToken(ctx.user.id);
      if (!accessToken) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "GitHub account not connected",
        });
      }

      const [owner, repo] = repository.fullName.split("/");
      if (!owner || !repo) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid repository name",
        });
      }

      // Get the current file content from the PR branch
      const originalCode = await getFileContent({
        owner,
        repo,
        path: input.fileName,
        ref: `pull/${input.prNumber}/head`,
        accessToken,
      });

      // Generate the fix
      const fixedCode = await generateCodeFix({
        fileName: input.fileName,
        originalCode,
        issue: input.issue,
        suggestion: input.suggestion,
      });

      return {
        originalCode,
        fixedCode,
      };
    }),

  applyFix: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        prNumber: z.number(),
        fileName: z.string(),
        fixedCode: z.string(),
        issue: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const repository = await ctx.db.repository.findUnique({
        where: { id: input.repositoryId, userId: ctx.user.id },
      });

      if (!repository) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Repository not found",
        });
      }

      const accessToken = await getGitHubAccessToken(ctx.user.id);
      if (!accessToken) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "GitHub account not connected",
        });
      }

      const [owner, repo] = repository.fullName.split("/");
      if (!owner || !repo) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid repository name",
        });
      }

      // Get PR details to get the branch name
      const { Octokit } = await import("@octokit/rest");
      const octokit = new Octokit({ auth: accessToken });

      const { data: pr } = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: input.prNumber,
      });

      // Create commit with the fix
      const result = await createCommitWithFix({
        owner,
        repo,
        branch: pr.head.ref,
        filePath: input.fileName,
        content: input.fixedCode,
        message: `fix: ${input.issue}\n\nAuto-generated fix by Qivo`,
        accessToken,
      });

      return {
        commitSha: result.commitSha,
        branchName: result.branchName,
        commitUrl: `https://github.com/${owner}/${repo}/commit/${result.commitSha}`,
      };
    }),
});
