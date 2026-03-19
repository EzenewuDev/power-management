'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold">
              PowerMS
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.firstName}</span>
            <button
              onClick={logout}
              className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
