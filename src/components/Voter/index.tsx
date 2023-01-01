import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { trpc } from "../../utils/trpc";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { Vote } from "@prisma/client";
import { useEffect, useState } from "react";

type VoterProps = {
  id: string;
  votes: Vote[];
};

export function Voter({ id, votes }: VoterProps) {
  const session = useSession();
  const mutation = trpc.posts.vote.useMutation();
  const [vote, setVote] = useState<number | null>(null);
  const currentVote = votes.find(
    ({ userId }) => userId === session.data?.user?.id
  );

  function handleVote(value: number) {
    if (session.data?.user) {
      if (vote !== value) {
        setVote(value);
        mutation.mutate({ postId: id, value, voteId: currentVote?.id ?? null });
      }
    } else {
      signIn();
    }
  }

  useEffect(() => {
    if (currentVote) {
      setVote(currentVote.value);
    }
  }, [currentVote]);

  const voteBalance = votes
    .map(({ value }) => value)
    .reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => handleVote(1)}
        className={`rounded  p-1 ${
          vote === 1 ? "cursor-not-allowed bg-orange-600" : "bg-gray-800"
        }`}
      >
        <ChevronUpIcon />
      </button>
      {voteBalance}
      <button
        onClick={() => handleVote(-1)}
        className={`rounded bg-gray-800 p-1 ${
          vote === -1 ? "cursor-not-allowed bg-orange-600" : "bg-gray-800"
        }`}
      >
        <ChevronDownIcon />
      </button>
    </div>
  );
}
