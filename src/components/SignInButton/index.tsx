import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
    <button
      type="button"
      onClick={() => signIn()}
      className="inline-flex items-stretch rounded-md rounded-l-md border border-gray-800 bg-gray-900  px-4 py-2  text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-200"
    >
      Sign In
    </button>
  );
}
