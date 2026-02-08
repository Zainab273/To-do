'use client';

import { useState } from 'react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'How do I create a new task?',
      answer: 'Go to the Tasks page and use the "Add New Task" form at the top. Enter your task title and click "Add Task".',
      category: 'Tasks',
    },
    {
      question: 'How do I edit a task?',
      answer: 'Click the edit icon (pencil) on any task card. Make your changes and click the save icon to confirm.',
      category: 'Tasks',
    },
    {
      question: 'How do I delete a task?',
      answer: 'Click the delete icon (trash) on any task card. The task will be permanently removed.',
      category: 'Tasks',
    },
    {
      question: 'How do I mark a task as complete?',
      answer: 'Simply click the checkbox next to the task title. Click again to mark it as incomplete.',
      category: 'Tasks',
    },
    {
      question: 'How do I change my password?',
      answer: 'Go to Settings > Security and click "Change Password". Follow the prompts to update your password.',
      category: 'Account',
    },
    {
      question: 'How do I sign out?',
      answer: 'Click the "Logout" button in the sidebar or go to Settings and click "Sign Out".',
      category: 'Account',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickLinks = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using Task Manager',
      icon: '🚀',
    },
    {
      title: 'Task Management',
      description: 'Master task creation and organization',
      icon: '📝',
    },
    {
      title: 'Account Settings',
      description: 'Customize your profile and preferences',
      icon: '⚙️',
    },
    {
      title: 'Keyboard Shortcuts',
      description: 'Work faster with keyboard shortcuts',
      icon: '⌨️',
    },
  ];

  return (
    <div className="min-h-screen bg-[#011425] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-[#5C7C89] to-[#1F4959] bg-clip-text text-transparent">
              Help Center
            </span>
          </h1>
          <p className="text-lg text-white/70">
            Find answers to common questions and learn how to use Task Manager
          </p>
        </header>

        {/* Search */}
        <div className="bg-[#1F4959]/50 backdrop-blur-xl border border-[#5C7C89]/20 rounded-2xl p-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full px-5 py-4 pl-12 bg-[#242424]/50 border border-[#5C7C89]/30 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#5C7C89] focus:border-transparent transition-all"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link) => (
            <div
              key={link.title}
              className="bg-[#1F4959]/50 backdrop-blur-xl border border-[#5C7C89]/20 rounded-2xl p-6 hover:border-[#5C7C89]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#5C7C89]/10 cursor-pointer"
            >
              <div className="text-4xl mb-4">{link.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{link.title}</h3>
              <p className="text-white/70 text-sm">{link.description}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-[#1F4959]/50 backdrop-blur-xl border border-[#5C7C89]/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#5C7C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <details
                  key={index}
                  className="bg-[#242424]/50 border border-[#5C7C89]/20 rounded-xl overflow-hidden group"
                >
                  <summary className="px-6 py-4 cursor-pointer text-white font-medium hover:bg-[#242424]/70 transition-all duration-200 flex items-center justify-between">
                    <span>{faq.question}</span>
                    <svg
                      className="w-5 h-5 text-[#5C7C89] transform group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 py-4 border-t border-[#5C7C89]/20 text-white/70">
                    <p>{faq.answer}</p>
                    <span className="inline-block mt-3 px-3 py-1 bg-[#5C7C89]/20 text-[#5C7C89] text-xs rounded-full">
                      {faq.category}
                    </span>
                  </div>
                </details>
              ))
            ) : (
              <div className="text-center py-8">
                <svg
                  className="w-16 h-16 text-[#5C7C89] mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-white/70">No results found. Try a different search term.</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-[#5C7C89] to-[#1F4959] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Still need help?</h2>
          <p className="text-white/90 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <button className="px-8 py-3 bg-white text-[#1F4959] font-bold rounded-xl hover:bg-white/90 transition-all duration-200 shadow-lg">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
