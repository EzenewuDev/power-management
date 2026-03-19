'use client';

import Sidebar from '@/components/Sidebar';
import { User, Shield, Mail, GraduationCap, MapPin, Edit2, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen message="Loading Profile..." />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
      <Sidebar />
      <main className="flex-1 ml-72 p-10 max-w-[1600px] mx-auto">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
                <User className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Student Profile</h1>
            </div>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest ml-14">
              Manage Your <span className="text-indigo-600">LCU Account</span> & Preferences
            </p>
          </div>
          <button className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all gap-3">
            <Edit2 className="h-4 w-4" /> Edit Profile
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-10">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm text-center">
              <div className="relative inline-block mb-6">
                <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-black text-4xl border-4 border-white shadow-xl">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="absolute bottom-0 right-0 bg-emerald-500 h-6 w-6 rounded-full border-4 border-white"></div>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">{user?.firstName} {user?.lastName}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user?.role?.replace('_', ' ')}</p>
              
              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                <div className="flex items-center gap-4 text-slate-500 font-bold text-sm">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                  Primary Hostel: <span className="text-slate-900 ml-auto">LCU Hostel</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 font-bold text-sm">
                  <Zap className="h-5 w-5 text-indigo-600" />
                  Alert Status: <span className="text-emerald-600 ml-auto">Enabled</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-4">
                <Shield className="h-6 w-6 text-indigo-600" /> Account Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Official Email Address</label>
                  <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-50">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-900">{user?.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Matriculation Number</label>
                  <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-50">
                    <GraduationCap className="h-5 w-5 text-slate-400" />
                    <span className="text-sm font-bold text-slate-900">LCU/UG/22/24805</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-white/5 rounded-full blur-[80px]"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-4">Privacy & Security</h3>
                <p className="text-slate-400 font-bold leading-relaxed mb-8 max-w-lg">
                  Your data is protected using enterprise-grade encryption. We only use your information to provide personalized power alerts for your campus zone.
                </p>
                <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 active:scale-95">
                  Manage Security
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
