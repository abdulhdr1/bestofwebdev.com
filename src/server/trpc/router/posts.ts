import { z } from "zod";
import ogs from "open-graph-scraper";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const postsRouter = router({
  create: protectedProcedure
    .input(z.object({ link: z.string(), category: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { result } = await ogs({ url: input.link });
        const newPost = await ctx.prisma.post.create({
          data: {
            ...input,
            userId: ctx.session.user.id,
            og: JSON.stringify(result),
          },
        });
        return newPost;
      } catch (e) {
        const newPost = await ctx.prisma.post.create({
          data: { ...input, userId: ctx.session.user.id },
        });
        return newPost;
      }
    }),
  list: publicProcedure
    .input(z.string().nullable())
    .query(async ({ ctx, input }) => {
      const filter = input
        ? {
            where: { category: z.string().parse(input).toUpperCase() },
          }
        : undefined;

      const posts = ctx.prisma.post.findMany({
        include: {
          votes: true,
          user: {
            select: {
              name: true,
            },
          },
        },

        ...filter,
      });

      const postSortedByBalance = (await posts).sort((a, b) => {
        const Abalance = a.votes.reduce((acc, vote) => acc + vote.value, 0);
        const Bbalance = b.votes.reduce((acc, vote) => acc + vote.value, 0);

        return Bbalance - Abalance;
      });

      return postSortedByBalance;
    }),
});
