"use client";

import React from "react";
import { Typography, Card } from "@material-tailwind/react";

const FAQS = [
  {
    title: "How do I get started?",
    desc: "Getting started is easy! Simply sign up for an account, choose your learning preferences, and start asking questions. Our AI will adapt to your learning style and provide personalized responses.",
  },
  {
    title: "How accurate are the AI responses?",
    desc: "YOur AI is trained on vast educational content and provides highly accurate responses. However, we always recommend verifying important information and using our responses as a learning aid rather than a final answer.",
  },
  {
    title: "How can I upgrade my account?",
    desc: "You can upgrade or downgrade your plan anytime from your profile settings. Changes take effect immediately, and you'll be charged or credited accordingly.",
  },
  {
    title: "Can I cancel my subscription anytime?",
    desc: "Absolutely, you can cancel your subscription at any time with no questions asked. Your subscription will remain active until the end of the current billing cycle.",
  },
  {
    title: "Can I upload images for analysis?",
    desc: "Yes! You can upload images of problems, diagrams, or text, and our AI will analyze them using OCR technology to extract text and provide relevant answers.",
  },
  {
    title: "What if I need help or have technical issues?",
    desc: "Our dedicated support team is here to assist you. Reach out via [mention preferred support channels, e.g., live chat, email, or phone], and we'll get back to you promptly.",
  },
];

export function Faqs() {
  return (
    <section className="px-8 py-20">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center">
          <Typography variant="h1" color="blue-gray" className="mb-4">
            Frequently asked questions
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto mb-24 !text-gray-500 lg:w-3/5"
          >
            A lot of people don&apos;t appreciate the moment until it&apos;s
            passed. I&apos;m not trying my hardest, and I&apos;m not trying to
            do
          </Typography>
        </div>

        <div className="grid gap-20 md:grid-cols-1 lg:grid-cols-3">
          {FAQS.map(({ title, desc }) => (
            <Card key={title} shadow={false} color="transparent">
              <Typography color="blue-gray" className="pb-6" variant="h4">
                {title}
              </Typography>
              <div className="pt-2">
                <Typography className="font-normal !text-gray-500">
                  {desc}
                </Typography>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faqs;
