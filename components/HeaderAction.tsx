"use client";
import { BellDot, GithubIcon } from "lucide-react";
import {
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import conffetti from "canvas-confetti";
import { toast } from "sonner";
import { useState } from "react";

export const HeaderAction = () => {
  const [email, setEmail] = useState("");
  return (
    <span
      className="isolate inline-flex rounded-md shadow-sm"
      data-aos="fade-up"
    >
      <AlertDialog>
        <AlertDialogTrigger className="relative inline-flex items-center rounded-l-md bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 hover:bg-white/20 focus:z-10">
          <BellDot className="mr-2 h-4 w-4" /> Get Notified
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Updates</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="grid w-full max-w-md items-center gap-1.5 my-5">
                <p className="text-sm text-gray-500 mb-4">
                  Stay in the loop with ScreenLink and hear about launches and
                  new features
                </p>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Nope</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!email)
                  return toast.error("Please enter a valid email address");

                fetch("/api/subscribe", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.error) {
                      toast.error(data.error);
                    } else {
                      conffetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                      });
                      toast.success("Subscribed successfully!");                      
                    }
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              }}
            >
              Get Updates!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="relative inline-flex -ml-px">
        <a
          href="https://github.com/mangledbottles/screenlink-desktop"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            type="button"
            className="relative -ml-px inline-flex items-center rounded-r-md bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-gray-300 hover:bg-white/20 focus:z-10"
          >
            <GithubIcon className="mr-2 h-4 w-4" /> Star on GitHub
          </button>
        </a>
      </div>
    </span>
  );
};
