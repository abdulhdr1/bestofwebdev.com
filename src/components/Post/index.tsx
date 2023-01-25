import { useEffect, useRef, useState } from "react";
import type { Post, Vote } from "@prisma/client";
import { truncateIfTooBig } from "../../helpers/truncateIfTooBig";
import { Categories } from "../SelectCategory";
import { Voter } from "../Voter";
import Image from "next/image";

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
  const titleRef = useRef<HTMLHeadingElement>(null);

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
        <h2
          className="my-auto mb-2 text-sm font-bold md:text-lg"
          ref={titleRef}
        >
          {title}
        </h2>
        {description && (
          <h3 className="my-auto mb-4 pr-2 text-xs md:text-sm">
            {description}
          </h3>
        )}
        <p className="w-full text-sm">
          <span className="flex items-center">
            {post.user?.image ? (
              <Image
                className="rounded-md border border-gray-800"
                src={post.user?.image}
                width={24}
                height={24}
                alt={`${post.user?.name} profile image`}
              />
            ) : null}{" "}
            <div className="ml-1">{post.user?.name} - </div>
            <div
              className={`ml-1  flex h-4 rounded px-1 align-middle text-xs font-bold ${
                false
                  ? "bg-gray-400 bg-purple-400 bg-yellow-400 bg-blue-700 bg-blue-400"
                  : ""
              } ${
                Categories.find(({ value }) => value === post.category)?.color
              }`}
            >
              {Categories.find(({ value }) => value === post.category)?.label}
            </div>
          </span>
        </p>
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
