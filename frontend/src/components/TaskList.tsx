import { Task } from '@/lib/api/types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  onToggle?: (taskId: string, completed: boolean) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  onEdit?: (taskId: string, newTitle: string) => Promise<void>;
}

export function TaskList({ tasks, loading, error, onRetry, onToggle, onDelete, onEdit }: TaskListProps) {
  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-[#1F4959]/50 backdrop-blur-xl rounded-2xl border border-[#5C7C89]/20 p-6 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-[#5C7C89]/20 rounded"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-[#5C7C89]/20 rounded w-3/4"></div>
                <div className="h-3 bg-[#5C7C89]/20 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center backdrop-blur-sm">
        <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-200 font-medium mb-2 text-lg">Error loading tasks</p>
        <p className="text-red-300 text-sm mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="bg-[#1F4959]/50 backdrop-blur-xl border border-[#5C7C89]/20 rounded-2xl p-12 text-center">
        <svg className="w-16 h-16 text-[#5C7C89] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-white/70 text-lg font-medium">
          No tasks yet. Create your first task to get started!
        </p>
      </div>
    );
  }

  // Task list
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
