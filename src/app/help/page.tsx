"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components';

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      id: 1,
      question: "How do I get started with PAATA.AI?",
      answer: "Getting started is easy! Simply sign up for an account, choose your learning preferences, and start asking questions. Our AI will adapt to your learning style and provide personalized responses."
    },
    {
      id: 2,
      question: "What types of questions can I ask?",
      answer: "You can ask any academic question across subjects like Mathematics, Science, History, Literature, and more. Our AI can help with homework, explain concepts, solve problems, and provide step-by-step solutions."
    },
    {
      id: 3,
      question: "How accurate are the AI responses?",
      answer: "Our AI is trained on vast educational content and provides highly accurate responses. However, we always recommend verifying important information and using our responses as a learning aid rather than a final answer."
    },
    {
      id: 4,
      question: "Can I upload images for analysis?",
      answer: "Yes! You can upload images of problems, diagrams, or text, and our AI will analyze them using OCR technology to extract text and provide relevant answers."
    },
    {
      id: 5,
      question: "Is my data secure and private?",
      answer: "Absolutely. We take privacy seriously and use industry-standard encryption to protect your data. Your conversations and personal information are never shared with third parties."
    },
    {
      id: 6,
      question: "How do I change my subscription plan?",
      answer: "You can upgrade or downgrade your plan anytime from your profile settings. Changes take effect immediately, and you'll be charged or credited accordingly."
    }
  ];

  const contactMethods = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "support@paata.ai",
      icon: "📧"
    },
    {
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available 9 AM - 6 PM EST",
      icon: "💬"
    },
    {
      title: "WhatsApp Support",
      description: "Chat with us on WhatsApp for immediate assistance",
      contact: "WhatsApp Chat",
      icon: "💬",
      link: "https://wa.me/919900361943"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions, get help with your account, or contact our support team.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm border">
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'faq'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'contact'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Contact Us
              </button>
              <button
                onClick={() => setActiveTab('guides')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'guides'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                User Guides
              </button>
            </div>
          </div>

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
              
              {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try searching with different keywords or browse our FAQ categories.</p>
                </div>
              )}
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {contactMethods.map((method, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-6 text-center">
                    <div className="text-4xl mb-4">{method.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    {method.link ? (
                      <a 
                        href={method.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 font-medium hover:text-blue-700"
                      >
                        {method.contact}
                      </a>
                    ) : (
                      <p className="text-blue-600 font-medium">{method.contact}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h3>
                <form 
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const name = formData.get('name');
                    const email = formData.get('email');
                    const subject = formData.get('subject');
                    const message = formData.get('message');
                    
                    // Create mailto link
                    const mailtoLink = `mailto:support@paata.ai?subject=${encodeURIComponent(subject as string)}&body=${encodeURIComponent(
                      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                    )}`;
                    
                    window.location.href = mailtoLink;
                  }}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What can we help you with?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      rows={6}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Please describe your issue or question in detail..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Guides Tab */}
          {activeTab === 'guides' && (
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Getting Started Guide</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Learn how to set up your account and start using PAATA.AI effectively.</p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">Read Guide →</button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Advanced Features</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Discover advanced features like image analysis, voice input, and learning preferences.</p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">Read Guide →</button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Troubleshooting</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Common issues and how to resolve them quickly.</p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">Read Guide →</button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Account Settings</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Manage your profile, preferences, and subscription settings.</p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">Read Guide →</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

