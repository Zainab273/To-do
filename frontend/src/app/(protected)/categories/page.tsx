'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { useState } from 'react';
import Link from 'next/link';

export default function CategoriesPage() {
  const { user } = useAuth();
  const { tasks, loading } = useTasks();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    {
      id: 'all',
      name: 'All Tasks',
      icon: '📋',
      color: 'from-[#5C7C89] to-[#1F4959]',
      count: tasks.length,
    },
    {
      id: 'completed',
      name: 'Completed',
      icon: '✅',
      color: 'from-green-500 to-emerald-600',
      count: tasks.filter(t => t.completed).length,
    },
    {
      id: 'pending',
      name: 'Pending',
      icon: '⏰',
      color: 'from-orange-500 to-amber-600',
      count: tasks.filter(t => !t.completed).length,
    },
    {
      id: 'today',
      name: 'Created Today',
      icon: '📅',
      color: 'from-blue-500 to-cyan-600',
      count: tasks.filter(t => {
        const taskDate = new Date(t.created_at);
        const today = new Date();
        return taskDate.toDateString() === today.toDateString();
      }).length,
    },
    {
      id: 'recent',
      name: 'Recent (7 days)',
      icon: '🕐',
      color: 'from-purple-500 to-pink-600',
      count: tasks.filter(t => {
        const taskDate = new Date(t.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return taskDate >= weekAgo;
      }).length,
    },
  ];

  const getFilteredTasks = () => {
    switch (selectedCategory) {
      case 'completed':
        return tasks.filter(t => t.completed);
      case 'pending':
        return tasks.filter(t => !t.completed);
      case 'today':
        return tasks.filter(t => {
          const taskDate = new Date(t.created_at);
          const today = new Date();
          return taskDate.toDateString() === today.toDateString();
        });
      case 'recent':
        return tasks.filter(t => {
          const taskDate = new Date(t.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return taskDate >= weekAgo;
        });
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#011425] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5C7C89] mx-auto mb-4"></div>
          <p className="text-[#5C7C89] font-medium text-lg">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#011425] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-[#5C7C89] to-[#1F4959] bg-clip-text text-transparent">
              Task Categories
            </span>
          </h1>
          <p className="text-lg text-white/70">
            Organize and filter your tasks by categories
          </p>
        </header>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-6 rounded-2xl transition-all duration-300 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-2xl scale-105`
                  : 'bg-[#1F4959]/50 backdrop-blur-xl border border-[#5C7C89]/20 text-white hover:border-[#5C7C89]/40 hover:shadow-lg hover:shadow-[#5C7C89]/10'
              }`}
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="font-bold text-lg mb-1">{category.name}</h3>
              <p className={`text-2xl font-bold ${selectedCategory === category.id ? 'text-white' : 'text-[#5C7C89]'}`}>
                {category.count}
              </p>
            </button>
          ))}
        </div>

        {/* Filtered Tasks */}
        <div className="bg-[#1F4959]/50 backdrop-blur-xl border border-[#5C7C89]/20 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">
                {categories.find(c => c.id === selectedCategory)?.icon}
              </span>
              {categories.find(c => c.id === selectedCategory)?.name}
              <span className="text-[#5C7C89]">({filteredTasks.length})</span>
            </h2>
            <Link
              href="/tasks"
              className="px-4 py-2 bg-gradient-to-r from-[#5C7C89] to-[#1F4959] text-white rounded-lg hover:from-[#5C7C89]/90 hover:to-[#1F4959]/90 transition-all duration-200 font-medium text-sm"
            >
              Manage Tasks
            </Link>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-20 h-20 text-[#5C7C89] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-white/70 text-lg">No tasks in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-[#242424]/50 border border-[#5C7C89]/20 rounded-xl p-5 hover:border-[#5C7C89]/40 hover:shadow-lg hover:shadow-[#5C7C89]/10 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="mt-1 w-6 h-6 text-[#5C7C89] bg-[#242424]/50 border-[#5C7C89]/30 rounded-lg cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-white font-semibold break-words mb-2 ${task.completed ? 'line-through opacity-50' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.completed
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {task.completed ? 'Done' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
