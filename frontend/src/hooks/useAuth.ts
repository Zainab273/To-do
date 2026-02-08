// frontend/src/hooks/useAuth.ts
'use client';
// This file is kept for compatibility, but now it just re-exports the context-based hook.
// All the logic is now in contexts/AuthContext.tsx

import { useContext } from 'react';
// This assumes you have a file like contexts/AuthContext.tsx
// If you created AuthProvider in a different file, adjust the import path.
import { AuthContext } from '../contexts/AuthContext'; 

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};