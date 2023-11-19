import Image from "next/image";
import Link from "next/link";

import HeroImage from "@/public/images/hero-image.png";
import CtaButton from "@components/ui/CtaButton";

export default function Hero() {
  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 md:pt-40">
          {/* Hero content */}
          <div className="max-w-3xl mx-auto text-center">
            {/* <h1 className="font-hkgrotesk mb-6 text-[5rem]" data-aos="fade-up"> */}
            <h1 className="h1 font-hkgrotesk mb-6" data-aos="fade-up">
              The Open Source Loom Alternative
            </h1>
            <p
              className="text-xl text-slate-500 mb-10"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Create and share screen recording demos for your customers,
              support team, and more in minutes with ScreenLink
            </p>
            <div
              className="max-w-xs mx-auto sm:max-w-none sm:inline-flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div>
                <CtaButton styles="btn" />
              </div>
              <div>
                <a
                  className="btn text-slate-300 bg-slate-700 hover:bg-slate-600 border-slate-600 w-full shadow-sm"
                  href="#0"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
          {/* Hero image */}
          <div
            className="pt-16 md:pt-20"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <Image
              className="mx-auto"
              src={HeroImage}
              width={920}
              height={518}
              alt="Hero"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
