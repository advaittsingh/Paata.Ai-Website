"use client";

import { Navbar, Footer } from "@/components";
import { Typography, Button } from "@material-tailwind/react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative min-h-screen w-full">
        <div className="grid !min-h-[49rem] bg-gray-900 px-8">
          <div className="container mx-auto mt-32 grid h-full w-full grid-cols-1 place-items-center lg:mt-14 lg:grid-cols-2">
            <div className="col-span-1">
              <Typography variant="h1" color="white" className="mb-4">
                About <br /> PAATA.AI
              </Typography>
              <Typography
                variant="lead"
                className="mb-7 !text-white md:pr-16 xl:pr-28"
              >
                We&apos;re revolutionizing education with AI-powered homework assistance 
                that makes learning accessible, engaging, and personalized for every student.
              </Typography>
              <div className="flex flex-col gap-2 md:mb-2 md:w-10/12 md:flex-row">
                <Button
                  size="lg"
                  color="white"
                  className="flex justify-center items-center gap-3"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="col-span-1 my-20 h-full max-h-[30rem] -translate-y-32 md:max-h-[36rem] lg:my-0 lg:ml-auto lg:max-h-[40rem] lg:translate-y-0">
              <div className="relative">
                <div className="absolute inset-0 bg-[#612A74] rounded-3xl transform rotate-6"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <Typography variant="h4" color="blue-gray" className="mb-4">
                    Our Mission
                  </Typography>
                  <Typography color="gray" className="mb-4">
                    To democratize education by providing intelligent, personalized 
                    homework assistance that adapts to each student&apos;s learning style.
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <section className="py-28 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Typography color="blue-gray" className="mb-2 font-bold uppercase">
                Our Story
              </Typography>
              <Typography variant="h2" color="blue-gray" className="mb-4">
                Empowering Students Worldwide
              </Typography>
              <Typography color="gray" className="mb-6 text-lg">
                Founded in 2024, PAATA.AI was born from a simple belief: every student 
                deserves access to quality education and personalized learning support. 
                Our team of educators, engineers, and AI specialists work together to 
                create innovative solutions that make homework less stressful and more engaging.
              </Typography>
              <div className="flex flex-wrap gap-4">
                <Button 
                  style={{backgroundColor: '#612A74'}} 
                  size="lg"
                  onClick={() => {
                    alert("Our team comprises visionaries with over 15 years of experience across software and education domains. We are currently operating in stealth mode.");
                  }}
                >
                  Our Team
                </Button>
                <Button variant="outlined" style={{borderColor: '#612A74', color: '#612A74'}} size="lg">
                  Careers
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-2xl">
                <Typography variant="h3" style={{color: '#612A74'}} className="mb-2">
                  500+
                </Typography>
                <Typography color="gray">
                  Students Helped
                </Typography>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-2xl">
                <Typography variant="h3" style={{color: '#612A74'}} className="mb-2">
                  95%
                </Typography>
                <Typography color="gray">
                  Success Rate
                </Typography>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-2xl">
                <Typography variant="h3" style={{color: '#612A74'}} className="mb-2">
                  24/7
                </Typography>
                <Typography color="gray">
                  AI Support
                </Typography>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-2xl">
                <Typography variant="h3" style={{color: '#612A74'}} className="mb-2">
                  10+
                </Typography>
                <Typography color="gray">
                  Languages
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-28 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Typography color="blue-gray" className="mb-2 font-bold uppercase">
              Our Values
            </Typography>
            <Typography variant="h2" color="blue-gray" className="mb-4">
              What Drives Us Forward
            </Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-graduation-cap text-2xl" style={{color: '#612A74'}}></i>
              </div>
              <Typography variant="h4" color="blue-gray" className="mb-4">
                Educational Excellence
              </Typography>
              <Typography color="gray">
                We&apos;re committed to providing the highest quality educational 
                support that helps students not just complete homework, but truly understand concepts.
              </Typography>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-users text-2xl" style={{color: '#612A74'}}></i>
              </div>
              <Typography variant="h4" color="blue-gray" className="mb-4">
                Accessibility
              </Typography>
              <Typography color="gray">
                Learning should be accessible to everyone. We break down barriers 
                with multilingual support and adaptive learning technologies.
              </Typography>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-lightbulb text-2xl" style={{color: '#612A74'}}></i>
              </div>
              <Typography variant="h4" color="blue-gray" className="mb-4">
                Innovation
              </Typography>
              <Typography color="gray">
                We continuously push the boundaries of AI and education technology 
                to create better learning experiences for students worldwide.
              </Typography>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
