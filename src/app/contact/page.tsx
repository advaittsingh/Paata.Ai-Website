"use client";

import { Navbar, Footer } from "@/components";
import { Typography, Button, Input, Textarea } from "@material-tailwind/react";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative min-h-screen w-full">
        <div className="grid !min-h-[49rem] bg-gray-900 px-8">
          <div className="container mx-auto mt-32 grid h-full w-full grid-cols-1 place-items-center lg:mt-14 lg:grid-cols-2">
            <div className="col-span-1">
              <Typography variant="h1" color="white" className="mb-4">
                Get in Touch
              </Typography>
              <Typography
                variant="lead"
                className="mb-7 !text-white md:pr-16 xl:pr-28"
              >
                Have questions about PAATA.AI? We&apos;d love to hear from you. 
                Send us a message and we&apos;ll respond as soon as possible.
              </Typography>
            </div>
            <div className="col-span-1 my-20 h-full max-h-[30rem] -translate-y-32 md:max-h-[36rem] lg:my-0 lg:ml-auto lg:max-h-[40rem] lg:translate-y-0">
              <div className="relative">
                <div className="absolute inset-0 bg-[#612A74] rounded-3xl transform -rotate-6"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <Typography variant="h4" color="blue-gray" className="mb-4">
                    Quick Contact
                  </Typography>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-envelope" style={{color: '#612A74'}}></i>
                      <Typography color="gray">support@paata.ai</Typography>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-phone" style={{color: '#612A74'}}></i>
                      <Typography color="gray">+91 9900361943</Typography>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-map-marker-alt" style={{color: '#612A74'}}></i>
                      <Typography color="gray">Bengaluru, India</Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <section className="py-28 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Typography color="blue-gray" className="mb-2 font-bold uppercase">
                Send us a message
              </Typography>
              <Typography variant="h2" color="blue-gray" className="mb-8">
                We&apos;d love to hear from you
              </Typography>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    size="lg"
                    color="blue"
                    required
                  />
                  <Input
                    label="Last Name"
                    size="lg"
                    color="blue"
                    required
                  />
                </div>
                <Input
                  label="Email Address"
                  type="email"
                  size="lg"
                  color="blue"
                  required
                />
                <Input
                  label="Subject"
                  size="lg"
                  color="blue"
                  required
                />
                <Textarea
                  label="Message"
                  size="lg"
                  color="blue"
                  rows={6}
                  required
                />
                <Button
                  className="w-full md:w-auto flex items-center justify-center bg-white text-gray-900 px-6 py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl gap-3"
                  size="lg"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <Typography variant="h4" color="blue-gray" className="mb-6">
                  Contact Information
                </Typography>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-envelope" style={{color: '#612A74'}}></i>
                    </div>
                    <div>
                      <Typography variant="h6" color="blue-gray" className="mb-2">
                        Email Us
                      </Typography>
                      <Typography color="gray">
                        Support: support@paata.ai
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-phone" style={{color: '#612A74'}}></i>
                    </div>
                    <div>
                      <Typography variant="h6" color="blue-gray" className="mb-2">
                        Call Us
                      </Typography>
                      <Typography color="gray" className="mb-1">
                        +91 9900361943
                      </Typography>
                      <Typography color="gray">
                        Mon-Fri 9AM-6PM 
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-map-marker-alt" style={{color: '#612A74'}}></i>
                    </div>
                    <div>
                      <Typography variant="h6" color="blue-gray" className="mb-2">
                        Visit Us
                      </Typography>
                      <Typography color="gray" className="mb-1">
                        Bengaluru
                      </Typography>
                      <Typography color="gray">
                        India
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Follow Us
                </Typography>
                <div className="flex gap-4">
                  <Button
                    variant="outlined"
                    style={{borderColor: '#612A74', color: '#612A74'}}
                    className="rounded-full p-3 flex items-center justify-center bg-white text-gray-900 px-6 py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl gap-3"
                  >
                    <i className="fa-brands fa-twitter"></i>
                  </Button>
                  <Button
                    variant="outlined"
                    style={{borderColor: '#612A74', color: '#612A74'}}
                    className="rounded-full p-3 flex items-center justify-center bg-white text-gray-900 px-6 py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl gap-3"
                  >
                    <i className="fa-brands fa-facebook"></i>
                  </Button>
                  <Button
                    variant="outlined"
                    style={{borderColor: '#612A74', color: '#612A74'}}
                    className="rounded-full p-3 flex items-center justify-center bg-white text-gray-900 px-6 py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl gap-3"
                  >
                    <i className="fa-brands fa-instagram"></i>
                  </Button>
                  <Button
                    variant="outlined"
                    style={{borderColor: '#612A74', color: '#612A74'}}
                    className="rounded-full p-3 flex items-center justify-center bg-white text-gray-900 px-6 py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl gap-3"
                  >
                    <i className="fa-brands fa-linkedin"></i>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-28 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Typography color="blue-gray" className="mb-2 font-bold uppercase">
              Frequently Asked
            </Typography>
            <Typography variant="h2" color="blue-gray" className="mb-4">
              Quick Answers
            </Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                How quickly do you respond?
              </Typography>
              <Typography color="gray">
                We typically respond to all inquiries within 24 hours during business days.
              </Typography>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Do you offer phone support?
              </Typography>
              <Typography color="gray">
                Yes! Our phone support is available Monday-Friday, 9AM-6PM.
              </Typography>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Can I schedule a demo?
              </Typography>
              <Typography color="gray">
                Absolutely! Contact us to schedule a personalized demo of PAATA.AI.
              </Typography>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                What languages do you support?
              </Typography>
              <Typography color="gray">
                We support 10+ languages including English, Hindi, Kannada, Gujarati, and more.
              </Typography>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
