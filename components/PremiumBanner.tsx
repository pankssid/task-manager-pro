'use client';

import { Crown, Check } from 'lucide-react';

interface PremiumBannerProps {
  isPremium: boolean;
  onUpgrade: () => void;
  loading?: boolean;
}

export default function PremiumBanner({ isPremium, onUpgrade, loading = false }: PremiumBannerProps) {
  if (isPremium) {
    return (
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">Premium Member</h3>
            <p className="text-yellow-100">You have unlimited access to all features!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-6 h-6" />
            <h3 className="text-xl font-bold">Upgrade to Premium</h3>
          </div>
          <p className="text-blue-100 mb-3">Unlock unlimited tasks and premium features!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Unlimited tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Priority support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Advanced filters</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Task analytics</span>
            </div>
          </div>
        </div>

        <button
          onClick={onUpgrade}
          disabled={loading}
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? 'Processing...' : 'Upgrade for $9.99/month'}
        </button>
      </div>
    </div>
  );
}

