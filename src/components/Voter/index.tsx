import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { trpc } from "../../utils/trpc";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { Vote } from "@prisma/client";
import { useEffect, useState } from "react";

type VoterProps = {
  postId: string;
  votes: Vote[];
};

export function Voter({ postId, votes }: VoterProps) {
  const session = useSession();
  const utils = trpc.useContext();
  const [vote, setVote] = useState<number | null>(null);
  const currentVote = votes.find(
    ({ userId }) => userId === session.data?.user?.id
  );
  const createVote = trpc.votes.create.useMutation({
    onSuccess() {
      utils.posts.list.invalidate();
    },
  });
  const updateVote = trpc.votes.update.useMutation({
    onSuccess() {
      utils.posts.list.invalidate();
    },
  });
  const deleteVote = trpc.votes.remove.useMutation({
    onSuccess() {
      utils.posts.list.invalidate();
    },
  });

  function handleVote(value: number) {
    if (!session.data?.user) return signIn();
    setVote(value);

    if (!currentVote) {
      return createVote.mutate({ postId: postId, value });
    }

    return updateVote.mutate({
      voteId: currentVote.id,
      value,
    });
  }

  function handleDeleteVote() {
    if (currentVote) {
      setVote(null);
      return deleteVote.mutate(currentVote.id);
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
        onClick={() => (vote === 1 ? handleDeleteVote() : handleVote(1))}
        className={`rounded  p-1 ${
          vote === 1 ? "bg-orange-600" : "bg-gray-800"
        }`}
      >
        <ChevronUpIcon />
      </button>
      {voteBalance}
      <button
        onClick={() => (vote === -1 ? handleDeleteVote() : handleVote(-1))}
        className={`rounded bg-gray-800 p-1 ${
          vote === -1 ? "bg-orange-600" : "bg-gray-800"
        }`}
      >
        <ChevronDownIcon />
      </button>
    </div>
  );
}
