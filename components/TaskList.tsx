'use client';

import { Task } from '@/lib/types';
import { Check, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export default function TaskList({ tasks, onToggle, onDelete, onUpdate }: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = (taskId: string) => {
    onUpdate(taskId, { title: editTitle, description: editDescription });
    setEditingId(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-300';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No tasks yet. Create your first task above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 rounded-lg border-l-4 shadow-sm transition-all ${getPriorityColor(task.priority)} ${
            task.completed ? 'opacity-60' : ''
          }`}
        >
          {editingId === task.id ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(task.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggle(task.id)}
                className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.completed
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                {task.completed && <Check className="w-4 h-4 text-white" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </h3>
                <p className={`text-sm mt-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                  {task.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded-full border">
                    {task.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(task)}
                  className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  title="Edit task"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

