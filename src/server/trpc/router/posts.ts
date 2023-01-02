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
  list: publicProcedure.input(z.string().nullable()).query(({ ctx, input }) => {
    const filter = input
      ? {
          where: { category: z.string().parse(input).toUpperCase() },
        }
      : undefined;

    return ctx.prisma.post.findMany({
      include: {
        votes: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        votes: {
          _count: "desc",
        },
      },
      ...filter,
    });
  }),
  vote: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        voteId: z.string().nullable(),
        value: z.number().min(-1).max(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.voteId) {
        const updatedVote = await ctx.prisma.vote.update({
          where: {
            id: input.voteId,
          },
          data: {
            value: input.value,
          },
        });
        return updatedVote;
      } else {
        const newVote = await ctx.prisma.vote.create({
          data: {
            value: input.value,
            userId: ctx.session.user.id,
            postId: input.postId,
          },
        });
        return newVote;
      }
    }),
});
