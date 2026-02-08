'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { CreateTaskForm } from '@/components/CreateTaskForm';
import { TaskList } from '@/components/TaskList';
import { useRouter } from 'next/navigation';

export default function TasksSimplePage() {
  const router = useRouter();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    fetchTasks,
    createTask,
    toggleTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const handleLogout = async () => {
    await signOut();
    router.push('/'); // Redirect to login page after sign out
  };
  
  // Display a loading screen while auth status is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">My Tasks</h1>
            {user && <p className="text-sm text-gray-500">{user.email}</p>}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CreateTaskForm onCreate={createTask} />
        <TaskList
          tasks={tasks}
          loading={tasksLoading}
          error={tasksError}
          onRetry={fetchTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={(taskId, newTitle) => updateTask(taskId, { title: newTitle })}
        />
      </main>
    </div>
  );
}
