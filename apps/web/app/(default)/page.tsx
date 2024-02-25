export const metadata = constructMetadata({});

/* Landing page Stlyes*/
import "@/app/css/additional-styles/utility-patterns.css";
import "@/app/css/additional-styles/range-slider.css";
import "@/app/css/additional-styles/toggle-switch.css";
import "@/app/css/additional-styles/theme.css";

import Hero from "@/components/hero";
// import Testimonials from "@/components/testimonials";
import Features from "@/components/features";
import Features02 from "@/components/features-02";
// import Integrations from "@/components/integrations";
import Pricing from "@/components/pricing";
import Faqs from "@/components/faqs";
import Cta from "@/components/cta";
import { constructMetadata } from "../utils";

export default function Home() {
  return (
    <>
      <Hero />
      {/* <Testimonials /> */}
      <Features />
      <Features02 />
      {/* <Integrations /> */}
      <Pricing />
      <Faqs />
      <Cta />
    </>
  );
}
