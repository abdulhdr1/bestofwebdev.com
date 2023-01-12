import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const votesRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        value: z.number().min(-1).max(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newVote = await ctx.prisma.vote.create({
        data: {
          value: input.value,
          userId: ctx.session.user.id,
          postId: input.postId,
        },
      });
      return newVote;
    }),
  remove: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const currentVote = await ctx.prisma.vote.findFirst({
        where: { id: input },
        include: {
          user: true,
        },
      });

      if (currentVote?.user.id !== ctx.session.user.id)
        throw new Error("User not allowed");

      await ctx.prisma.vote.delete({
        where: {
          id: input,
        },
      });

      return true;
    }),
  update: protectedProcedure
    .input(
      z.object({
        voteId: z.string(),
        value: z.number().min(-1).max(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentVote = await ctx.prisma.vote.findFirst({
        where: { id: input.voteId },
        include: {
          user: true,
        },
      });

      if (currentVote?.user.id !== ctx.session.user.id)
        throw new Error("User not allowed");

      const updatedVote = await ctx.prisma.vote.update({
        where: {
          id: input.voteId,
        },
        data: {
          value: input.value,
        },
      });
      return updatedVote;
    }),
});
