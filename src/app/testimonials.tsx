"use client";

import React from "react";
import { Typography, Card, CardBody, Avatar } from "@material-tailwind/react";
import { UserIcon } from "@heroicons/react/24/solid";
import TestimonialCard from "../components/testimonial-card";


const TESTIMONIALS = [
  {
    feedback:
      "Paata.ai is like having a study buddy who never gets tired. I just type my question, and it explains everything step by step. Math homework is finally stress-free!",
    client: "Rimjhim Choudhary",
    title: "Student",
    img: "/image/avatar1.jpg",
  },
  {
    feedback:
      "I&apos;m preparing for my exams and Paata.ai helps me practice grammar and translations every day. It&apos;s like a personal tutor in my pocket.",
    client: "Avantika Nagpal",
    title: "Student",
    img: "/image/avatar2.jpg",
  },
  {
    feedback:
      "Whenever I&apos;m stuck revising, Paata.ai breaks down tough topics into simple explanations. It saves me hours of searching online.",
    client: "Shalini Singh",
    title: "Student",
    img: "/image/avatar3.jpg",
  },
];

export function Testimonials() {
  return (
    <section className="px-10 !py-20">
      <div className="container mx-auto">
        <div className="mb-20 flex w-full flex-col items-center">
          <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900 text-white ">
            <UserIcon className="h-6 w-6" />
          </div>
          <Typography variant="h2" color="blue-gray" className="mb-2">
            What Our Student&apos;s Say
          </Typography>
          <Typography
            variant="lead"
            className="mb-10 max-w-3xl text-center !text-gray-600"
          >
            Discover what our valued clients have to say about their experiences
            with our services. We take pride in delivering exceptional results
            and fostering lasting partnerships.
          </Typography>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3 lg:px-20">
          {TESTIMONIALS.map((props, key) => (
            <TestimonialCard key={key} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
export default Testimonials;
