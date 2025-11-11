'use client';

import { useState, useEffect } from 'react';
import { Sunrise, Coffee, Dumbbell, Book, Sparkles, RefreshCw } from 'lucide-react';

interface MorningRoutineProps {
  onAddRoutineTask: (title: string, description: string) => void;
}

export default function MorningRoutine({ onAddRoutineTask }: MorningRoutineProps) {
  const [routine, setRoutine] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState('');

  const icons = [Sunrise, Coffee, Dumbbell, Book];

  const generateRoutine = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/morning-routine', {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        setRoutine(data.routine);
        setQuote(data.quote);
      }
    } catch (error) {
      console.error('Failed to generate routine:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRoutine();
  }, []);

  const addToTasks = (item: any) => {
    onAddRoutineTask(item.title, item.description);
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-pink-900/20 rounded-2xl p-6 shadow-lg border-2 border-orange-200 dark:border-orange-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-3 rounded-xl">
            <Sunrise className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Your AI Morning Routine
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personalized for peak productivity
            </p>
          </div>
        </div>
        <button
          onClick={generateRoutine}
          disabled={loading}
          className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Motivational Quote */}
      {quote && (
        <div className="mb-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-orange-300 dark:border-orange-700">
          <div className="flex items-start gap-2">
            <Sparkles className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
            <p className="text-sm italic text-gray-700 dark:text-gray-300">"{quote}"</p>
          </div>
        </div>
      )}

      {/* Routine Items */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 bg-white/50 dark:bg-gray-800/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {routine.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer border border-orange-200 dark:border-orange-700"
                onClick={() => addToTasks(item)}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-2 rounded-lg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h4>
                      <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">
                        {item.duration}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Click any activity to add it to your tasks
        </p>
      </div>
    </div>
  );
}

