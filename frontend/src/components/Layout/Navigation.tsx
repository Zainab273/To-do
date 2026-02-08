'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const NavSpinner = () => (
    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-[#5C7C89]"></div>
);

export function Navigation() {
  const { isAuthenticated, user, signOut, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#5C7C89]/20 bg-[#1F4959]/95 backdrop-blur-xl shadow-lg">
      <div className="container mx-auto max-w-full">
        <nav className="flex items-center justify-between p-4">
          <Link href={isAuthenticated ? "/tasks" : "/"} className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:text-[#5C7C89] transition-colors">
            <svg className="w-8 h-8 text-[#5C7C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className="text-white">TaskManager</span>
          </Link>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <NavSpinner />
            ) : isAuthenticated ? (
              <>
                <span className="text-sm text-[#5C7C89] hidden sm:block font-medium">
                  {user?.email}
                </span>
                <button
                  onClick={signOut}
                  className="px-5 py-2 bg-[#5C7C89]/20 backdrop-blur-sm text-sm font-semibold text-white rounded-lg hover:bg-[#5C7C89]/30 transition-all duration-200 border border-[#5C7C89]/30"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/signin" 
                  className="px-5 py-2 text-sm font-semibold text-white rounded-lg hover:bg-[#5C7C89]/20 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="px-5 py-2 bg-[#5C7C89] text-sm font-semibold text-white rounded-lg hover:bg-[#5C7C89]/80 transition-all duration-200 shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
