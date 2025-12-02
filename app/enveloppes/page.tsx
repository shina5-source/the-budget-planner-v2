"use client";

import { Mail } from 'lucide-react';

export default function EnveloppesPage() {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-700 mb-4">Enveloppes</h2>
      <div className="bg-white/80 rounded-3xl p-6 shadow-sm text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-violet-100 rounded-2xl flex items-center justify-center">
          <Mail className="w-8 h-8 text-violet-400" />
        </div>
        <p className="text-sm text-gray-500">Page en construction...</p>
        <p className="text-xs text-gray-400 mt-2">Cette fonctionnalité arrive bientôt !</p>
      </div>
    </div>
  );
}