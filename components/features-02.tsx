"use client";

import { useState } from "react";
import Image from "next/image";
import Illustration from "@/public/images/features-illustration-02.svg";
import FeaturesImage from "@/public/images/features-image.png";

export default function Features02() {
  const [category, setCategory] = useState<string>("1");

  const categoryImages = [
    "sources-demo.gif",
    "recording-demo-3.gif",
    "dark-by-default-demo.gif",
  ];

  return (
    <section className="relative border-t border-slate-800">
      {/* Background gradient and Illustration */}
      <div
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-slate-800 to-transparent opacity-25 h-[25rem] pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 mt-40 pointer-events-none -z-10"
        aria-hidden="true"
      >
        <Image
          src={Illustration}
          className="max-w-none"
          width="1440"
          height="453"
          alt="Features Illustration"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 font-hkgrotesk">
              Powerful Features for Every User
            </h2>
          </div>

          {/* Box */}
          <div className="bg-slate-800 bg-opacity-60 rounded overflow-hidden">
            <div className="flex flex-col md:flex-row items-end md:items-start md:justify-between lg:space-x-20 h-[24rem]">
              <div className="md:min-w-[28rem] p-6 lg:p-10">
                {/* Filters */}
                <div className="mb-6 lg:mb-8">
                  {/* Button filters for different categories */}
                  <div className="flex flex-wrap -m-1.5">
                    <button
                      className={`btn-sm px-3 py-1 shadow-sm rounded-full m-1.5 ${
                        category === "1"
                          ? "text-white bg-indigo-500"
                          : "text-slate-300 bg-slate-700 hover:bg-slate-600 border-slate-600"
                      }`}
                      onClick={() => setCategory("1")}
                    >
                      Sources
                    </button>
                    <button
                      className={`btn-sm px-3 py-1 shadow-sm rounded-full m-1.5 ${
                        category === "2"
                          ? "text-white bg-indigo-500"
                          : "text-slate-300 bg-slate-700 hover:bg-slate-600 border-slate-600"
                      }`}
                      onClick={() => setCategory("2")}
                    >
                      Sharable
                    </button>
                    <button
                      className={`btn-sm px-3 py-1 shadow-sm rounded-full m-1.5 ${
                        category === "3"
                          ? "text-white bg-indigo-500"
                          : "text-slate-300 bg-slate-700 hover:bg-slate-600 border-slate-600"
                      }`}
                      onClick={() => setCategory("3")}
                    >
                      Beautiful
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div className={`${category !== "1" && "hidden"}`}>
                    <h3 className="h3 font-hkgrotesk mb-2">
                      Any Screen, Any Window
                    </h3>
                    <div className="text-lg text-slate-500">
                      Pick any screen, window, microphone or webcam to record.{" "}
                      <span className={"text-indigo-500"}>
                        ScreenLink makes it easy to capture exactly what you
                        want.
                      </span>{" "}
                      Webcam and microphone are also optional!
                    </div>
                  </div>
                  <div className={`${category !== "2" && "hidden"}`}>
                    <h3 className="h3 font-hkgrotesk mb-2">
                      Instantly Sharable Links
                    </h3>
                    <div className="text-lg text-slate-500">
                      As soon as you hit stop, the video is already uploading
                      and processing to our CDN.{" "}
                      <span className={"text-indigo-500"}>
                        You get the share link instantly as soon as you hit
                        stop!
                      </span>{" "}
                      You can share the link with anyone, anywhere.
                    </div>
                  </div>
                  <div className={`${category !== "3" && "hidden"}`}>
                    <h3 className="h3 font-hkgrotesk mb-2">Dark by Default</h3>
                    <div className="text-lg text-slate-500">
                      ScreenLink is dark by default, so you can focus on your
                      work and <span className={"text-indigo-500"}>protect your eyes!</span> You can also switch to light
                      mode if you prefer.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center h-full p-2">
                <Image
                  src={`https://cdn.screenlink.io/${
                    categoryImages[Number(category) - 1] ?? categoryImages[0]
                  }`}
                  className="md:max-w-none"
                  // className="max-w-sm min-h-[20rem]"
                  // className="min-h-[20rem] min-w-[28rem]"
                  width="480"
                  height="414"
                  alt="Feature"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
