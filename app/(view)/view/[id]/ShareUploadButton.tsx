"use client";

import { AiOutlineLink } from "react-icons/ai";
import { toast } from "sonner";

export const ShareUploadButton = ({ uploadId }: { uploadId: string }) => {
  const copyLink = async () => {
    const url = `${window.location.origin}/view/${uploadId}`;
    navigator.clipboard.writeText(url);
    toast.success("Copied link to clipboard!");
  };

  return (
    <button
      type="button"
      className="relative inline-flex items-center rounded-md bg-pink-400/10 px-3 py-2 text-sm font-semibold text-pink-400 ring-1 ring-inset ring-pink-400/20 shadow-sm dark:hover:bg-pink-900 hover:bg-pink-900"
      onClick={copyLink}
    >
      <AiOutlineLink
        className="-ml-0.5 mr-1.5 h-5 w-5 text-pink-400 dark:text-pink-600"
        aria-hidden="true"
      />
      <span>Share</span>
    </button>
  );
};
