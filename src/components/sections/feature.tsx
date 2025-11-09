"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";

import {
  CursorArrowRaysIcon,
  HeartIcon,
  LightBulbIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";

import FeatureCard from "../feature-card";

const FEATURES = [
  {
    icon: CursorArrowRaysIcon,
    title: "AI-Powered Exam Generation",
    children:
      "Create custom exams instantly! Generate questions based on subject, topic, and difficulty. Get detailed results with solutions, explanations, and performance insights - perfect for exam preparation.",
  },
  {
    icon: HeartIcon,
    title: "Research Mode & Advanced Analytics",
    children:
      "Access real-time web research for comprehensive answers. Track your learning with advanced analytics, performance trends, and personalized insights to identify strengths and areas for improvement.",
  },
  {
    icon: LockClosedIcon,
    title: "Personalized Learning Materials",
    children:
      "Access study materials tailored to your class and board. Browse subjects, videos, and books filtered specifically for your curriculum. Change your class/board anytime in profile settings.",
  },
  {
    icon: LightBulbIcon,
    title: "AI-Powered Answers & Multilingual Support",
    children:
      "Get instant, accurate answers powered by advanced AI technology. Ask questions in any language - our multilingual support understands and responds in your preferred language, making learning accessible to students worldwide.",
  },
];

export function Features() {
  return (
    <section className="py-28 px-4">
      <div className="container mx-auto mb-20 text-center">
        <Typography color="blue-gray" className="mb-2 font-bold uppercase">
          Your Learning App
        </Typography>
        <Typography variant="h1" color="blue-gray" className="mb-4">
          Homework Assistance at your fingertips With Paata Ai
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto w-full px-4 !text-gray-500 lg:w-11/12 lg:px-8 "
        >
          Access personalized learning materials, AI-powered exam generation, research mode, 
          and advanced analytics. Whether you&apos;re studying at home or on the go, 
          PAATA.AI adapts to your learning style and curriculum.
        </Typography>
      </div>
      <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-4 gap-y-12 md:grid-cols-2">
        {FEATURES.map((props, idx) => (
          <FeatureCard key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
export default Features;
