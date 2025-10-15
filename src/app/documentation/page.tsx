"use client";

import { Navbar, Footer } from "@/components";
import { Typography, Button, Card, CardBody, Input } from "@material-tailwind/react";
import { useState } from "react";

export default function DocsPage() {
  const [showOnboardingGuide, setShowOnboardingGuide] = useState(false);

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative min-h-screen w-full">
        <div className="grid !min-h-[40rem] sm:!min-h-[49rem] bg-gray-900 px-4 sm:px-8">
          <div className="container mx-auto mt-20 sm:mt-32 grid h-full w-full grid-cols-1 place-items-center lg:mt-14 lg:grid-cols-2">
            <div className="col-span-1">
              <Typography variant="h1" color="white" className="mb-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
                Documentation <br /> & Resources
              </Typography>
              <Typography
                variant="lead"
                className="mb-7 !text-white text-sm sm:text-base md:pr-16 xl:pr-28"
              >
                Everything you need to get started with PAATA.AI. 
                From quick start guides to comprehensive API documentation.
              </Typography>
              <div className="flex flex-col gap-2 w-full sm:w-auto md:mb-2 md:w-10/12 md:flex-row">
                <Button
                  size="lg"
                  color="white"
                  className="flex justify-center items-center gap-3"
                  onClick={() => document.getElementById('onboarding-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <i className="fa-solid fa-rocket"></i>
                  Quick Start
                </Button>
                <Button
                  size="lg"
                  variant="outlined"
                  color="white"
                  className="flex justify-center items-center gap-3"
                  onClick={() => document.getElementById('developer-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <i className="fa-solid fa-code"></i>
                  API Reference
                </Button>
              </div>
            </div>
            <div className="col-span-1 my-10 sm:my-20 h-full max-h-[25rem] sm:max-h-[30rem] -translate-y-16 sm:-translate-y-32 md:max-h-[36rem] lg:my-0 lg:ml-auto lg:max-h-[40rem] lg:translate-y-0">
              <div className="relative">
                <div className="absolute inset-0 bg-[#612A74] rounded-2xl sm:rounded-3xl transform rotate-3 sm:rotate-6"></div>
                <div className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                  <Typography variant="h4" color="blue-gray" className="mb-4">
                    📚 Complete Learning Hub
                  </Typography>
                  <Typography color="gray" className="mb-4">
                    Access comprehensive educational resources, API documentation, 
                    and step-by-step guides to maximize your learning experience.
                  </Typography>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-graduation-cap text-xl text-[#612A74]"></i>
                    </div>
                    <Typography color="blue-gray" className="font-medium">
                      Educational Excellence
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Guide */}
      <section id="onboarding-section" className="py-28 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Typography color="blue-gray" className="mb-2 font-bold uppercase">
              Onboarding Guide
            </Typography>
            <Typography variant="h2" color="blue-gray" className="mb-4">
              Get Started with PAATA.AI
            </Typography>
            <Typography color="gray" className="text-lg max-w-2xl mx-auto">
              Your complete guide to getting the most out of your PAATA.AI experience
            </Typography>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <i className="fa-solid fa-rocket text-3xl text-[#612A74]"></i>
                </div>
                <Typography variant="h4" color="blue-gray" className="mb-4 text-center">
                  Complete Onboarding Guide
                </Typography>
                <Typography color="gray" className="mb-6 text-center text-lg">
                  Everything you need to know to get started with PAATA.AI, from account setup to advanced features. This comprehensive guide covers account creation, your first conversation, image analysis, voice features, settings customization, and mobile app usage.
                </Typography>
                <div className="text-center">
                  <Button 
                    style={{backgroundColor: '#612A74'}} 
                    size="lg" 
                    className="px-8 py-3"
                    onClick={() => setShowOnboardingGuide(true)}
                  >
                    <i className="fa-solid fa-book-open mr-2"></i>
                    Read Complete Guide
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Educational Resources */}
      <section className="py-28 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Typography color="blue-gray" className="mb-2 font-bold uppercase">
              Educational Resources
            </Typography>
            <Typography variant="h2" color="blue-gray" className="mb-4">
              Class-wise Study Materials
            </Typography>
            <Typography color="gray" className="text-lg max-w-2xl mx-auto">
              Access comprehensive study materials organized by class levels from 1 to 12
            </Typography>
          </div>
          
          {/* AI Search Bar */}
          <div className="max-w-4xl mx-auto mb-12 sm:mb-16 px-4 sm:px-0">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-4 sm:mb-6">
                <Typography variant="h4" color="blue-gray" className="mb-2 text-lg sm:text-xl lg:text-2xl">
                  🤖 AI-Powered Search
                </Typography>
                <Typography color="gray" className="text-sm sm:text-base">
                  Ask for any topic and get relevant information instantly
                </Typography>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <Input
                    label="Search for any topic (e.g., 'algebra', 'photosynthesis', 'Shakespeare')"
                    placeholder="What would you like to learn about?"
                    className="text-sm sm:text-base lg:text-lg"
                    icon={<i className="fa-solid fa-robot"></i>}
                    onChange={(e) => {
                      // This will be handled by the AI search component
                    }}
                  />
                </div>
                <Button
                  style={{backgroundColor: '#612A74'}}
                  size="lg"
                  className="px-4 sm:px-6 lg:px-8 w-full sm:w-auto"
                  onClick={() => {
                    // This will trigger AI search
                    alert('AI search functionality will be implemented');
                  }}
                >
                  <i className="fa-solid fa-search mr-2"></i>
                  <span className="hidden sm:inline">AI Search</span>
                  <span className="sm:hidden">Search</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
            {/* Class 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => window.location.href = '/class/1'}>
              <CardBody className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Typography variant="h3" style={{color: '#612A74'}} className="font-bold text-lg sm:text-2xl">1</Typography>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2 text-lg sm:text-xl">
                  Class 1
                </Typography>
                <Typography color="gray" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  Foundation learning with basic concepts in Math, Science, English & Hindi
                </Typography>
                 <Typography color="gray" className="text-xs mb-3 sm:mb-4">
                   4 Subjects Available
                 </Typography>
                <Button 
                  style={{backgroundColor: '#612A74'}} 
                  size="sm" 
                  className="w-full text-xs sm:text-sm"
                >
                  View Subjects
                </Button>
              </CardBody>
            </Card>

            {/* Class 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => window.location.href = '/class/2'}>
              <CardBody className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Typography variant="h3" style={{color: '#612A74'}} className="font-bold text-lg sm:text-2xl">2</Typography>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2 text-lg sm:text-xl">
                  Class 2
                </Typography>
                <Typography color="gray" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  Building on fundamentals with expanded curriculum and activities
                </Typography>
                 <Typography color="gray" className="text-xs mb-3 sm:mb-4">
                   4 Subjects Available
                 </Typography>
                <Button 
                  style={{backgroundColor: '#612A74'}} 
                  size="sm" 
                  className="w-full text-xs sm:text-sm"
                >
                  View Subjects
                </Button>
              </CardBody>
            </Card>

            {/* Class 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => window.location.href = '/class/3'}>
              <CardBody className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Typography variant="h3" style={{color: '#612A74'}} className="font-bold text-lg sm:text-2xl">3</Typography>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2 text-lg sm:text-xl">
                  Class 3
                </Typography>
                <Typography color="gray" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  Intermediate concepts with more complex problem-solving
                </Typography>
                 <Typography color="gray" className="text-xs mb-3 sm:mb-4">
                   4 Subjects Available
                 </Typography>
                <Button 
                  style={{backgroundColor: '#612A74'}} 
                  size="sm" 
                  className="w-full text-xs sm:text-sm"
                >
                  View Subjects
                </Button>
              </CardBody>
            </Card>

            {/* Class 4 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => window.location.href = '/class/4'}>
              <CardBody className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Typography variant="h3" style={{color: '#612A74'}} className="font-bold text-lg sm:text-2xl">4</Typography>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2 text-lg sm:text-xl">
                  Class 4
                </Typography>
                <Typography color="gray" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  Advanced primary concepts with practical applications
                </Typography>
                 <Typography color="gray" className="text-xs mb-3 sm:mb-4">
                   4 Subjects Available
                 </Typography>
                <Button 
                  style={{backgroundColor: '#612A74'}} 
                  size="sm" 
                  className="w-full text-xs sm:text-sm"
                >
                  View Subjects
                </Button>
              </CardBody>
            </Card>

            {/* Class 5 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => window.location.href = '/class/5'}>
              <CardBody className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Typography variant="h3" style={{color: '#612A74'}} className="font-bold text-lg sm:text-2xl">5</Typography>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2 text-lg sm:text-xl">
                  Class 5
                </Typography>
                <Typography color="gray" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  Upper primary with comprehensive subject coverage
                </Typography>
                 <Typography color="gray" className="text-xs mb-3 sm:mb-4">
                   4 Subjects Available
                 </Typography>
                <Button 
                  style={{backgroundColor: '#612A74'}} 
                  size="sm" 
                  className="w-full text-xs sm:text-sm"
                >
                  View Subjects
                </Button>
              </CardBody>
            </Card>

            {/* Class 6 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => window.location.href = '/class/6'}>
              <CardBody className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Typography variant="h3" style={{color: '#612A74'}} className="font-bold text-lg sm:text-2xl">6</Typography>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2 text-lg sm:text-xl">
                  Class 6
                </Typography>
                <Typography color="gray" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  Middle school introduction with specialized subjects
                </Typography>
                 <Typography color="gray" className="text-xs mb-3 sm:mb-4">
                   6 Subjects Available
                  </Typography>
                <Button 
                  style={{backgroundColor: '#612A74'}} 
                  size="sm" 
                  className="w-full text-xs sm:text-sm"
                >
                  View Subjects
                  </Button>
              </CardBody>
            </Card>

            {/* Class 7 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => window.location.href = '/class/7'}>
              <CardBody className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Typography variant="h3" style={{color: '#612A74'}} className="font-bold text-lg sm:text-2xl">7</Typography>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2 text-lg sm:text-xl">
                  Class 7
                </Typography>
                <Typography color="gray" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  Advanced middle school with deeper subject knowledge
                </Typography>
                 <Typography color="gray" className="text-xs mb-3 sm:mb-4">
                   6 Subjects Available
                 </Typography>
                <Button 
                  style={{backgroundColor: '#612A74'}} 
                  size="sm" 
                  className="w-full text-xs sm:text-sm"
                >
                  View Subjects
                </Button>
              </CardBody>
            </Card>

            {/* Class 8 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => window.location.href = '/class/8'}>
              <CardBody className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Typography variant="h3" style={{color: '#612A74'}} className="font-bold text-lg sm:text-2xl">8</Typography>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2 text-lg sm:text-xl">
                  Class 8
                </Typography>
                <Typography color="gray" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  Pre-secondary with comprehensive curriculum coverage
                </Typography>
                 <Typography color="gray" className="text-xs mb-3 sm:mb-4">
                   6 Subjects Available
                  </Typography>
                <Button 
                  style={{backgroundColor: '#612A74'}} 
                  size="sm" 
                  className="w-full text-xs sm:text-sm"
                >
                  View Subjects
                  </Button>
              </CardBody>
            </Card>

            {/* Class 9 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => window.location.href = '/class/9'}>
              <CardBody className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Typography variant="h3" style={{color: '#612A74'}} className="font-bold text-lg sm:text-2xl">9</Typography>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2 text-lg sm:text-xl">
                  Class 9
                </Typography>
                <Typography color="gray" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  Secondary school foundation with advanced concepts
                </Typography>
                 <Typography color="gray" className="text-xs mb-3 sm:mb-4">
                   8 Subjects Available
                 </Typography>
                <Button 
                  style={{backgroundColor: '#612A74'}} 
                  size="sm" 
                  className="w-full text-xs sm:text-sm"
                >
                  View Subjects
                </Button>
              </CardBody>
            </Card>

            {/* Class 10 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => window.location.href = '/class/10'}>
              <CardBody className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Typography variant="h3" style={{color: '#612A74'}} className="font-bold text-lg sm:text-2xl">10</Typography>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2 text-lg sm:text-xl">
                  Class 10
                </Typography>
                <Typography color="gray" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  Board exam preparation with comprehensive syllabus
                </Typography>
                 <Typography color="gray" className="text-xs mb-3 sm:mb-4">
                   8 Subjects Available
                  </Typography>
                <Button 
                  style={{backgroundColor: '#612A74'}} 
                  size="sm" 
                  className="w-full text-xs sm:text-sm"
                >
                  View Subjects
                  </Button>
              </CardBody>
            </Card>

            {/* Class 11 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => window.location.href = '/class/11'}>
              <CardBody className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Typography variant="h3" style={{color: '#612A74'}} className="font-bold text-lg sm:text-2xl">11</Typography>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2 text-lg sm:text-xl">
                  Class 11
                </Typography>
                <Typography color="gray" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  Higher secondary with specialized streams
                </Typography>
                 <Typography color="gray" className="text-xs mb-3 sm:mb-4">
                   10 Subjects Available
                 </Typography>
                <Button 
                  style={{backgroundColor: '#612A74'}} 
                  size="sm" 
                  className="w-full text-xs sm:text-sm"
                >
                  View Subjects
                </Button>
              </CardBody>
            </Card>

            {/* Class 12 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => window.location.href = '/class/12'}>
              <CardBody className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Typography variant="h3" style={{color: '#612A74'}} className="font-bold text-lg sm:text-2xl">12</Typography>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2 text-lg sm:text-xl">
                  Class 12
                </Typography>
                <Typography color="gray" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  Final year with competitive exam preparation
                </Typography>
                 <Typography color="gray" className="text-xs mb-3 sm:mb-4">
                   10 Subjects Available
                 </Typography>
                <Button 
                  style={{backgroundColor: '#612A74'}} 
                  size="sm" 
                  className="w-full text-xs sm:text-sm"
                >
                  View Subjects
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* Quick Access Section */}
          <div className="text-center mt-12 sm:mt-16 px-4 sm:px-0">
            <Typography variant="h4" color="blue-gray" className="mb-4 text-xl sm:text-2xl lg:text-3xl">
              Need Help Finding Specific Materials?
            </Typography>
            <Typography color="gray" className="mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              Our comprehensive collection includes over 300+ educational resources across all classes. 
              Use our AI-powered search to find exactly what you need.
            </Typography>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button
                 variant="outlined"
                 style={{borderColor: '#612A74', color: '#612A74'}}
                 size="lg"
                 className="w-full sm:w-auto"
                 onClick={() => window.location.href = '/help'}
               >
                 <i className="fa-solid fa-question-circle mr-2"></i>
                 Get Help
               </Button>
             </div>
          </div>
        </div>
      </section>

      {/* Developer Resources */}
      <section id="developer-section" className="py-28 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Typography color="blue-gray" className="mb-2 font-bold uppercase">
              Developer Resources
            </Typography>
            <Typography variant="h2" color="blue-gray" className="mb-4">
              API Documentation & Integration
            </Typography>
            <Typography color="gray" className="text-lg max-w-2xl mx-auto">
              Technical documentation for developers looking to integrate PAATA.AI into their applications
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <i className="fa-solid fa-code text-2xl text-blue-600"></i>
                </div>
                <Typography variant="h4" color="blue-gray" className="mb-4">
                  API Reference
                </Typography>
                <Typography color="gray" className="mb-6">
                  Complete API documentation with endpoints, parameters, and response formats for all PAATA.AI services.
                </Typography>
                <Button variant="text" style={{color: '#612A74'}} className="p-0">
                  View API Docs <i className="fa-solid fa-arrow-right ml-2"></i>
                  </Button>
              </CardBody>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <i className="fa-solid fa-key text-2xl text-green-600"></i>
                </div>
                <Typography variant="h4" color="blue-gray" className="mb-4">
                  Authentication
                </Typography>
                <Typography color="gray" className="mb-6">
                  Learn how to authenticate your applications and manage API keys for secure access to PAATA.AI services.
                </Typography>
                <Button variant="text" style={{color: '#612A74'}} className="p-0">
                  Authentication Guide <i className="fa-solid fa-arrow-right ml-2"></i>
                </Button>
              </CardBody>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <i className="fa-solid fa-rocket text-2xl text-purple-600"></i>
                </div>
                <Typography variant="h4" color="blue-gray" className="mb-4">
                  Quick Start
                </Typography>
                <Typography color="gray" className="mb-6">
                  Get up and running quickly with our step-by-step integration guide and sample code snippets.
                </Typography>
                <Button variant="text" style={{color: '#612A74'}} className="p-0">
                  Start Integration <i className="fa-solid fa-arrow-right ml-2"></i>
                  </Button>
              </CardBody>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                  <i className="fa-solid fa-cogs text-2xl text-orange-600"></i>
                </div>
                <Typography variant="h4" color="blue-gray" className="mb-4">
                  SDKs & Libraries
                </Typography>
                <Typography color="gray" className="mb-6">
                  Download our official SDKs and libraries for popular programming languages to simplify integration.
                </Typography>
                <Button variant="text" style={{color: '#612A74'}} className="p-0">
                  Download SDKs <i className="fa-solid fa-arrow-right ml-2"></i>
                </Button>
              </CardBody>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="p-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                  <i className="fa-solid fa-exclamation-triangle text-2xl text-indigo-600"></i>
                </div>
                <Typography variant="h4" color="blue-gray" className="mb-4">
                  Error Handling
                </Typography>
                <Typography color="gray" className="mb-6">
                  Comprehensive guide to handling errors, rate limits, and troubleshooting common integration issues.
                </Typography>
                <Button variant="text" style={{color: '#612A74'}} className="p-0">
                  Error Guide <i className="fa-solid fa-arrow-right ml-2"></i>
                  </Button>
              </CardBody>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardBody className="p-8">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                  <i className="fa-solid fa-users text-2xl text-teal-600"></i>
                </div>
                <Typography variant="h4" color="blue-gray" className="mb-4">
                  Community Support
                </Typography>
                <Typography color="gray" className="mb-6">
                  Join our developer community for support, discussions, and sharing best practices for PAATA.AI integration.
                </Typography>
                <Button variant="text" style={{color: '#612A74'}} className="p-0">
                  Join Community <i className="fa-solid fa-arrow-right ml-2"></i>
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-28 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Typography color="blue-gray" className="mb-2 font-bold uppercase">
              Frequently Asked Questions
            </Typography>
            <Typography variant="h2" color="blue-gray" className="mb-4">
              Common Questions & Answers
            </Typography>
            <Typography color="gray" className="text-lg max-w-2xl mx-auto">
              Find answers to common questions about PAATA.AI features and usage
            </Typography>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <Card className="border-0 shadow-lg">
                <CardBody className="p-6">
                  <Typography variant="h5" color="blue-gray" className="mb-3">
                    How do I get started with PAATA.AI?
                  </Typography>
                  <Typography color="gray" className="mb-4">
                    Getting started is easy! Simply sign up for an account, choose your learning preferences, and start asking questions. Our AI will adapt to your learning style and provide personalized responses.
                  </Typography>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <i className="fa-solid fa-clock"></i>
                    <span>Last updated: October 2024</span>
                  </div>
                </CardBody>
              </Card>

              {/* FAQ Item 2 */}
              <Card className="border-0 shadow-lg">
                <CardBody className="p-6">
                  <Typography variant="h5" color="blue-gray" className="mb-3">
                    What types of questions can I ask?
                  </Typography>
                  <Typography color="gray" className="mb-4">
                    You can ask any academic question across subjects like Mathematics, Science, History, Literature, and more. Our AI can help with homework, explain concepts, solve problems, and provide step-by-step solutions.
                  </Typography>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <i className="fa-solid fa-clock"></i>
                    <span>Last updated: October 2024</span>
                  </div>
                </CardBody>
              </Card>

              {/* FAQ Item 3 */}
              <Card className="border-0 shadow-lg">
                <CardBody className="p-6">
                  <Typography variant="h5" color="blue-gray" className="mb-3">
                    How accurate are the AI responses?
                  </Typography>
                  <Typography color="gray" className="mb-4">
                    Our AI is trained on vast educational content and provides highly accurate responses. However, we always recommend verifying important information and using our responses as a learning aid rather than a final answer.
                  </Typography>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <i className="fa-solid fa-clock"></i>
                    <span>Last updated: October 2024</span>
                  </div>
                </CardBody>
              </Card>

              {/* FAQ Item 4 */}
              <Card className="border-0 shadow-lg">
                <CardBody className="p-6">
                  <Typography variant="h5" color="blue-gray" className="mb-3">
                    Can I upload images for analysis?
                  </Typography>
                  <Typography color="gray" className="mb-4">
                    Yes! You can upload images of problems, diagrams, or text, and our AI will analyze them using OCR technology to extract text and provide relevant answers.
                  </Typography>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <i className="fa-solid fa-clock"></i>
                    <span>Last updated: October 2024</span>
                  </div>
                </CardBody>
              </Card>

              {/* FAQ Item 5 */}
              <Card className="border-0 shadow-lg">
                <CardBody className="p-6">
                  <Typography variant="h5" color="blue-gray" className="mb-3">
                    Is my data secure and private?
                  </Typography>
                  <Typography color="gray" className="mb-4">
                    Absolutely. We take privacy seriously and use industry-standard encryption to protect your data. Your conversations and personal information are never shared with third parties.
                  </Typography>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <i className="fa-solid fa-clock"></i>
                    <span>Last updated: October 2024</span>
                  </div>
                </CardBody>
              </Card>

              {/* FAQ Item 6 */}
              <Card className="border-0 shadow-lg">
                <CardBody className="p-6">
                  <Typography variant="h5" color="blue-gray" className="mb-3">
                    How do I change my subscription plan?
                  </Typography>
                  <Typography color="gray" className="mb-4">
                    You can upgrade or downgrade your plan anytime from your profile settings. Changes take effect immediately, and you'll be charged or credited accordingly.
                  </Typography>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <i className="fa-solid fa-clock"></i>
                    <span>Last updated: October 2024</span>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Contact Support */}
          <div className="text-center mt-16">
            <Typography variant="h4" color="blue-gray" className="mb-4">
              Still have questions?
            </Typography>
            <Typography color="gray" className="mb-6 max-w-2xl mx-auto">
              Our support team is here to help. Contact us for personalized assistance with any questions or issues.
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                style={{backgroundColor: '#612A74'}}
                size="lg"
                onClick={() => window.location.href = '/help'}
              >
                <i className="fa-solid fa-headset mr-2"></i>
                Contact Support
              </Button>
              <Button
                variant="outlined"
                style={{borderColor: '#612A74', color: '#612A74'}}
                size="lg"
                onClick={() => window.location.href = '/contact'}
              >
                <i className="fa-solid fa-envelope mr-2"></i>
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Guide Modal */}
      {showOnboardingGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <Typography variant="h3" color="blue-gray">
                Complete Onboarding Guide
              </Typography>
              <Button
                variant="text"
                color="gray"
                onClick={() => setShowOnboardingGuide(false)}
                className="p-2"
              >
                <i className="fa-solid fa-times text-xl"></i>
              </Button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Welcome Section */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-rocket text-3xl text-[#612A74]"></i>
                </div>
                <Typography variant="h4" color="blue-gray" className="mb-4">
                  Welcome to PAATA.AI! 🎉
                </Typography>
                <Typography color="gray" className="text-lg max-w-2xl mx-auto">
                  This comprehensive guide will help you get the most out of your PAATA.AI experience. 
                  Follow these steps to become a power user!
                </Typography>
              </div>

              {/* Step 1: Account Setup */}
              <Card className="border-0 shadow-lg">
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Typography variant="h5" style={{color: '#612A74'}} className="font-bold">1</Typography>
                    </div>
                    <div className="flex-1">
                      <Typography variant="h5" color="blue-gray" className="mb-3">
                        <i className="fa-solid fa-user-plus mr-2 text-blue-600"></i>
                        Account Setup & Profile Configuration
                      </Typography>
                      <div className="space-y-3">
                        <div>
                          <Typography color="blue-gray" className="font-semibold mb-2">Create Your Account:</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Click "Sign Up" on the homepage or login page</li>
                            <li>Enter your email address and create a secure password</li>
                            <li>Verify your email address through the confirmation link</li>
                            <li>Complete your profile with basic information</li>
                          </ul>
                        </div>
                        <div>
                          <Typography color="blue-gray" className="font-semibold mb-2">Configure Learning Preferences:</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Set your preferred subjects (Math, Science, English, etc.)</li>
                            <li>Choose your difficulty level (Beginner, Intermediate, Advanced)</li>
                            <li>Select your learning style (Visual, Auditory, Kinesthetic)</li>
                            <li>Enable notifications for study reminders</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Step 2: First Conversation */}
              <Card className="border-0 shadow-lg">
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Typography variant="h5" style={{color: '#612A74'}} className="font-bold">2</Typography>
                    </div>
                    <div className="flex-1">
                      <Typography variant="h5" color="blue-gray" className="mb-3">
                        <i className="fa-solid fa-comments mr-2 text-green-600"></i>
                        Starting Your First Conversation
                      </Typography>
                      <div className="space-y-3">
                        <div>
                          <Typography color="blue-gray" className="font-semibold mb-2">Access the Chat Interface:</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Click "Try Now" on the homepage or navigate to /app</li>
                            <li>Sign in if you haven't already</li>
                            <li>You'll see the chat interface with a welcome message</li>
                          </ul>
                        </div>
                        <div>
                          <Typography color="blue-gray" className="font-semibold mb-2">Ask Your First Question:</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Type your question in the input field at the bottom</li>
                            <li>Be specific about what you need help with</li>
                            <li>Include context like the language you need the response in</li>
                            <li>Press Enter or click the send button</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <Typography color="blue-gray" className="font-semibold mb-2">💡 Pro Tips:</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Start with simple questions to get familiar with the AI</li>
                            <li>Ask for step-by-step explanations for complex problems</li>
                            <li>Request examples to better understand concepts</li>
                            <li>Use follow-up questions to dive deeper into topics</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Step 3: Image Analysis */}
              <Card className="border-0 shadow-lg">
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Typography variant="h5" style={{color: '#612A74'}} className="font-bold">3</Typography>
                    </div>
                    <div className="flex-1">
                      <Typography variant="h5" color="blue-gray" className="mb-3">
                        <i className="fa-solid fa-image mr-2 text-purple-600"></i>
                        Using Image Analysis Features
                      </Typography>
                      <div className="space-y-3">
                        <div>
                          <Typography color="blue-gray" className="font-semibold mb-2">Upload Images for Analysis:</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Click the camera icon in the chat input field</li>
                            <li>Select an image from your device or take a photo</li>
                            <li>Supported formats: JPG, PNG, GIF, WebP</li>
                            <li>Maximum file size: 10MB</li>
                          </ul>
                        </div>
                        <div>
                          <Typography color="blue-gray" className="font-semibold mb-2">Best Practices for Image Uploads:</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Ensure good lighting and clear text visibility</li>
                            <li>Upload high-resolution images for better OCR results</li>
                            <li>Include context in your message along with the image</li>
                            <li>Try different angles if text recognition fails</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <Typography color="blue-gray" className="font-semibold mb-2">📸 What You Can Upload:</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Math problems and equations</li>
                            <li>Science diagrams and charts</li>
                            <li>Handwritten notes and assignments</li>
                            <li>Textbook pages and study materials</li>
                            <li>Graphs and data visualizations</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Step 4: Voice Features */}
              <Card className="border-0 shadow-lg">
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Typography variant="h5" style={{color: '#612A74'}} className="font-bold">4</Typography>
                    </div>
                    <div className="flex-1">
                      <Typography variant="h5" color="blue-gray" className="mb-3">
                        <i className="fa-solid fa-microphone mr-2 text-orange-600"></i>
                        Voice Input & Output Features
                      </Typography>
                      <div className="space-y-3">
                        <div>
                          <Typography color="blue-gray" className="font-semibold mb-2">Voice Input (Speech-to-Text):</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Click the microphone icon in the chat input field</li>
                            <li>Allow microphone permissions when prompted</li>
                            <li>Speak clearly and at a moderate pace</li>
                            <li>Click the microphone again to stop recording</li>
                          </ul>
                        </div>
                        <div>
                          <Typography color="blue-gray" className="font-semibold mb-2">Voice Output (Text-to-Speech):</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Click the speaker icon next to any AI response</li>
                            <li>Listen to responses in multiple languages</li>
                            <li>Use pause/play controls to manage playback</li>
                            <li>Adjust volume using your device controls</li>
                          </ul>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <Typography color="blue-gray" className="font-semibold mb-2">🎤 Voice Tips:</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Speak in a quiet environment for better accuracy</li>
                            <li>Use voice input for hands-free studying</li>
                            <li>Listen to responses while doing other activities</li>
                            <li>Great for auditory learners and accessibility</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Step 5: Advanced Settings */}
              <Card className="border-0 shadow-lg">
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Typography variant="h5" style={{color: '#612A74'}} className="font-bold">5</Typography>
                    </div>
                    <div className="flex-1">
                      <Typography variant="h5" color="blue-gray" className="mb-3">
                        <i className="fa-solid fa-cog mr-2 text-indigo-600"></i>
                        Customizing Your Experience
                      </Typography>
                      <div className="space-y-3">
                        <div>
                          <Typography color="blue-gray" className="font-semibold mb-2">Access Settings:</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Click on your profile avatar in the top right</li>
                            <li>Select "Settings" from the dropdown menu</li>
                            <li>Navigate through different setting categories</li>
                          </ul>
                        </div>
                        <div>
                          <Typography color="blue-gray" className="font-semibold mb-2">Key Settings to Configure:</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li><strong>Learning Preferences:</strong> Adjust difficulty level and learning style</li>
                            <li><strong>Notifications:</strong> Set study reminders and achievement alerts</li>
                            <li><strong>Privacy:</strong> Control data sharing and conversation history</li>
                            <li><strong>Accessibility:</strong> Enable high contrast, larger text, etc.</li>
                            <li><strong>Language:</strong> Set your preferred language for responses</li>
                          </ul>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <Typography color="blue-gray" className="font-semibold mb-2">⚙️ Pro Settings:</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Enable dark mode for comfortable night studying</li>
                            <li>Set up keyboard shortcuts for power users</li>
                            <li>Configure auto-save for long conversations</li>
                            <li>Customize response length and detail level</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Step 6: Mobile App Usage */}
              <Card className="border-0 shadow-lg">
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Typography variant="h5" style={{color: '#612A74'}} className="font-bold">6</Typography>
                    </div>
                    <div className="flex-1">
                      <Typography variant="h5" color="blue-gray" className="mb-3">
                        <i className="fa-solid fa-mobile-alt mr-2 text-teal-600"></i>
                        Mobile App Features
                      </Typography>
                      <div className="space-y-3">
                        <div>
                          <Typography color="blue-gray" className="font-semibold mb-2">Download & Install:</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Download from App Store (iOS) or Google Play (Android)</li>
                            <li>Sign in with your existing account</li>
                            <li>Sync your preferences and conversation history</li>
                          </ul>
                        </div>
                        <div>
                          <Typography color="blue-gray" className="font-semibold mb-2">Mobile-Specific Features:</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li><strong>Offline Mode:</strong> Access saved conversations without internet</li>
                            <li><strong>Push Notifications:</strong> Get study reminders and updates</li>
                            <li><strong>Camera Integration:</strong> Take photos directly in the app</li>
                            <li><strong>Voice Commands:</strong> Hands-free operation</li>
                            <li><strong>Quick Actions:</strong> Widgets and shortcuts</li>
                          </ul>
                        </div>
                        <div className="bg-teal-50 p-4 rounded-lg">
                          <Typography color="blue-gray" className="font-semibold mb-2">📱 Mobile Tips:</Typography>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Use landscape mode for better text input</li>
                            <li>Enable haptic feedback for better interaction</li>
                            <li>Set up Siri/Google Assistant shortcuts</li>
                            <li>Use split-screen for multitasking</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Best Practices Section */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <CardBody className="p-6">
                  <Typography variant="h5" color="blue-gray" className="mb-4 text-center">
                    <i className="fa-solid fa-star mr-2 text-yellow-500"></i>
                    Best Practices for Effective Learning
                  </Typography>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Typography color="blue-gray" className="font-semibold mb-3">📚 Study Strategies:</Typography>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Ask specific questions rather than broad topics</li>
                        <li>Break complex problems into smaller steps</li>
                        <li>Use follow-up questions to deepen understanding</li>
                        <li>Review previous conversations regularly</li>
                        <li>Practice with similar problems after getting help</li>
                      </ul>
                    </div>
                    <div>
                      <Typography color="blue-gray" className="font-semibold mb-3">🎯 Getting Better Results:</Typography>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Specify the language you want the response in (English, Hindi, etc.)</li>
                        <li>Include what you've already tried or know</li>
                        <li>Ask for explanations, not just answers</li>
                        <li>Request examples and practice problems</li>
                        <li>Use the feedback system to improve responses</li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Troubleshooting Section */}
              <Card className="border-0 shadow-lg bg-gray-50">
                <CardBody className="p-6">
                  <Typography variant="h5" color="blue-gray" className="mb-4 text-center">
                    <i className="fa-solid fa-tools mr-2 text-gray-600"></i>
                    Troubleshooting Common Issues
                  </Typography>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Typography color="blue-gray" className="font-semibold mb-3">🔧 Technical Issues:</Typography>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li><strong>Slow responses:</strong> Check your internet connection</li>
                        <li><strong>Image not uploading:</strong> Ensure file size is under 10MB</li>
                        <li><strong>Voice not working:</strong> Check microphone permissions</li>
                        <li><strong>Login issues:</strong> Clear browser cache and cookies</li>
                      </ul>
                    </div>
                    <div>
                      <Typography color="blue-gray" className="font-semibold mb-3">❓ Getting Help:</Typography>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Check our FAQ section for common questions</li>
                        <li>Contact support via WhatsApp: +91 99003 61943</li>
                        <li>Email us at support@paata.ai</li>
                        <li>Use the feedback form to report issues</li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Call to Action */}
              <div className="text-center bg-gradient-to-r from-[#612A74] to-purple-600 text-white p-8 rounded-2xl">
                <Typography variant="h4" className="mb-4">
                  Ready to Start Learning? 🚀
                </Typography>
                <Typography className="mb-6 text-lg opacity-90">
                  You're now equipped with everything you need to make the most of PAATA.AI. 
                  Start your learning journey today!
                </Typography>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    color="white"
                    size="lg"
                    onClick={() => window.location.href = '/app'}
                    className="px-8"
                  >
                    <i className="fa-solid fa-comments mr-2"></i>
                    Start Chatting Now
                  </Button>
                  <Button
                    variant="outlined"
                    color="white"
                    size="lg"
                    onClick={() => setShowOnboardingGuide(false)}
                    className="px-8"
                  >
                    <i className="fa-solid fa-check mr-2"></i>
                    Got It, Thanks!
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}