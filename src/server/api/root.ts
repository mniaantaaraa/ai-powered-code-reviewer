import { pullRequestRouter } from "./routers/pull-request";
import { repositoryRouter } from "./routers/respository";
import { reviewRouter } from "./routers/review";
import { analyticsRouter } from "./routers/analytics";
import { chatRouter } from "./routers/chat";
import { fixRouter } from "./routers/fix";
import { createCallerFactory, createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => {
    return { status: "ok", timestamps: new Date() };
  }),
  repository: repositoryRouter,
  pullRequest: pullRequestRouter,
  review: reviewRouter,
  analytics: analyticsRouter,
  chat: chatRouter,
  fix: fixRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
