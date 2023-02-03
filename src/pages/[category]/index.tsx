import superjson from "superjson";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  type NextPage,
} from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { trpc } from "../../utils/trpc";
import type { CategoriesEnum } from "../../components/SelectCategory";
import { SelectCategory } from "../../components/SelectCategory";
import { DialogNewPost } from "../../components/DialogNewPost";
import { useRouter } from "next/router";
import { Loader } from "../../components/Loader";
import { SignInButton } from "../../components/SignInButton";
import { LogOutButton } from "../../components/LogOutButton";
import { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { PostList } from "../../components/PostList";
import { appRouter } from "../../server/trpc/router/_app";
import { prisma } from "../../server/db/client";

const CategoryHome = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const router = useRouter();
  const session = useSession();
  const { category } = props;

  const [postsList] = trpc.useQueries((t) => [
    t.posts.list(category, {
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
        <div className="container flex max-w-3xl flex-col justify-center gap-2 px-4 py-4 text-center sm:gap-12 sm:py-16 ">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Best of{" "}
            <span className="bg-gradient-to-r from-purple-700 to-pink-400 bg-clip-text  font-extrabold text-transparent">
              web-dev
            </span>
          </h1>
          <h2 className="text-sm  leading-10 tracking-tight text-white sm:text-[1.7rem]">
            Share with others the knowledge you come across
          </h2>
          <div className="w-full justify-between sm:flex">
            <div className="flex w-full items-start justify-between sm:items-center">
              <SelectCategory onValueChange={handleSelectChange} />
              {session.data?.user ? (
                <div className="items-center justify-end  sm:mt-0 sm:flex sm:justify-center">
                  <DialogNewPost />
                  <div className="ml-4 mt-2 sm:mt-0">
                    <LogOutButton />
                  </div>
                </div>
              ) : (
                <SignInButton />
              )}
            </div>
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

export const getStaticProps: GetStaticProps<{ category: string }> =
  async function (ctx) {
    const ssg = createProxySSGHelpers({
      router: appRouter,
      ctx: {
        prisma,
        session: null,
      },
      transformer: superjson,
    });

    const category = ctx.params?.category as string;
    await ssg.posts.list.prefetch(category);

    return {
      props: {
        trpcState: ssg.dehydrate(),
        category,
      },
      revalidate: 15,
    };
  };

export const getStaticPaths: GetStaticPaths = async () => {
  const postsList = await prisma.post.groupBy({
    by: ["category"],
  });
  return {
    paths: postsList.map(({ category }) => ({
      params: {
        category: category.toLowerCase(),
      },
    })),
    fallback: "blocking",
  };
};
export default CategoryHome;
