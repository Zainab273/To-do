'use client';

import { Task } from '@/lib/types';
import { formatTaskDate } from '@/lib/utils/formatting';
import { useState } from 'react';

interface TaskItemProps {
  task: Task;
  onToggle?: (taskId: string, completed: boolean) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  onEdit?: (taskId: string, newTitle: string) => Promise<void>;
}

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);

const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const CancelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
  };

  const handleSave = async () => {
    if (onEdit && editedTitle.trim() !== '' && editedTitle.trim() !== task.title) {
      await onEdit(task.id, editedTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-[#1F4959]/50 backdrop-blur-xl rounded-2xl border border-[#5C7C89]/20 p-5 hover:shadow-2xl hover:shadow-[#5C7C89]/10 hover:border-[#5C7C89]/40 transition-all duration-300 ease-in-out group">
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle?.(task.id, !task.completed)}
          className="mt-1 w-6 h-6 text-[#5C7C89] bg-[#242424]/50 border-[#5C7C89]/30 rounded-lg focus:ring-[#5C7C89] focus:ring-2 cursor-pointer transition-all duration-200 ease-in-out"
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="text-lg font-semibold text-white bg-[#242424]/50 w-full border-b-2 border-[#5C7C89] focus:outline-none focus:border-[#5C7C89]/80 px-2 py-1 rounded-t-lg"
              autoFocus
            />
          ) : (
            <p
              className={`text-lg font-semibold break-words transition-all duration-200 ease-in-out ${
                task.completed
                  ? 'text-[#5C7C89]/50 line-through'
                  : 'text-white'
              }`}
            >
              {task.title}
            </p>
          )}
          <div className="text-xs text-white/60 mt-2 space-y-1">
            <p>Created: {formatTaskDate(task.created_at)}</p>
            <p>Updated: {formatTaskDate(task.updated_at)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 transition-opacity duration-200">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="text-[#1F4959] hover:text-[#1F4959]/80 p-2 rounded-full hover:bg-[#5C7C89]/10 transition-all duration-200"
                title="Save task"
              >
                <SaveIcon />
              </button>
              <button
                onClick={handleCancel}
                className="text-[#5C7C89] hover:text-[#5C7C89]/80 p-2 rounded-full hover:bg-[#5C7C89]/10 transition-all duration-200"
                title="Cancel edit"
              >
                <CancelIcon />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="text-[#5C7C89] hover:text-[#5C7C89]/80 p-2 rounded-full hover:bg-[#5C7C89]/10 transition-all duration-200"
                title="Edit task"
              >
                <EditIcon />
              </button>
              {onDelete && (
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-500/10 transition-all duration-200"
                  title="Delete task"
                >
                  <DeleteIcon />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
