'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ErrorIcon = () => (
    <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);

export default function SigninForm() {
  const router = useRouter();
  const { signIn: authHookSignIn } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
        setError("Please fill in all fields.");
        return;
    }

    setIsLoading(true);

    try {
      await authHookSignIn({
        email: formData.email,
        password: formData.password,
      });
      router.push('/tasks');
    } catch (error: any) {
      console.error('Signin error:', error);
      setError(error.message || 'Invalid email or password');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 flex items-center backdrop-blur-sm">
          <ErrorIcon />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="block w-full px-4 py-3 border border-[#5C7C89]/30 rounded-xl bg-[#242424]/50 text-white placeholder-white/40 focus:ring-2 focus:ring-[#5C7C89] focus:border-transparent transition-all backdrop-blur-sm"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="block w-full px-4 py-3 border border-[#5C7C89]/30 rounded-xl bg-[#242424]/50 text-white placeholder-white/40 focus:ring-2 focus:ring-[#5C7C89] focus:border-transparent transition-all backdrop-blur-sm"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-[#5C7C89] to-[#1F4959] hover:from-[#5C7C89]/90 hover:to-[#1F4959]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5C7C89] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[#5C7C89]/30 hover:shadow-2xl hover:shadow-[#5C7C89]/40 hover:scale-105"
      >
        {isLoading ? <Spinner /> : 'Sign in'}
      </button>
    </form>
  );
}
