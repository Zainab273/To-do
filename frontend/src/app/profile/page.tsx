// frontend/src/app/profile/page.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { isAuthenticated, user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/signin');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white font-medium text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut();
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <button
              onClick={() => router.push('/tasks')}
              className="px-6 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Back to Tasks
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8">
          <div className="flex items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-white">Account Information</h2>
              <p className="text-purple-200">Manage your profile details</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label className="block text-sm font-medium text-purple-200 mb-2">Email Address</label>
              <p className="text-xl text-white font-medium">{user.email}</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label className="block text-sm font-medium text-purple-200 mb-2">User ID</label>
              <p className="text-sm text-white font-mono break-all">{user.id}</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <button
              onClick={handleSignOut}
              className="w-full px-6 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-lg hover:shadow-2xl hover:scale-105"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
