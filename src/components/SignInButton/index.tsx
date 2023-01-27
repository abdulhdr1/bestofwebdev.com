import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { AiOutlineGoogle } from "react-icons/ai";
import { Loader } from "../Loader";

export function SignInButton() {
  const [loading, setLoading] = useState(false);

  function handleClick(id: string) {
    try {
      setLoading(true);
      signIn(id, { callbackUrl: "/" });
    } catch (e) {
      setLoading(false);
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-stretch rounded-md rounded-l-md border border-gray-800 bg-gray-900  px-4 py-2  text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-200"
        >
          Sign In
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="w-56 rounded-[13px] border  border-gray-800 bg-gray-900 p-2 shadow-lg"
        >
          <DropdownMenu.DropdownMenuItem className="flex items-center rounded-md px-4 py-2 text-sm text-gray-400  hover:bg-gray-800 hover:text-gray-300">
            <button
              className={`flex w-full items-center justify-between ${
                loading ? "opacity-50" : ""
              }"}`}
              onClick={() => handleClick("google")}
            >
              <div className="flex items-center">
                <AiOutlineGoogle className="mr-4" /> Google{" "}
              </div>
              <div>{loading && <Loader />}</div>
            </button>
          </DropdownMenu.DropdownMenuItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
