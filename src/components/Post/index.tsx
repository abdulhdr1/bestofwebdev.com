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
    <div className="item-center w-full justify-between rounded-lg border border-gray-800 bg-slate-900 p-4 text-white ">
      <div className="justify-between sm:flex">
        <div className="flex flex-col items-start">
          <div className="mb-2 flex w-full items-center justify-between sm:mb-0">
            <h2 className="my-auto font-bold  sm:mb-2 md:text-lg">{title}</h2>
            <a
              className="min-w-max rounded border border-gray-800 bg-gray-800 p-1 text-center text-sm hover:bg-gray-900 sm:hidden "
              target={"_blank"}
              href={post.link}
              rel="noreferrer"
            >
              Visit website
            </a>
          </div>
          {description && (
            <h3 className="my-auto pr-2 text-xs sm:mb-4 md:text-sm">
              {description}
            </h3>
          )}
        </div>
        <div className="flex items-center justify-end gap-4 sm:justify-between">
          <a
            className="hidden w-28 rounded border border-gray-800 bg-gray-800 p-1 text-center hover:bg-gray-900 sm:block "
            target={"_blank"}
            href={post.link}
            rel="noreferrer"
          >
            Visit website
          </a>
          <div className="hidden sm:block">
            {post.votes && <Voter postId={post.id} votes={post.votes} />}
          </div>
        </div>
      </div>

      <div className="flex w-full justify-between text-sm sm:block">
        <PostMetadata user={post.user} category={category} />
        <div className="ml-2 flex sm:hidden">
          {post.votes && <Voter postId={post.id} votes={post.votes} />}
        </div>
      </div>
    </div>
  );
}
