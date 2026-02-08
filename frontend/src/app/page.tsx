'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/tasks');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#011425] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5C7C89] mx-auto mb-4"></div>
          <p className="text-[#5C7C89] font-medium text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#011425] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5C7C89]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1F4959]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#5C7C89]/20 to-[#1F4959]/20 rounded-3xl mb-8 shadow-2xl shadow-[#5C7C89]/20 border border-[#5C7C89]/30 backdrop-blur-sm">
            <svg className="w-14 h-14 text-[#5C7C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-[#5C7C89] via-[#1F4959] to-[#5C7C89] bg-clip-text text-transparent">
              Task Manager
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Organize your life, boost productivity, and achieve your goals with our powerful task management system
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#1F4959]/50 backdrop-blur-xl rounded-2xl p-8 border border-[#5C7C89]/20 hover:border-[#5C7C89]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#5C7C89]/10">
            <div className="w-14 h-14 bg-gradient-to-br from-[#5C7C89]/20 to-[#5C7C89]/30 rounded-xl flex items-center justify-center mb-6 border border-[#5C7C89]/30">
              <svg className="w-7 h-7 text-[#5C7C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl mb-3">Fast & Efficient</h3>
            <p className="text-white/70 text-sm leading-relaxed">Create and manage tasks in seconds with our intuitive interface</p>
          </div>

          <div className="bg-[#1F4959]/50 backdrop-blur-xl rounded-2xl p-8 border border-[#5C7C89]/20 hover:border-[#5C7C89]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#5C7C89]/10">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1F4959]/20 to-[#1F4959]/30 rounded-xl flex items-center justify-center mb-6 border border-[#5C7C89]/30">
              <svg className="w-7 h-7 text-[#5C7C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl mb-3">Secure & Private</h3>
            <p className="text-white/70 text-sm leading-relaxed">Your data is encrypted and protected with industry-standard security</p>
          </div>

          <div className="bg-[#1F4959]/50 backdrop-blur-xl rounded-2xl p-8 border border-[#5C7C89]/20 hover:border-[#5C7C89]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#5C7C89]/10">
            <div className="w-14 h-14 bg-gradient-to-br from-[#5C7C89]/20 to-[#1F4959]/20 rounded-xl flex items-center justify-center mb-6 border border-[#5C7C89]/30">
              <svg className="w-7 h-7 text-[#5C7C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl mb-3">Track Progress</h3>
            <p className="text-white/70 text-sm leading-relaxed">Monitor your productivity and celebrate your achievements</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.push('/signup')}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#5C7C89] to-[#1F4959] text-white font-bold rounded-xl hover:from-[#5C7C89]/90 hover:to-[#1F4959]/90 transition-all duration-200 shadow-xl shadow-[#5C7C89]/30 hover:shadow-2xl hover:shadow-[#5C7C89]/40 hover:scale-105"
          >
            Create Account
          </button>
          <button
            onClick={() => router.push('/signin')}
            className="w-full sm:w-auto px-10 py-4 bg-[#5C7C89]/10 backdrop-blur-lg text-[#5C7C89] font-bold rounded-xl hover:bg-[#5C7C89]/20 transition-all duration-200 border border-[#5C7C89]/30"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
