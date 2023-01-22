import type { Post as PostType } from "@prisma/client";
import { Post } from "../Post";

interface PostListProps<T extends PostType[]> {
  posts: T;
}

export function PostList<T extends PostType[]>({ posts }: PostListProps<T>) {
  return posts.length > 0 ? (
    <>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  ) : (
    <EmptyState />
  );
}

function EmptyState() {
  return (
    <div className="item-center flex w-full justify-between rounded-lg border border-gray-800 bg-slate-900 p-4 text-white">
      <div className="w-full text-center">
        <span>There are still no entries for this filter!</span>
      </div>
    </div>
  );
}
