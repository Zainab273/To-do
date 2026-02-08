'use client';

import { TaskList } from '@/components/TaskList';
import { CreateTaskForm } from '@/components/CreateTaskForm';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';

const PageSpinner = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#5C7C89] mb-4"></div>
        <p className="text-lg text-[#5C7C89]">Loading your tasks...</p>
    </div>
);

export default function TasksPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { tasks, loading, error, createTask, toggleTask, deleteTask, updateTask, fetchTasks } = useTasks();

  // Wrapper function to convert title string to TaskUpdate object
  const handleEditTask = async (taskId: string, newTitle: string) => {
    await updateTask(taskId, { title: newTitle });
  };

  if (authLoading) {
    return <PageSpinner />;
  }
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#011425] flex items-center justify-center">
        <div className="text-center bg-red-500/10 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm">
          <p className="text-red-200 text-lg font-medium">Access Denied: Not Authenticated</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#011425] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
            <span className="bg-gradient-to-r from-[#5C7C89] to-[#1F4959] bg-clip-text text-transparent">
              Welcome back, {user?.email?.split('@')[0] || 'User'}!
            </span>
          </h1>
          <p className="text-lg text-white/70">
            Manage your tasks and stay productive
          </p>
        </header>
      
        <section className="mb-10">
          <CreateTaskForm onCreate={createTask} />
        </section>
      
        <section>
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            onRetry={fetchTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={handleEditTask}
          />
        </section>
      </div>
    </div>
  );
}
