'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddTaskFormProps {
  onAdd: (title: string, description: string, priority: 'low' | 'medium' | 'high') => void;
  isPremium: boolean;
  taskCount: number;
}

export default function AddTaskForm({ onAdd, isPremium, taskCount }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isOpen, setIsOpen] = useState(false);

  const maxTasks = isPremium ? Infinity : 5;
  const canAddTask = taskCount < maxTasks;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !canAddTask) return;

    onAdd(title, description, priority);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setIsOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          disabled={!canAddTask}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all ${
            canAddTask
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus className="w-5 h-5" />
          Add New Task
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Task Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete project proposal"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!isPremium && (
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Free plan: {taskCount} / {maxTasks} tasks used
        </div>
      )}
    </div>
  );
}

