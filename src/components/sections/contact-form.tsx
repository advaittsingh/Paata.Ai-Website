"use client";

import React, { useState } from 'react';
import { Typography, Button, Input, Textarea } from "@material-tailwind/react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Create mailto link
      const mailtoLink = `mailto:support@paata.ai?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      
      window.location.href = mailtoLink;
      
      // Show success message
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-28 px-4">
      <div className="container mx-auto mb-20 text-center max-w-4xl">
        <Typography color="blue-gray" className="mb-2 font-bold uppercase">
          Get in Touch
        </Typography>
        <Typography variant="h1" color="blue-gray" className="mb-4">
          Have Questions? We&apos;d Love to Hear From You
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto w-full px-4 !text-gray-500 lg:w-11/12 lg:px-8"
        >
          Send us a message and our team will get back to you as soon as possible.
        </Typography>
      </div>

      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-md p-8 md:p-14">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  size="lg"
                  placeholder="Enter your full name"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900 !pt-4"
                  labelProps={{
                    className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500",
                  }}
                  containerProps={{
                    className: "!min-h-[56px]",
                  }}
                />
              </div>
              <div>
                <Input
                  label="Your Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  size="lg"
                  placeholder="your.email@example.com"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900 !pt-4"
                  labelProps={{
                    className: "before:content-none after:content-none !left-0 !top-0 peer-placeholder-shown:!top-2.5 peer-focus:!top-0 peer-focus:!text-sm !text-gray-500",
                  }}
                  containerProps={{
                    className: "!min-h-[56px]",
                  }}
                />
              </div>
            </div>
            
            <div>
              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>

            <div>
              <Textarea
                label="Your Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>

            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <Typography color="green" className="text-center font-medium">
                  Message sent successfully! We&apos;ll get back to you soon.
                </Typography>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <Typography color="red" className="text-center font-medium">
                  Something went wrong. Please try again or email us directly at support@paata.ai
                </Typography>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              color="white"
              className="flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="mb-3 grid h-12 w-12 place-content-center rounded-lg bg-gray-900 text-white mx-auto">
                  <i className="fa-solid fa-envelope text-xl"></i>
                </div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Email Us
                </Typography>
                <Typography color="gray" className="text-sm">
                  support@paata.ai
                </Typography>
              </div>
              <div>
                <div className="mb-3 grid h-12 w-12 place-content-center rounded-lg bg-gray-900 text-white mx-auto">
                  <i className="fa-solid fa-phone text-xl"></i>
                </div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Call Us
                </Typography>
                <Typography color="gray" className="text-sm">
                  +91 9900361943
                </Typography>
              </div>
              <div>
                <div className="mb-3 grid h-12 w-12 place-content-center rounded-lg bg-gray-900 text-white mx-auto">
                  <i className="fa-solid fa-clock text-xl"></i>
                </div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Response Time
                </Typography>
                <Typography color="gray" className="text-sm">
                  Within 24 hours
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
