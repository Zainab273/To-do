'use client';

import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <div className="py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            My Tasks
          </h1>
          {user && (
            <div className="text-sm text-gray-600">
              {user.email || 'User'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
