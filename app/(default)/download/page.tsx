import { constructMetadata } from "@/app/utils";
import { DownloadButton } from "./DownloadButton";
import Link from "next/link";
export const metadata = constructMetadata({
  description:
    "Download for MacOS, Windows, or Linux to record your screen and share demos with ScreenLink",
  title: "Download - ScreenLink",
});

export default function Download() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 min-h-screen flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl dark:text-white">
            Download ScreenLink
          </h1>
          <p className="max-w-[600px] text-zinc-500 text-center md:text-sm/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
            ScreenLink allows you to record your screen and share it with
            anyone! Download ScreenLink and get started for free today.
          </p>
        </div>
        <div className="flex justify-center mt-12">
          <Link href="/download">
            <DownloadButton />
          </Link>
        </div>
      </div>
    </section>
  );
}
