import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import type { CategoriesEnum } from "../components/SelectCategory";
import { SelectCategory } from "../components/SelectCategory";
import { DialogNewPost } from "../components/DialogNewPost";
import { useRouter } from "next/router";
import { Loader } from "../components/Loader";
import { SignInButton } from "../components/SignInButton";
import { LogOutButton } from "../components/LogOutButton";
import { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { PostList } from "../components/PostList";

const Home: NextPage = () => {
  const router = useRouter();
  const session = useSession();
  const query = router.query.index
    ? router.query.index[0]?.toUpperCase() ?? null
    : null;
  const [postsList] = trpc.useQueries((t) => [
    t.posts.list(query, {
      trpc: {
        abortOnUnmount: true,
      },
    }),
  ]);
  const parent = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  function handleSelectChange(v: CategoriesEnum) {
    if (v === "ALL") {
      router.push(`/`);
    } else {
      router.push(`/${v.toLowerCase()}`);
    }
  }

  return (
    <>
      <Head>
        <title>Best of web-dev</title>
        <meta
          name="description"
          content="Share with others the knowledge you come across

"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-bl  from-[#100027] to-[#3b3d6d] bg-fixed">
        <div className="container flex max-w-3xl flex-col justify-center  gap-12 px-4 py-16 text-center ">
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Best of{" "}
            <span className="bg-gradient-to-r from-purple-700 to-pink-400 bg-clip-text  font-extrabold text-transparent">
              web-dev
            </span>
          </h1>
          <h2 className="text-sm  leading-10 tracking-tight text-white sm:text-[1.7rem]">
            Share with others the knowledge you come across
          </h2>
          <div className="flex w-1/2  justify-between sm:w-full">
            <SelectCategory onValueChange={handleSelectChange} />
            {session.data?.user ? (
              <div>
                <DialogNewPost /> <LogOutButton />
              </div>
            ) : (
              <SignInButton />
            )}
          </div>
          <div
            className="flex w-full flex-col items-center gap-2 text-left"
            ref={parent}
          >
            {postsList.data ? <PostList posts={postsList.data} /> : <Loader />}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
