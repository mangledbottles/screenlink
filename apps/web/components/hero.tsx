import Image from "next/image";
import Link from "next/link";

import CtaButton from "@components/ui/CtaButton";
import DemoLimk from "../public/images/demo-link-2.png";
import { GithubStars } from "./GithubStars";
import { Demo } from "./Demo";
import { Badge } from "./ui/badge";
import { LockClosedIcon } from "@radix-ui/react-icons";

export default function Hero() {
  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-20">
          {/* Hero content */}
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="isolate inline-flex rounded-md shadow-sm"
              data-aos="fade-up"
            >
              <div className="relative inline-flex">
                <Badge>
                  <LockClosedIcon className="h-3 w-3 mr-2 text-indigo-500" />
                  Private, secure and open source
                </Badge>
              </div>
            </span>

            <h1 className="h1 font-hkgrotesk mb-4 mt-6" data-aos="fade-up">
              Instantly Share Ideas, Screen Recordings
            </h1>
            <p
              className="text-xl text-slate-500 mb-12"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Create interactive screen recordings and share them instantly. No credit card required.
            </p>
            <div
              className="flex justify-center items-center gap-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <CtaButton styles="btn w-60 py-3" />
              <GithubStars styles="w-45 py-3" />
            </div>
          </div>
          {/* Hero image */}
          <div
            className="pt-16"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <Demo />
          </div>
        </div>
      </div>
    </section>
  );
}
