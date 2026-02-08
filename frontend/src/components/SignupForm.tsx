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

export default function SignupForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const { email, password, confirmPassword } = formData;

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      newErrors.password = 'Password must include uppercase, lowercase, and numbers.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.email.split('@')[0],
      });
      router.push('/tasks');
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.message || 'Signup failed. Please try again.';
      if (errorMessage.includes('already registered') || errorMessage.includes('duplicate')) {
        setErrors({ email: 'This email is already registered.' });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 flex items-center backdrop-blur-sm">
          <ErrorIcon />
          <p className="text-sm text-red-200">{errors.general}</p>
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
          {errors.email && <p className="mt-2 text-sm text-red-300">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="block w-full px-4 py-3 border border-[#5C7C89]/30 rounded-xl bg-[#242424]/50 text-white placeholder-white/40 focus:ring-2 focus:ring-[#5C7C89] focus:border-transparent transition-all backdrop-blur-sm"
            placeholder="••••••••"
          />
          {errors.password ? (
            <p className="mt-2 text-sm text-red-300">{errors.password}</p>
          ) : (
            <p className="mt-2 text-xs text-white/60">
              Must be 8+ characters with uppercase, lowercase, and a number.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="block w-full px-4 py-3 border border-[#5C7C89]/30 rounded-xl bg-[#242424]/50 text-white placeholder-white/40 focus:ring-2 focus:ring-[#5C7C89] focus:border-transparent transition-all backdrop-blur-sm"
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="mt-2 text-sm text-red-300">{errors.confirmPassword}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-[#5C7C89] to-[#1F4959] hover:from-[#5C7C89]/90 hover:to-[#1F4959]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5C7C89] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[#5C7C89]/30 hover:shadow-2xl hover:shadow-[#5C7C89]/40 hover:scale-105"
      >
        {isLoading ? <Spinner /> : 'Create account'}
      </button>
    </form>
  );
}
