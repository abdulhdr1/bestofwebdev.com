import type { Post, Vote } from "@prisma/client";

export function sortPostsByBalance<
  T extends { votes: Vote[]; createdAt: Post["createdAt"] }[]
>(posts: T): T {
  const result = posts.sort((a, b) => {
    const Abalance = a.votes.reduce((acc, vote) => acc + vote.value, 0);
    const Bbalance = b.votes.reduce((acc, vote) => acc + vote.value, 0);

    if (Abalance === Bbalance) {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }

    return Bbalance - Abalance;
  });

  return result;
}
