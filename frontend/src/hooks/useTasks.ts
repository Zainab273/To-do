// frontend/src/hooks/useTasks.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskCreate, TaskUpdate } from '@/lib/types';
import { apiClient, ApiError } from '@/lib/api-client';
import { useAuth } from './useAuth'; // Assuming useAuth provides isAuthenticated and user

interface UseTasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: TaskCreate) => Promise<void>;
  toggleTask: (taskId: string, completed: boolean) => Promise<void>;
  updateTask: (taskId: string, data: TaskUpdate) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export function useTasks(): UseTasksState {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id; // Get user ID from useAuth hook

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated || !userId) {
      // Don't try to fetch if not authenticated or user ID is not available
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Note: Backend API uses /api/tasks directly, not /api/users/{userId}/tasks
      const fetchedTasks: Task[] = await apiClient.fetch(`/tasks`);
      setTasks(fetchedTasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      if (err instanceof ApiError) {
        setError(err.data.detail || err.message);
      } else {
        setError('Failed to load tasks. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  const createTask = useCallback(async (data: TaskCreate) => {
    if (!isAuthenticated || !userId) {
      setError('Not authenticated to create task.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const newTask: Task = await apiClient.fetch(`/tasks`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    } catch (err) {
      console.error('Failed to create task:', err);
      if (err instanceof ApiError) {
        setError(err.data.detail || err.message);
      } else {
        setError('Failed to create task. Please try again.');
      }
      throw err; // Re-throw to allow form to handle specific errors
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  const toggleTask = useCallback(async (taskId: string, completed: boolean) => {
    if (!isAuthenticated || !userId) {
      setError('Not authenticated to toggle task.');
      return;
    }
    setLoading(true); // Can refine this to be optimistic later
    setError(null);
    try {
      const updatedTask: Task = await apiClient.fetch(`/tasks/${taskId}`, {
        method: 'PATCH', // Assuming PATCH for toggling
        body: JSON.stringify({ completed }),
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (err) {
      console.error('Failed to toggle task:', err);
      if (err instanceof ApiError) {
        setError(err.data.detail || err.message);
      } else {
        setError('Failed to toggle task. Please try again.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  const updateTask = useCallback(async (taskId: string, data: TaskUpdate) => {
    if (!isAuthenticated || !userId) {
      setError('Not authenticated to update task.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updatedTask: Task = await apiClient.fetch(`/tasks/${taskId}`, {
        method: 'PUT', // Assuming PUT for updating title
        body: JSON.stringify(data),
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (err) {
      console.error('Failed to update task:', err);
      if (err instanceof ApiError) {
        setError(err.data.detail || err.message);
      } else {
        setError('Failed to update task. Please try again.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (!isAuthenticated || !userId) {
      setError('Not authenticated to delete task.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await apiClient.fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      if (err instanceof ApiError) {
        setError(err.data.detail || err.message);
      } else {
        setError('Failed to delete task. Please try again.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);


  // Effect to fetch tasks when authenticated user changes or component mounts
  useEffect(() => {
    // Only fetch if authenticated and user ID is available, and not already loading auth
    if (!authLoading && isAuthenticated && userId) {
      fetchTasks();
    } else if (!authLoading && !isAuthenticated) {
      // If not authenticated, ensure tasks are cleared
      setTasks([]);
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, userId, fetchTasks]);

  return { tasks, loading, error, fetchTasks, createTask, toggleTask, updateTask, deleteTask };
}