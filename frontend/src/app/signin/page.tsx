/**
 * Signin page
 */
'use client';

import SigninForm from '@/components/SigninForm';
import Link from 'next/link';

export default function SigninPage() {
  return (
    <div className="min-h-screen bg-[#011425] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#5C7C89]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#1F4959]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-[#1F4959]/50 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-[#5C7C89]/10 p-8 border border-[#5C7C89]/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#5C7C89]/20 to-[#1F4959]/20 rounded-2xl mb-4 shadow-lg shadow-[#5C7C89]/20 border border-[#5C7C89]/30">
              <svg className="w-10 h-10 text-[#5C7C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-white/70">
              Sign in to continue to your tasks
            </p>
          </div>
          
          <SigninForm />
          
          <div className="text-center pt-6 mt-6 border-t border-[#5C7C89]/20">
            <p className="text-sm text-white/70">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-[#5C7C89] hover:text-[#5C7C89]/80 transition-colors">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
