// components
import { Navbar, Footer } from "@/components";

// sections
import Hero from "./hero";
import Feature from "./feature";
import MobileConvenience from "./mobile-convenience";
import VideoIntro from "./video-intro";
import Faqs from "./faqs";

export default function Campaign() {
  return (
    <>
      <Navbar />
      <Hero />
      <Feature />
      <MobileConvenience />
      <VideoIntro />
      <Faqs />
      <Footer />
    </>
  );
}
