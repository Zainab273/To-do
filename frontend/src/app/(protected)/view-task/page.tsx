'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { formatTaskDate } from '@/lib/utils/formatting';
import { useState } from 'react';

export default function ViewTaskPage() {
  const { user } = useAuth();
  const { tasks, loading } = useTasks();
  const [selectedTask, setSelectedTask] = useState<any>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#011425] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5C7C89] mx-auto mb-4"></div>
          <p className="text-[#5C7C89] font-medium text-lg">Loading tasks...</p>
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
              View Tasks
            </span>
          </h1>
          <p className="text-lg text-white/70">
            Browse and view all your tasks in detail
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task List */}
          <div className="lg:col-span-1 bg-[#1F4959]/50 backdrop-blur-xl border border-[#5C7C89]/20 rounded-2xl p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#5C7C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              All Tasks ({tasks.length})
            </h2>
            
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-[#5C7C89] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-white/70">No tasks found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                      selectedTask?.id === task.id
                        ? 'bg-gradient-to-r from-[#5C7C89] to-[#1F4959] text-white shadow-lg'
                        : 'bg-[#242424]/50 border border-[#5C7C89]/20 text-white/90 hover:bg-[#242424]/70 hover:border-[#5C7C89]/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        readOnly
                        className="mt-1 w-5 h-5 text-[#5C7C89] bg-[#242424]/50 border-[#5C7C89]/30 rounded cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${task.completed ? 'line-through opacity-60' : ''}`}>
                          {task.title}
                        </p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTaskDate(task.created_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Task Detail View */}
          <div className="lg:col-span-2 bg-[#1F4959]/50 backdrop-blur-xl border border-[#5C7C89]/20 rounded-2xl p-8">
            {selectedTask ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedTask.completed}
                      readOnly
                      className="w-7 h-7 text-[#5C7C89] bg-[#242424]/50 border-[#5C7C89]/30 rounded-lg cursor-pointer"
                    />
                    <span className={selectedTask.completed ? 'line-through text-white/50' : ''}>
                      {selectedTask.title}
                    </span>
                  </h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedTask.completed
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}>
                    {selectedTask.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#242424]/50 border border-[#5C7C89]/20 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <svg className="w-5 h-5 text-[#5C7C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <h3 className="text-white font-semibold">Created</h3>
                    </div>
                    <p className="text-white/70">{formatTaskDate(selectedTask.created_at)}</p>
                  </div>

                  <div className="bg-[#242424]/50 border border-[#5C7C89]/20 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <svg className="w-5 h-5 text-[#5C7C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <h3 className="text-white font-semibold">Last Updated</h3>
                    </div>
                    <p className="text-white/70">{formatTaskDate(selectedTask.updated_at)}</p>
                  </div>
                </div>

                <div className="bg-[#242424]/50 border border-[#5C7C89]/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-5 h-5 text-[#5C7C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-white font-semibold">Task ID</h3>
                  </div>
                  <p className="text-white/70 font-mono text-sm break-all">{selectedTask.id}</p>
                </div>

                <div className="bg-[#242424]/50 border border-[#5C7C89]/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-5 h-5 text-[#5C7C89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 className="text-white font-semibold">Owner</h3>
                  </div>
                  <p className="text-white/70">{user?.email || 'Unknown'}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <svg className="w-24 h-24 text-[#5C7C89] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <h3 className="text-2xl font-bold text-white mb-2">Select a Task</h3>
                <p className="text-white/70">
                  Click on any task from the list to view its details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
