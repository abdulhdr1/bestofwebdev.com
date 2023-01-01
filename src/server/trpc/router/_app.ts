import { router } from "../trpc";
import { authRouter } from "./auth";
import { postsRouter } from "./posts";

export const appRouter = router({
  auth: authRouter,
  posts: postsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
