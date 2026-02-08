/**
 * Authentication Debug & Testing Dashboard
 */
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function TestPage() {
  const { isAuthenticated, user, token, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [authState, setAuthState] = useState<any>({});
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setAuthState({
        isAuthenticated,
        user,
        token: token ? `${token.substring(0, 50)}...` : null,
        tokenLength: token?.length || 0,
      });
    }
  }, [isAuthenticated, user, token, isLoading]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading authentication state...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Authentication Dashboard
          </h1>
          <p className="text-slate-600">
            Debug and test authentication state in real-time
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-gray-900 shadow-lg rounded-xl p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Current Status</h2>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isAuthenticated ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${isAuthenticated ? 'text-green-700' : 'text-red-700'}`}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>
          </div>

          {/* User Info Grid */}
          {isAuthenticated && user && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">User ID</p>
                <p className="font-mono text-slate-900 font-medium break-all">{user.id}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Email</p>
                <p className="font-medium text-slate-900 break-all">{user.email}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Token Length</p>
                <p className="font-mono text-slate-900 font-medium">{authState.tokenLength} characters</p>
              </div>
            </div>
          )}

          {/* Full State JSON */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
              Complete Authentication State
            </h3>
            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-auto text-xs sm:text-sm font-mono shadow-inner border border-slate-700 max-h-96">
              {JSON.stringify(authState, null, 2)}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-900 shadow-lg rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/signin')}
              className="group relative px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In Page
            </button>

            <button
              onClick={() => router.push('/tasks')}
              className="group relative px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Tasks Page
            </button>

            <button
              onClick={handleSignOut}
              disabled={isSigningOut || !isAuthenticated}
              className="group relative px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningOut ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing Out...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>This page is for development and debugging purposes only</p>
        </div>
      </div>
    </div>
  );
}
