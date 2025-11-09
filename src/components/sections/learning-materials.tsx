"use client";

import React from 'react';
import { Typography, Button, Card, CardBody } from "@material-tailwind/react";
import Link from "next/link";

export function LearningMaterials() {
  return (
    <section className="py-28 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Typography color="blue-gray" className="mb-2 font-bold uppercase">
              Personalized Learning
            </Typography>
            <Typography variant="h2" color="blue-gray" className="mb-4">
              Access Your Class-Specific Study Materials
            </Typography>
            <Typography
              variant="lead"
              className="mb-6 !text-gray-500"
            >
              Our Learning Materials page provides personalized content based on your class and board selection. 
              Browse subjects, videos, and books tailored to your curriculum. Easily update your class and board 
              preferences in your profile settings anytime.
            </Typography>
            <div className="flex flex-col gap-2 md:mb-2 md:w-10/12 md:flex-row">
              <Link href="/learning">
                <Button 
                  size="lg"
                  color="white"
                  className="flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-book-open"></i>
                  Explore Learning Materials
                </Button>
              </Link>
              
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 gap-y-12">
            <Card className="border-0 shadow-md">
              <CardBody className="p-6 text-center">
                <div className="mb-4 grid h-12 w-12 place-content-center rounded-lg bg-gray-900 text-white mx-auto">
                  <i className="fa-solid fa-book text-xl"></i>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Subjects
                </Typography>
                <Typography color="gray" className="text-sm">
                  Access all subjects for your class
                </Typography>
              </CardBody>
            </Card>
            <Card className="border-0 shadow-md">
              <CardBody className="p-6 text-center">
                <div className="mb-4 grid h-12 w-12 place-content-center rounded-lg bg-gray-900 text-white mx-auto">
                  <i className="fa-solid fa-video text-xl"></i>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Videos
                </Typography>
                <Typography color="gray" className="text-sm">
                  Interactive video lessons
                </Typography>
              </CardBody>
            </Card>
            <Card className="border-0 shadow-md">
              <CardBody className="p-6 text-center">
                <div className="mb-4 grid h-12 w-12 place-content-center rounded-lg bg-gray-900 text-white mx-auto">
                  <i className="fa-solid fa-graduation-cap text-xl"></i>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Books
                </Typography>
                <Typography color="gray" className="text-sm">
                  Study materials & resources
                </Typography>
              </CardBody>
            </Card>
            <Card className="border-0 shadow-md">
              <CardBody className="p-6 text-center">
                <div className="mb-4 grid h-12 w-12 place-content-center rounded-lg bg-gray-900 text-white mx-auto">
                  <i className="fa-solid fa-filter text-xl"></i>
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Filtered
                </Typography>
                <Typography color="gray" className="text-sm">
                  By class & board
                </Typography>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LearningMaterials;

