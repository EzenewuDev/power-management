'use client';

import Sidebar from '@/components/Sidebar';
import { Settings, Shield, Bell, Lock, Globe, Database, Sliders, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';

export default function SettingsPage() {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen message="Loading Settings..." />;
  if (!user) return null;

  const sections = [
    { title: 'Security & Access', icon: Lock, desc: 'Manage password and multi-factor authentication settings.' },
    { title: 'Notification Channels', icon: Bell, desc: 'Configure SMS, Email, and Push notifications for grid alerts.' },
    { title: 'Campus Data Sync', icon: Database, desc: 'Manage how your device synchronizes with LCU power house.' },
    { title: 'Regional Preferences', icon: Globe, desc: 'Set your default campus zone and time format.' },
    { title: 'Advanced Control', icon: Sliders, desc: 'Developer settings and API access configuration.' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
      <Sidebar />
      <main className="flex-1 ml-72 p-10 max-w-[1600px] mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Settings</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest ml-14">
            Customize Your <span className="text-indigo-600">Platform Experience</span>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {sections.map((section) => (
            <button key={section.title} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center justify-between text-left group hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
              <div className="flex items-center gap-6">
                <div className="bg-slate-50 p-4 rounded-2xl text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                  <section.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{section.title}</h3>
                  <p className="text-sm font-bold text-slate-500 leading-relaxed pr-8">{section.desc}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>

        <div className="bg-rose-50 p-10 rounded-[3rem] border border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm text-rose-600">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-rose-900 mb-1">Deactivate LCU Account</h3>
              <p className="text-rose-700/70 font-bold text-sm">Once confirmed, you will no longer receive critical grid status notifications.</p>
            </div>
          </div>
          <button className="bg-rose-600 hover:bg-rose-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-rose-600/20 active:scale-95">
            Terminate Session
          </button>
        </div>
      </main>
    </div>
  );
}
