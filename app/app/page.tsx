'use client';

import { useEffect, useState } from 'react';
import { Task, User } from '@/lib/types';
import TaskList from '@/components/TaskList';
import AddTaskForm from '@/components/AddTaskForm';
import PremiumBanner from '@/components/PremiumBanner';
import AIAssistant from '@/components/AIAssistant';
import MorningRoutine from '@/components/MorningRoutine';
import AIInsights from '@/components/AIInsights';
import { CheckSquare, Sparkles, TrendingUp, ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function AppPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [showMorningRoutine, setShowMorningRoutine] = useState(true);
  const userId = 'demo-user';

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user', {
        headers: { 'x-user-id': userId },
      });
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks', {
        headers: { 'x-user-id': userId },
      });
      const data = await res.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchTasks();

    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) {
      alert('🎉 Payment successful! Your account has been upgraded to Premium.');
      fetchUser();
      window.history.replaceState({}, '', '/app');
    } else if (params.get('canceled')) {
      alert('Payment canceled.');
      window.history.replaceState({}, '', '/app');
    }
  }, []);

  const handleAddTask = async (
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high'
  ) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ title, description, priority }),
      });

      const data = await res.json();

      if (res.ok) {
        setTasks([...tasks, data.task]);
      } else {
        alert(data.error || 'Failed to add task');
      }
    } catch (error) {
      console.error('Failed to add task:', error);
      alert('Failed to add task');
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      const data = await res.json();

      if (res.ok) {
        setTasks(tasks.map((t) => (t.id === taskId ? data.task : t)));
      }
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId },
      });

      if (res.ok) {
        setTasks(tasks.filter((t) => t.id !== taskId));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (res.ok) {
        setTasks(tasks.map((t) => (t.id === taskId ? data.task : t)));
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
        setUpgradeLoading(false);
      }
    } catch (error) {
      console.error('Failed to upgrade:', error);
      alert('Failed to start upgrade process');
      setUpgradeLoading(false);
    }
  };

  const handleAISuggestTasks = (suggestedTasks: string[]) => {
    suggestedTasks.forEach((taskTitle) => {
      handleAddTask(taskTitle, 'Suggested by AI', 'medium');
    });
    if (suggestedTasks.length > 0) {
      alert(`✨ Added ${suggestedTasks.length} AI-suggested tasks!`);
    }
  };

  const handleAddRoutineTask = (title: string, description: string) => {
    handleAddTask(title, description, 'high');
    alert('✅ Added to your tasks!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
            <Sparkles className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-6 text-gray-700 dark:text-gray-300 font-semibold text-lg">
            Loading your AI-powered workspace...
          </p>
        </div>
      </div>
    );
  }

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Back to Home */}
        <button
          onClick={() => router.push('/')}
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl shadow-xl">
                <CheckSquare className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Task Manager AI
                </h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4" />
                  Welcome back, <span className="font-semibold">{user?.name}</span>!
                </p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border-2 border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {completedCount} / {totalCount}
                  </div>
                  <div className="text-xs text-gray-500">Tasks Completed</div>
                </div>
              </div>
              {totalCount > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Premium Banner */}
        <div className="mb-6">
          <PremiumBanner
            isPremium={user?.isPremium || false}
            onUpgrade={handleUpgrade}
            loading={upgradeLoading}
          />
        </div>

        {/* AI Insights */}
        {tasks.length > 0 && <AIInsights tasks={tasks} />}

        {/* Morning Routine - Collapsible */}
        {showMorningRoutine && (
          <div className="mb-6">
            <MorningRoutine onAddRoutineTask={handleAddRoutineTask} />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Add Task Form */}
          <AddTaskForm
            onAdd={handleAddTask}
            isPremium={user?.isPremium || false}
            taskCount={tasks.length}
          />

          {/* Task List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Tasks
              </h2>
              {tasks.length > 0 && (
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
                    {tasks.filter((t) => !t.completed).length} Active
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                    {completedCount} Done
                  </span>
                </div>
              )}
            </div>
            <TaskList
              tasks={tasks}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-lg border border-purple-200 dark:border-purple-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="font-semibold">Powered by AI</span>
              <span>•</span>
              <span>Built with Next.js, TypeScript & OpenAI</span>
            </p>
          </div>
        </div>
      </div>

      {/* AI Assistant Floating Button */}
      <AIAssistant onSuggestTasks={handleAISuggestTasks} />
    </div>
  );
}

