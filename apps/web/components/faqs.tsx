import Link from "next/link";

export default function Faqs() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 md:pb-20">
            <h2 className="h2 font-hkgrotesk">FAQs</h2>
          </div>
          {/* Columns */}
          <div className="md:flex md:space-x-12 space-y-8 md:space-y-0">
            {/* Column */}
            <div className="w-full md:w-1/2 space-y-8">
              <div className="space-y-2">
                <h4 className="text-xl font-hkgrotesk font-medium">
                  What is ScreenLink?
                </h4>
                <p className="text-slate-500">
                  ScreenLink is an{" "}
                  <span className={"text-indigo-500"}>
                    open-source alternative to Loom
                  </span>{" "}
                  that lets you create and share screen recordings with
                  integrated camera and microphone feeds. It's available for{" "}
                  <Link className={"text-indigo-500"} href="/download">
                    MacOS, Windows, and Linux
                  </Link>
                  .
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-hkgrotesk font-medium">
                  How do I start using ScreenLink?
                </h4>
                <p className="text-slate-500">
                  To use ScreenLink,{" "}
                  <Link className={"text-indigo-500"} href={"signup"}>
                    create an account
                  </Link>{" "}
                  on our website, download the desktop application, and start
                  recording your screen. You can instantly share your
                  recordings.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-hkgrotesk font-medium">
                  Is ScreenLink free to use?
                </h4>
                <p className="text-slate-500">
                  Yes, ScreenLink offers a{" "}
                  <span className={"text-indigo-500"}>free tier</span> with
                  basic features. For more advanced capabilities, we offer Pro
                  and Growth plans with monthly or yearly subscriptions.
                </p>
              </div>
            </div>
            {/* Column */}
            <div className="w-full md:w-1/2 space-y-8">
              <div className="space-y-2">
                <h4 className="text-xl font-hkgrotesk font-medium">
                  Can I record in high quality?
                </h4>
                <p className="text-slate-500">
                  Absolutely! ScreenLink supports up to{" "}
                  <span className={"text-indigo-500"}>
                    4K screen recording at 60 FPS
                  </span>
                  , ensuring smooth and high-quality videos.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-hkgrotesk font-medium">
                  How do I contribute to ScreenLink’s development?
                </h4>
                <p className="text-slate-500">
                  As an open-source project, you can contribute to ScreenLink by
                  visiting our{" "}
                  <a
                    href="https://github.com/mangledbottles/screenlink-desktop"
                    target="_blank"
                    className={"text-indigo-500"}
                  >
                    GitHub repo
                  </a>
                  .
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-hkgrotesk font-medium">
                  What are the limitations of the free version?
                </h4>
                <p className="text-slate-500">
                  The free version allows up to{" "}
                  <span className={"text-indigo-500"}>15 video recordings</span>
                  , with a maximum duration of 10 minutes per recording and
                  support for one team member.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
