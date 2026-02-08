'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Navigation } from './Navigation';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  
  // Pages where sidebar should not show
  const noSidebarPages = ['/', '/signin', '/signup', '/test'];
  const showSidebar = isAuthenticated && !noSidebarPages.includes(pathname);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {showSidebar && <Sidebar />}
      <div className={`flex-1 ${showSidebar ? 'ml-72' : ''}`}>
        <Navigation />
        <main>{children}</main>
      </div>
    </div>
  );
}
