'use client';

import Sidebar from '@/components/Sidebar';
import { BarChart3, TrendingUp, Zap, ZapOff, BatteryCharging } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';

export default function AnalyticsPage() {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen message="Loading Analytics..." />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
      <Sidebar />
      <main className="flex-1 ml-72 p-10 max-w-[1600px] mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Power Analytics</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest ml-14">
            Detailed Consumption & <span className="text-indigo-600">Grid Performance</span>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Grid Uptime</h3>
            </div>
            <p className="text-4xl font-black text-slate-900 mb-2">92.4%</p>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Last 30 Days</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
                <BatteryCharging className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Generator Usage</h3>
            </div>
            <p className="text-4xl font-black text-slate-900 mb-2">5.2%</p>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Efficiency Optimized</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-rose-50 p-3 rounded-2xl text-rose-600">
                <ZapOff className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Total Outages</h3>
            </div>
            <p className="text-4xl font-black text-slate-900 mb-2">12h</p>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Down-time Recorded</p>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm min-h-[400px] flex items-center justify-center text-center">
          <div className="max-w-md">
            <TrendingUp className="h-16 w-16 text-slate-200 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-slate-900 mb-4">Analytics Visualization Coming Soon</h2>
            <p className="text-slate-500 font-bold leading-relaxed">
              We are currently processing historical grid data to provide you with detailed consumption charts and predictive trends for each campus zone.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
