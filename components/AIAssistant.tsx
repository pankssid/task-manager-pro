'use client';

import { useState } from 'react';
import { Sparkles, Send, Loader2, X } from 'lucide-react';

interface AIAssistantProps {
  onSuggestTasks: (tasks: string[]) => void;
}

export default function AIAssistant({ onSuggestTasks }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleAskAI = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.response);
        if (data.tasks && data.tasks.length > 0) {
          onSuggestTasks(data.tasks);
        }
      } else {
        setResponse(data.error || 'Failed to get AI suggestion');
      }
    } catch (error) {
      setResponse('Failed to connect to AI assistant');
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    '🌅 Plan my perfect morning routine',
    '💪 Suggest productive tasks for today',
    '🎯 Help me prioritize my goals',
    '⚡ Give me a quick energy boost plan',
  ];

  return (
    <>
      {/* Floating AI Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 z-50 animate-pulse"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* AI Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden border-2 border-purple-300 dark:border-purple-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-white" />
              <h3 className="text-white font-bold">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {/* Quick Actions */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick Actions:</p>
              <div className="grid grid-cols-1 gap-2">
                {quickPrompts.map((quick, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(quick.replace(/[🌅💪🎯⚡]\s/, ''))}
                    className="text-left text-sm bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-lg hover:scale-105 transition-transform border border-purple-200 dark:border-purple-700"
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>

            {/* Response Area */}
            {response && (
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm whitespace-pre-wrap">{response}</p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="mb-4 flex items-center justify-center gap-2 text-purple-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                placeholder="Ask AI anything..."
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                onClick={handleAskAI}
                disabled={loading || !prompt.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

