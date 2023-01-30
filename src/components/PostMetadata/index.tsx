import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { Categories } from "../SelectCategory";
export function PostMetadata({
  user,
  category,
}: {
  user?: Pick<User, "image" | "name">;
  category: typeof Categories[number];
}) {
  return (
    <div className="flex items-center">
      {user?.image ? (
        <Image
          className="rounded-md border border-gray-800"
          src={user?.image}
          width={24}
          height={24}
          alt={`${user?.name} profile image`}
        />
      ) : null}
      <div className="ml-2">{user?.name} - </div>
      <div
        className={`min-h-4  ml-1 flex rounded px-1 text-center align-middle text-xs font-bold ${
          false
            ? "bg-gray-400 bg-purple-400 bg-yellow-400 bg-blue-700 bg-blue-400"
            : ""
        } ${category.color}`}
      >
        {category.label}
      </div>
    </div>
  );
}
