import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { FormEventHandler, useEffect, useState } from "react";
import { CategoriesEnum, SelectCategory } from "../SelectCategory";
import { trpc } from "../../utils/trpc";

export function DialogNewPost() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<CategoriesEnum | null>(null);
  const [link, setLink] = useState("");
  const [error, setError] = useState<any>(null);
  const utils = trpc.useContext();
  const mutation = trpc.posts.create.useMutation({
    onSuccess() {
      utils.posts.list.invalidate();
    },
  });
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      if (link && category) {
        await mutation.mutate({ link, category });
        setOpen(false);
      } else {
        throw Error("invalid input");
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (open) {
      setCategory(null);
      setLink("");
      setError(null);
    }
  }, [open]);

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-stretch rounded-md rounded-l-md border border-gray-800 bg-gray-900  px-4 py-2  text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-200">
          Add website
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 top-0 right-0 left-0 bottom-0 grid place-items-center overflow-y-auto bg-black/50 " />
        <Dialog.Content className="fixed top-1/2 left-1/2  w-full max-w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gray-700 p-2 text-white ">
          <Dialog.Title className="mb-4 w-full font-extrabold ">
            New website
          </Dialog.Title>
          <Dialog.Description className="mb-2 font-medium text-white">
            Insert the link and category of the website
          </Dialog.Description>
          <form onSubmit={handleSubmit}>
            <fieldset className="mb-2">
              <label
                htmlFor="newPostLink"
                className="block text-xs font-medium text-gray-200"
              >
                Link
              </label>

              <input
                id="newPostLink"
                placeholder="https://example.com"
                onChange={(e) => setLink(e.target.value)}
                className="mt-1 w-full rounded-md border-gray-700  bg-gray-800 p-2 text-white shadow-sm sm:text-sm"
              />
            </fieldset>
            <fieldset className="mb-4">
              <label
                htmlFor="newPostCategory"
                className="block text-xs font-medium text-gray-200"
              >
                Category
              </label>

              <SelectCategory
                className="mt-1 bg-gray-800"
                onValueChange={(v) => setCategory(v as CategoriesEnum)}
              />
            </fieldset>
            {error ? (
              <div className="mb-4">There was an error: {error}</div>
            ) : (
              ""
            )}

            <div className="flex justify-between">
              <Dialog.Close asChild>
                <button
                  className="rounded-lg bg-red-700 p-2 font-bold"
                  aria-label="Close"
                >
                  <Cross2Icon />
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="rounded-lg bg-green-700 p-2 font-bold"
              >
                Send
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
