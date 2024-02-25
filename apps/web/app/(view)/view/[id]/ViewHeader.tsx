"use client";
import { UserUpload } from "./page";
import { formatDistanceToNow } from "date-fns";
import { ShareUploadButton } from "./ShareUploadButton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CalendarIcon, PersonIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { updateTitle } from "@/actions"; // Adjust the import path as necessary
import { getSession } from "next-auth/react";

export const ViewHeader = async ({ upload }: { upload: UserUpload }) => {
  const [showEditTitle, setShowEditTitle] = useState(false);

  const session = await getSession();
  // @ts-ignore
  const userCanEditTitle = upload.User?.id == session?.user?.id ?? false;

  return (
    <header>
      <div className="mx-auto flex items-center justify-between gap-x-8 lg:mx-0 max-w-none mt-8">
        <div className="flex items-center gap-x-6">
          <h1>
            {!showEditTitle || !userCanEditTitle ? (
              <div
                className={`mt-1 text-base font-semibold leading-6 text-gray-200 dark:text-gray-200 ${
                  userCanEditTitle ? "cursor-pointer" : ""
                }`}
                onClick={() => {
                  if (userCanEditTitle) setShowEditTitle(true);
                }}
              >
                Watch {upload.sourceTitle}
              </div>
            ) : (
              <EditTitle
                uploadId={upload.id}
                currentTitle={upload.sourceTitle}
                setShowEditTitle={setShowEditTitle}
              />
            )}
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <PersonIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                by {upload.User?.name ?? "Unknown"}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <CalendarIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <HoverCard>
                  <HoverCardTrigger className="cursor-pointer">
                    {formatDistanceToNow(new Date(upload.createdAt))} ago
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                      <span className="text-xs text-muted-foreground">
                        {new Date(upload.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}{" "}
                        at{" "}
                        {new Date(upload.createdAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </span>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          </h1>
        </div>
        <div className="flex items-center gap-x-4 sm:gap-x-6">
          <ShareUploadButton uploadId={upload.id} />
        </div>
      </div>
    </header>
  );
};

const EditTitle = ({
  uploadId,
  currentTitle,
  setShowEditTitle,
}: {
  uploadId: string;
  currentTitle: string | null;
  setShowEditTitle: (show: boolean) => void;
}) => {
  const [title, setTitle] = useState(currentTitle ?? "");

  // Handle local state changes, but the actual submission is via the form action
  const handleLocalUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <form
      method="post" // Ensure method is POST for server actions
      action={() => updateTitle({ id: uploadId, newTitle: title })}
      className="flex w-full max-w-sm items-center space-x-2"
      onSubmit={() => setShowEditTitle(false)}
    >
      <Input
        name="newTitle"
        type="text"
        placeholder="Enter new title"
        value={title}
        onChange={handleLocalUpdate}
      />
      <input type="hidden" name="id" value={uploadId} />
      <Button
        type="submit"
        className="relative inline-flex items-center rounded-md bg-pink-400/10 px-3 py-2 text-sm font-semibold text-pink-400 ring-1 ring-inset ring-pink-400/20 shadow-sm dark:hover:bg-pink-900 hover:bg-pink-900"
      >
        Update
      </Button>
    </form>
  );
};

// const EditTitle = ({
//   uploadId,
//   currentTitle,
//   setShowEditTitle,
// }: {
//   uploadId: string;
//   currentTitle: string | null;
//   setShowEditTitle: (show: boolean) => void;
// }) => {
//   const [title, setTitle] = useState(currentTitle ?? "");
//   const initialState = {
//     message: null, // Define initial state properties as needed
//     success: false, // Ensure the initial state matches the expected structure
//   };

//   const [state, formAction] = useFormState(updateTitle, initialState);

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await formAction(new FormData(e.target as HTMLFormElement));
//     setShowEditTitle(false);
//   };

//   return (
//     <form
//       onSubmit={handleUpdate}
//       className="flex w-full max-w-sm items-center space-x-2"
//     >
//       <Input
//         name="newTitle"
//         type="text"
//         placeholder="Enter new title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//       <input type="hidden" name="id" value={uploadId} />
//       <Button
//         type="submit"
//         className="relative inline-flex items-center rounded-md bg-pink-400/10 px-3 py-2 text-sm font-semibold text-pink-400 ring-1 ring-inset ring-pink-400/20 shadow-sm dark:hover:bg-pink-900 hover:bg-pink-900"
//       >
//         Update
//       </Button>
//       {state?.success && <p>{JSON.stringify(state)}</p>}
//     </form>
//   );
// };
