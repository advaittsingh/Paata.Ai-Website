"use client";

// components
import { Navbar, Footer, Hero, Feature, MobileConvenience, VideoIntro, LearningMaterials } from "@/components";

export default function Campaign() {
  return (
    <>
      <Navbar />
      <Hero />
      <Feature />
      <MobileConvenience />
      <VideoIntro />
      
      {/* Learning Materials Section */}
      <LearningMaterials />
      
      <Footer />
    </>
  );
}



