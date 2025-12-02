"use client";

import { Target } from 'lucide-react';

export default function ObjectifsPage() {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-700 mb-4">Objectifs</h2>
      <div className="bg-white/80 rounded-3xl p-6 shadow-sm text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-2xl flex items-center justify-center">
          <Target className="w-8 h-8 text-purple-400" />
        </div>
        <p className="text-sm text-gray-500">Page en construction...</p>
        <p className="text-xs text-gray-400 mt-2">Cette fonctionnalité arrive bientôt !</p>
      </div>
    </div>
  );
}