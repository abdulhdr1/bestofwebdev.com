import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { trpc } from "../../utils/trpc";
import { signIn, useSession } from "next-auth/react";
import type { Vote } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { sortPostsByBalance } from "../../helpers/sortPostsByBalance";

type VoterProps = {
  postId: string;
  votes: Vote[];
};

export function Voter({ postId, votes }: VoterProps) {
  const session = useSession();
  const utils = trpc.useContext();
  const [vote, setVote] = useState<number | null>(null);
  const currentVote = useMemo(
    () => votes.find(({ userId }) => userId === session.data?.user?.id),
    [votes, session.data?.user?.id]
  );
  const postList = trpc.useContext().posts.list;
  const createVote = trpc.votes.create.useMutation({
    onSettled() {
      utils.posts.list.invalidate();
    },
    onMutate(variables) {
      const newList = postList.getData(null);
      if (!newList) return;
      newList
        ?.find((post) => post.id === postId)
        ?.votes.push({
          id: session.data?.user?.id as string,
          userId: session.data?.user?.id as string,
          postId,
          value: variables.value,
        });
      postList.setData(null, sortPostsByBalance(newList));
    },
  });
  const updateVote = trpc.votes.update.useMutation({
    onSettled() {
      utils.posts.list.invalidate();
    },
    onMutate(variables) {
      const newList = postList.getData(null);

      if (!newList) return;
      const newVote = newList
        ?.find((post) => post.id === postId)
        ?.votes?.find((vote) => vote.id === variables.voteId);
      if (newVote) newVote.value = variables.value;
      return postList.setData(null, sortPostsByBalance(newList));
    },
  });
  const deleteVote = trpc.votes.remove.useMutation({
    onSettled() {
      utils.posts.list.invalidate();
    },
    onMutate(voteId) {
      const newList = postList.getData(null);
      if (!newList) return;
      const newVote = newList
        ?.find((post) => post.id === postId)
        ?.votes?.find((vote) => vote.id === voteId);
      if (newVote) newVote.value = 0;
      return postList.setData(null, sortPostsByBalance(newList));
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
    <div className=" flex items-center sm:flex-col">
      <button
        type="button"
        onClick={() => (vote === 1 ? handleDeleteVote() : handleVote(1))}
        className={`rounded p-1 ${
          vote === 1 ? "bg-orange-600" : "bg-gray-800"
        }`}
      >
        <ChevronUpIcon />
      </button>
      <span className="mx-4">{voteBalance}</span>
      <button
        type="button"
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
