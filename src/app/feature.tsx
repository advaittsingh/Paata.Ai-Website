"use client";

import React from "react";
import { Typography } from "@material-tailwind/react";

import {
  CursorArrowRaysIcon,
  HeartIcon,
  LightBulbIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";

import FeatureCard from "../components/feature-card";

const FEATURES = [
  {
    icon: CursorArrowRaysIcon,
    title: "AI Instant Answers",
    children:
      "Get instant, step-by-step solutions to your homework questions powered by advanced AI. Paata.ai breaks down complex problems, making it easy to understand and study smarter every day.",
  },
  {
    icon: HeartIcon,
    title: "Multilingual Concept Help",
    children:
      "Ask questions in your preferred language and get clear explanations. Paata.ai makes sure you truly understand key concepts, helping bridge gaps in any subject or topic.",
  },
  {
    icon: LockClosedIcon,
    title: "Gamified Achievements",
    children:
      "Earn certificates, badges, and rewards as you solve problems and complete challenges. Showcase new skills, stay motivated, and track your growth as you progress.",
  },
  {
    icon: LightBulbIcon,
    title: "Personalized Progress Tracking",
    children:
      "Monitor your learning journey with AI-driven progress tracking and tailored recommendations. Paata.ai helps you spot strengths, improve weaknesses, and keeps you motivated every step of the way.",
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
          Access your homework buddy on the go. Whether you&apos;re
          commuting, waiting for a friend, or just have a few minutes to spare,
          our app fits seamlessly into your busy life.
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
