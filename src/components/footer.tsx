"use client";
import Image from "next/image";
import { Typography, IconButton, Button } from "@material-tailwind/react";
import { useComingSoonModal } from "@/components/coming-soon-modal";

const LINKS = [];
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const { ComingSoonModal, openModal } = useComingSoonModal();
  return (
    <footer className="mt-10 bg-gray-900 px-4 sm:px-8 pt-8 sm:pt-12">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:justify-between">
          <div className="text-center md:text-left">
            <Typography
              as="a"
              href="#!"
              variant="h5"
              color="white"
              className="mb-3 sm:mb-4 text-lg sm:text-xl"
            >
              PAATA.AI
            </Typography>
            <Typography color="white" className="mb-8 sm:mb-12 font-normal text-sm sm:text-base">
            From doubt to done — with Paata.ai.
            </Typography>
            <ul className="flex flex-wrap items-center justify-center md:justify-start">
              {LINKS.map((link, idx) => (
                <li key={link}>
                  <Typography
                    as="a"
                    href="#!"
                    color="white"
                    className={`py-1 font-medium transition-colors ${
                      idx === 0 ? "pr-3" : "px-3"
                    }`}
                  >
                    {link}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 sm:mt-8 w-full md:mt-0 md:w-auto">
            <Typography variant="h6" color="white" className="mb-3 text-base sm:text-lg">
              Get the app
            </Typography>
            <div className="flex flex-col gap-2 max-w-xs mx-auto md:mx-0">
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
