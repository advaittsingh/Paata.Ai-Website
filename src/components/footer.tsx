"use client";
import Image from "next/image";
import Link from "next/link";
import { Typography, IconButton, Button } from "@material-tailwind/react";
import { useComingSoonModal } from "@/components/coming-soon-modal";

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const { ComingSoonModal, openModal } = useComingSoonModal();
  return (
    <footer className="mt-10 bg-gray-900 px-4 sm:px-8 pt-8 sm:pt-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <Link href="/">
            <Typography
              variant="h5"
              color="white"
                className="mb-3 sm:mb-4 text-lg sm:text-xl hover:opacity-80 transition-opacity cursor-pointer"
            >
              PAATA.AI
            </Typography>
            </Link>
            <Typography color="white" className="mb-4 font-normal text-sm sm:text-base opacity-90">
            From doubt to done — with Paata.ai.
            </Typography>
          </div>

          {/* Main Navigation */}
          <div className="text-center md:text-left">
            <Typography variant="h6" color="white" className="mb-4 text-base sm:text-lg font-semibold">
              Navigation
            </Typography>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white text-sm hover:text-gray-300 transition-colors opacity-90 hover:opacity-100">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white text-sm hover:text-gray-300 transition-colors opacity-90 hover:opacity-100">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-white text-sm hover:text-gray-300 transition-colors opacity-90 hover:opacity-100">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/learning" className="text-white text-sm hover:text-gray-300 transition-colors opacity-90 hover:opacity-100">
                  Learning Materials
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Help */}
          <div className="text-center md:text-left">
            <Typography variant="h6" color="white" className="mb-4 text-base sm:text-lg font-semibold">
              Support
            </Typography>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-white text-sm hover:text-gray-300 transition-colors opacity-90 hover:opacity-100">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-white text-sm hover:text-gray-300 transition-colors opacity-90 hover:opacity-100">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-white text-sm hover:text-gray-300 transition-colors opacity-90 hover:opacity-100">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <Typography variant="h6" color="white" className="mb-4 text-base sm:text-lg font-semibold">
              Legal
                  </Typography>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/terms" className="text-white text-sm hover:text-gray-300 transition-colors opacity-90 hover:opacity-100">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-white text-sm hover:text-gray-300 transition-colors opacity-90 hover:opacity-100">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/refund" className="text-white text-sm hover:text-gray-300 transition-colors opacity-90 hover:opacity-100">
                  Refund Policy
                </Link>
                </li>
            </ul>
          </div>

          {/* App Download */}
          <div className="text-center md:text-left">
            <Typography variant="h6" color="white" className="mb-3 text-base sm:text-lg font-semibold">
              Get the app
            </Typography>
            <div className="flex flex-col gap-2">
              <Button
                color="white"
                className="flex items-center justify-center text-xs sm:text-sm py-2 sm:py-3"
                onClick={openModal}
              >
                <Image
                  width={256}
                  height={256}
                  src="/logos/logo-apple.png"
                  className="-mt-0.5 mr-2 h-4 w-4 sm:h-6 sm:w-6"
                  alt="ios"
                />
                App Store
              </Button>
              <Button
                color="white"
                className="flex items-center justify-center text-xs sm:text-sm py-2 sm:py-3"
                onClick={openModal}
              >
                <Image
                  width={256}
                  height={256}
                  src="/logos/logo-google.png"
                  className="-mt-0.5 mr-2 h-4 w-4 sm:h-6 sm:w-6"
                  alt="android"
                />
                Google Play
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-y-4 gap-x-6 sm:gap-x-8 border-t border-gray-700 py-6 sm:py-7 md:justify-between">
          <Typography
            color="white"
            className="text-center font-normal opacity-75 text-xs sm:text-sm"
          >
            &copy; PAATA.AI Pvt Ltd. All Rights Reserved
          </Typography>

          <div className="flex gap-2">
            <IconButton variant="text" color="white" className="h-8 w-8 sm:h-10 sm:w-10">
              <i className="fa-brands fa-twitter text-lg sm:text-2xl not-italic opacity-75"></i>
            </IconButton>
            <IconButton variant="text" color="white" className="h-8 w-8 sm:h-10 sm:w-10">
              <i className="fa-brands fa-linkedin text-lg sm:text-2xl not-italic opacity-75"></i>
            </IconButton>
            <IconButton variant="text" color="white" className="h-8 w-8 sm:h-10 sm:w-10">
              <i className="fa-brands fa-facebook text-lg sm:text-2xl not-italic opacity-75"></i>
            </IconButton>
            <IconButton variant="text" color="white" className="h-8 w-8 sm:h-10 sm:w-10">
              <i className="fa-brands fa-github text-lg sm:text-2xl not-italic opacity-75"></i>
            </IconButton>
            <IconButton variant="text" color="white" className="h-8 w-8 sm:h-10 sm:w-10">
              <i className="fa-brands fa-dribbble text-lg sm:text-2xl not-italic opacity-75"></i>
            </IconButton>
          </div>
        </div>
      </div>
      
      {/* Coming Soon Modal */}
      <ComingSoonModal />
    </footer>
  );
}

export default Footer;
