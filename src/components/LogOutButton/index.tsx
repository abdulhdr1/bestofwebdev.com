import { signOut } from "next-auth/react";

export function LogOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="ml-4 inline-flex items-stretch rounded-md rounded-l-md border border-red-800 bg-red-900  px-4 py-2  text-sm text-gray-300 hover:bg-red-800 hover:text-gray-200"
    >
      Log Out
    </button>
  );
}
