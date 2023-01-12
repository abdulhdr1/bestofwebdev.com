import { router } from "../trpc";
import { authRouter } from "./auth";
import { postsRouter } from "./posts";
import { votesRouter } from "./votes";

export const appRouter = router({
  auth: authRouter,
  posts: postsRouter,
  votes: votesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
