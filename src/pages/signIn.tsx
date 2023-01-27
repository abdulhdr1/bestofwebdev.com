import { GetServerSideProps } from "next";
import { BuiltInProviderType, BuiltInProviders } from "next-auth/providers";
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
  signIn,
} from "next-auth/react";
import { useState } from "react";
import { AiOutlineGoogle } from "react-icons/ai";
import { Loader } from "../components/Loader";

type SignInProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
};

export default function SignIn({ providers }: SignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  function handleClick(id: string) {
    try {
      setIsLoading(true);
      signIn(id, { callbackUrl: "/" });
    } catch (e) {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex  min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className={`flex rounded border ${
                isLoading ? "border-gray-800/25" : "border-gray-800"
              } bg-gray-900 p-4 text-2xl font-extrabold text-white`}
              onClick={() => handleClick(provider.id)}
              disabled={isLoading}
            >
              {provider.name === "Google" ? (
                <AiOutlineGoogle size={32} className="mr-6" />
              ) : null}
              Sign in with {provider.name}
              {isLoading && <Loader />}
            </button>
          </div>
        ))}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
