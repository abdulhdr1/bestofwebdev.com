import { PostMetadata } from "../PostMetadata";
import { useEffect, useState } from "react";
import type { Post, Vote } from "@prisma/client";
import { truncateIfTooBig } from "../../helpers/truncateIfTooBig";
import { Categories } from "../SelectCategory";
import { Voter } from "../Voter";

interface PostProps {
  post: Post & {
    user?: {
      name: string | null;
      image: string | null;
    };
    votes?: Vote[];
  };
}

export function Post({ post }: PostProps) {
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  const category =
    Categories.find(({ value }) => value === post.category) ?? Categories[0];

  useEffect(() => {
    if (post.og) {
      const ogParsed = JSON.parse(post.og as string);
      const ogTitle = ogParsed.ogTitle ?? "";
      const ogSiteName = ogParsed.ogSiteName ?? "";
      const ogDescription = ogParsed.ogDescription ?? "";
      const result =
        ogTitle && ogSiteName
          ? `${ogTitle} - ${ogSiteName}`
          : ogTitle ?? ogSiteName;

      setDescription(truncateIfTooBig(ogDescription, 256));
      setTitle(truncateIfTooBig(result));
    } else {
      setTitle(truncateIfTooBig(post.link));
    }
  }, [post]);

  return (
    <div className="item-center flex w-full justify-between rounded-lg border border-gray-800 bg-slate-900 p-4 text-white">
      <div className="flex flex-col items-start">
        <h2 className="my-auto mb-2 text-sm font-bold md:text-lg">{title}</h2>
        {description && (
          <h3 className="my-auto mb-4 pr-2 text-xs md:text-sm">
            {description}
          </h3>
        )}
        <div className="w-full text-sm">
          <PostMetadata user={post.user} category={category} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <a
          className="w-28 rounded border border-gray-800 bg-gray-800 p-1 text-center hover:bg-gray-900 "
          target={"_blank"}
          href={post.link}
          rel="noreferrer"
        >
          Visit website
        </a>
        {post.votes && <Voter postId={post.id} votes={post.votes} />}
      </div>
    </div>
  );
}
