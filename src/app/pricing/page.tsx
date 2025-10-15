"use client";

import { Navbar, Footer } from "@/components";
import { Typography, Button, Card, CardBody } from "@material-tailwind/react";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative min-h-screen w-full">
        <div className="grid !min-h-[49rem] bg-gray-900 px-8">
          <div className="container mx-auto mt-32 grid h-full w-full grid-cols-1 place-items-center lg:mt-14 lg:grid-cols-2">
            <div className="col-span-1">
              <Typography variant="h1" color="white" className="mb-4">
                Simple, Transparent <br /> Pricing
              </Typography>
              <Typography
                variant="lead"
                className="mb-7 !text-white md:pr-16 xl:pr-28"
              >
                Get started with our Enterprise plan - now available to all new users! 
                Enjoy unlimited access to all premium features from day one.
              </Typography>
              <div className="flex flex-col gap-2 md:mb-2 md:w-10/12 md:flex-row">
                <Button
                  size="lg"
                  color="white"
                  className="flex justify-center items-center gap-3"
                  onClick={() => window.location.href = '/app'}
                >
                  <i className="fa-solid fa-rocket"></i>
                  Get Enterprise Access
                </Button>
              </div>
            </div>
            <div className="col-span-1 my-20 h-full max-h-[30rem] -translate-y-32 md:max-h-[36rem] lg:my-0 lg:ml-auto lg:max-h-[40rem] lg:translate-y-0">
              <div className="relative">
                <div className="absolute inset-0 bg-[#612A74] rounded-3xl transform -rotate-3"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <Typography variant="h4" color="blue-gray" className="mb-4">
                    Now Available to All!
                  </Typography>
                  <div className="text-center">
                    <Typography variant="h2" style={{color: '#612A74'}} className="mb-2">
                      FREE
                    </Typography>
                    <Typography color="gray" className="mb-4">
                      for new users
                    </Typography>
                    <Button style={{backgroundColor: '#612A74'}} size="sm" className="w-full">
                      Get Enterprise
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <section className="py-28 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Typography color="blue-gray" className="mb-2 font-bold uppercase">
              Pricing Plans
            </Typography>
            <Typography variant="h2" color="blue-gray" className="mb-4">
              Choose Your Perfect Plan
            </Typography>
            <Typography color="gray" className="text-lg max-w-2xl mx-auto">
              All new users get Enterprise access automatically! Enjoy unlimited features, 
              priority support, and advanced analytics from day one.
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="border-0 shadow-lg">
              <CardBody className="p-8">
                <div className="text-center mb-8">
                  <Typography variant="h4" color="blue-gray" className="mb-2">
                    Free
                  </Typography>
                  <Typography variant="h1" color="blue-gray" className="mb-2">
                    ₹0
                  </Typography>
                  <Typography color="gray">
                    per month
                  </Typography>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">5 questions per day</Typography>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">Basic AI responses</Typography>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">Mobile app access</Typography>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">Community support</Typography>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">Basic progress tracking</Typography>
                  </li>
                </ul>
                
                <Button variant="outlined" style={{borderColor: '#612A74', color: '#612A74'}} className="w-full">
                  Get Started Free
                </Button>
              </CardBody>
            </Card>

            {/* Pro Plan */}
            <Card className="border-0 shadow-lg">
              <CardBody className="p-8">
                <div className="text-center mb-8">
                  <Typography variant="h4" color="blue-gray" className="mb-2">
                    Pro
                  </Typography>
                  <Typography variant="h1" color="blue-gray" className="mb-2">
                    ₹99
                  </Typography>
                  <Typography color="gray">
                    per month
                  </Typography>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">Unlimited questions</Typography>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">Advanced AI responses</Typography>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">Step-by-step solutions</Typography>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">Priority support</Typography>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">Advanced progress tracking</Typography>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">Gamified achievements</Typography>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">Multilingual support</Typography>
                  </li>
                </ul>
                
                <Button style={{backgroundColor: '#612A74'}} className="w-full">
                  Choose Pro
                </Button>
              </CardBody>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 shadow-xl relative" style={{borderColor: '#612A74'}}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="text-white px-4 py-1 rounded-full text-sm font-semibold" style={{backgroundColor: '#612A74'}}>
                  Default for New Users
                </div>
              </div>
              <CardBody className="p-8">
                <div className="text-center mb-8">
                  <Typography variant="h4" color="blue-gray" className="mb-2">
                    Enterprise
                  </Typography>
                  <Typography variant="h1" color="blue-gray" className="mb-2">
                    FREE
                  </Typography>
                  <Typography color="gray">
                    for new accounts
                  </Typography>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">Everything in Pro</Typography>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">Custom integrations</Typography>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">Dedicated support</Typography>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">Advanced analytics</Typography>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">White-label options</Typography>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fa-solid fa-check w-5 h-5 text-[#612A74]"></i>
                    <Typography color="gray">SLA guarantees</Typography>
                  </li>
                </ul>
                
                <Button style={{backgroundColor: '#612A74'}} className="w-full">
                  Get Started Free
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-28 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Typography color="blue-gray" className="mb-2 font-bold uppercase">
              Feature Comparison
            </Typography>
            <Typography variant="h2" color="blue-gray" className="mb-4">
              See What&apos;s Included
            </Typography>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-2xl shadow-lg">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-6">
                      <Typography variant="h6" color="blue-gray">
                        Features
                      </Typography>
                    </th>
                    <th className="text-center p-6">
                      <Typography variant="h6" color="blue-gray">
                        Free
                      </Typography>
                    </th>
                    <th className="text-center p-6">
                      <Typography variant="h6" color="blue-gray">
                        Pro
                      </Typography>
                    </th>
                    <th className="text-center p-6">
                      <Typography variant="h6" color="blue-gray">
                        Enterprise
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-6">
                      <Typography color="blue-gray" className="font-medium">
                        Questions per day
                      </Typography>
                    </td>
                    <td className="text-center p-6">
                      <Typography color="gray">5</Typography>
                    </td>
                    <td className="text-center p-6">
                      <Typography color="gray">Unlimited</Typography>
                    </td>
                    <td className="text-center p-6">
                      <Typography color="gray">Unlimited</Typography>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-6">
                      <Typography color="blue-gray" className="font-medium">
                        AI Response Quality
                      </Typography>
                    </td>
                    <td className="text-center p-6">
                      <Typography color="gray">Basic</Typography>
                    </td>
                    <td className="text-center p-6">
                      <Typography color="gray">Advanced</Typography>
                    </td>
                    <td className="text-center p-6">
                      <Typography color="gray">Premium</Typography>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-6">
                      <Typography color="blue-gray" className="font-medium">
                        Step-by-step Solutions
                      </Typography>
                    </td>
                    <td className="text-center p-6">
                      <i className="fa-solid fa-times text-gray-400"></i>
                    </td>
                    <td className="text-center p-6">
                      <i className="fa-solid fa-check text-[#612A74]"></i>
                    </td>
                    <td className="text-center p-6">
                      <i className="fa-solid fa-check text-[#612A74]"></i>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-6">
                      <Typography color="blue-gray" className="font-medium">
                        Priority Support
                      </Typography>
                    </td>
                    <td className="text-center p-6">
                      <i className="fa-solid fa-times text-gray-400"></i>
                    </td>
                    <td className="text-center p-6">
                      <i className="fa-solid fa-check text-[#612A74]"></i>
                    </td>
                    <td className="text-center p-6">
                      <i className="fa-solid fa-check text-[#612A74]"></i>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-6">
                      <Typography color="blue-gray" className="font-medium">
                        Custom Integrations
                      </Typography>
                    </td>
                    <td className="text-center p-6">
                      <i className="fa-solid fa-times text-gray-400"></i>
                    </td>
                    <td className="text-center p-6">
                      <i className="fa-solid fa-times text-gray-400"></i>
                    </td>
                    <td className="text-center p-6">
                      <i className="fa-solid fa-check text-[#612A74]"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-28 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Typography color="blue-gray" className="mb-2 font-bold uppercase">
              Frequently Asked
            </Typography>
            <Typography variant="h2" color="blue-gray" className="mb-4">
              Pricing Questions
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Can I change plans anytime?
              </Typography>
              <Typography color="gray">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </Typography>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Is there a free trial?
              </Typography>
              <Typography color="gray">
                Yes! You can start with our free plan and upgrade when you need more features.
              </Typography>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                What payment methods do you accept?
              </Typography>
              <Typography color="gray">
                We accept UPI, credit/debit cards, net banking, and digital wallets like Paytm, PhonePe, and Google Pay for Indian customers.
              </Typography>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Do you offer student discounts?
              </Typography>
              <Typography color="gray">
                Yes! Students with valid .edu email addresses get 50% off all paid plans. Pro plan available for just ₹399/month for students.
              </Typography>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
