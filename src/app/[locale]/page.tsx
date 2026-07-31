import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Pricing } from "@/components/sections/Pricing";
import { WhyAvyzor } from "@/components/sections/WhyAvyzor";
import { Portfolio } from "@/components/sections/Portfolio";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { CTA } from "@/components/sections/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Pricing />
      <WhyAvyzor />
      <Portfolio />
      <Testimonials />
      <FAQ />
      <Contact />
      <CTA />
    </>
  );
}
