/**
 * ReactionToolbar Component
 *
 * This component allows users to react to uploads with emojis.
 * Credit https://github.com/mfts/reaction-demo/
 */

"use client";
import { reactToUpload, EmojiType } from "@/actions";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type ReactionToolbarProps = {
  uploadId: string;
};

export const ReactionToolbar = ({ uploadId }: ReactionToolbarProps) => {
  const [currentEmoji, setCurrentEmoji] = useState<{
    emoji: string;
    id: number;
  } | null>(null);
  const clearEmojiTimeout = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (clearEmojiTimeout.current) {
        clearTimeout(clearEmojiTimeout.current);
      }
    };
  }, []);

  const handleEmojiClick = async (emoji: EmojiType) => {
    if (clearEmojiTimeout.current) {
      clearTimeout(clearEmojiTimeout.current);
    }

    setCurrentEmoji({ emoji, id: Date.now() });

    try {
      toast.promise(reactToUpload({ uploadId, emoji }), {
        loading: "Reacting...",
        success: () => {
          return `Added ${emoji} reaction!`;
        },
        error: `Error adding ${emoji} reaction`,
      });
    } catch (error) {
      console.error("Error reacting to upload:", error);
    }

    clearEmojiTimeout.current = setTimeout(() => {
      setCurrentEmoji(null);
    }, 3000);
  };

  const Emoji = ({ label, emoji }: { label: string; emoji: EmojiType }) => (
    <div className="relative w-fit">
      <button
        className="font-emoji text-2xl leading-6 bg-transparent p-1 relative transition-bg-color duration-600 inline-flex justify-center items-center align-middle rounded-full ease-in-out hover:bg-gray-200 active:bg-gray-400 active:duration-0 dark:hover:bg-gray-600 dark:active:bg-gray-700"
        role="img"
        aria-label={label ? label : ""}
        aria-hidden={label ? "false" : "true"}
        onClick={() => handleEmojiClick(emoji)}
      >
        {emoji}
        {currentEmoji && currentEmoji.emoji === emoji && (
          <span
            key={currentEmoji.id}
            className="font-emoji absolute -top-10 left-0 right-0 mx-auto animate-flyEmoji duration-3000"
          >
            {currentEmoji.emoji}
          </span>
        )}
      </button>
    </div>
  );

  return (
    <>
      <div className="bg-white border border-gray-300 rounded-full mx-auto mt-4 mb-4 dark:bg-gray-800 dark:border-gray-600 w-auto inline-block">
        <div className="grid items-center justify-start">
          <div className="p-2">
            <div className="grid items-center justify-start grid-flow-col">
              {REACTIONS.map((reaction) => (
                <Emoji
                  key={reaction.emoji}
                  emoji={reaction.emoji}
                  label={reaction.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const REACTIONS: { emoji: EmojiType; label: string }[] = [
  {
    emoji: "😍",
    label: "love",
  },
  {
    emoji: "🙌",
    label: "yay",
  },
  {
    emoji: "😮",
    label: "wow",
  },
  {
    emoji: "👍",
    label: "up",
  },
  {
    emoji: "👎",
    label: "down",
  },
];
