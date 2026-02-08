'use client';

import { useState, FormEvent } from 'react';
import { validateTaskTitle, sanitizeTaskTitle } from '@/lib/utils/validation';
import type { TaskCreateRequest } from '@/lib/api/types';

interface CreateTaskFormProps {
  onCreate: (data: TaskCreateRequest) => Promise<void>;
}

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export function CreateTaskForm({ onCreate }: CreateTaskFormProps) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateTaskTitle(title);
    if (!validation.valid) {
      setError(validation.error || 'Invalid task title');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sanitized = sanitizeTaskTitle(title);
      await onCreate({ title: sanitized });
      setTitle('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error) setError(null);
  };

  return (
    <div className="bg-[#1F4959]/50 backdrop-blur-xl border border-[#5C7C89]/20 p-6 rounded-2xl shadow-2xl shadow-[#5C7C89]/5">
      <h2 className="text-2xl font-bold mb-5 text-white flex items-center gap-2">
        <svg className="w-6 h-6 text-[#5C7C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="bg-gradient-to-r from-[#5C7C89] to-[#1F4959] bg-clip-text text-transparent">Add New Task</span>
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <div className="flex-1 w-full">
            <label htmlFor="task-title" className="sr-only">Task Title</label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              maxLength={500}
              disabled={loading}
              className="w-full px-5 py-3.5 border border-[#5C7C89]/30 rounded-xl bg-[#242424]/50 text-white placeholder-white/40 focus:ring-2 focus:ring-[#5C7C89] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm font-medium text-red-300" role="alert">
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#5C7C89] to-[#1F4959] text-white font-semibold rounded-xl hover:from-[#5C7C89]/90 hover:to-[#1F4959]/90 focus:outline-none focus:ring-2 focus:ring-[#5C7C89] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-[#5C7C89]/30 hover:shadow-2xl hover:shadow-[#5C7C89]/40 hover:scale-105"
          >
            {loading ? (
              <>
                <SpinnerIcon />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <PlusIcon />
                <span>Add Task</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
