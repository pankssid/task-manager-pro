'use client';

import { Task } from '@/lib/types';
import { TrendingUp, Award, Clock, Target, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AIInsightsProps {
  tasks: Task[];
}

export default function AIInsights({ tasks }: AIInsightsProps) {
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    if (tasks.length > 0) {
      analyzeTasksWithAI();
    }
  }, [tasks]);

  const analyzeTasksWithAI = async () => {
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks }),
      });

      const data = await res.json();
      if (res.ok) {
        setInsights(data.insights);
      }
    } catch (error) {
      console.error('Failed to get AI insights:', error);
    }
  };

  if (!insights) {
    return null;
  }

  const statCards = [
    {
      icon: TrendingUp,
      title: 'Productivity Score',
      value: insights.productivityScore || 'N/A',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    },
    {
      icon: Clock,
      title: 'Avg. Completion Time',
      value: insights.avgCompletionTime || 'N/A',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    },
    {
      icon: Target,
      title: 'Focus Area',
      value: insights.focusArea || 'Balanced',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
    },
    {
      icon: Zap,
      title: 'Peak Hours',
      value: insights.peakHours || 'Morning',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
          <Award className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Insights</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Smart analysis of your productivity
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${stat.bgColor} rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform`}
          >
            <div className={`bg-gradient-to-r ${stat.color} p-2 rounded-lg w-fit mb-2`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* AI Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            AI Recommendations
          </h4>
          <ul className="space-y-2">
            {insights.recommendations.map((rec: string, idx: number) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="text-purple-600 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

