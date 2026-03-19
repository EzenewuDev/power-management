'use client';

import Sidebar from '@/components/Sidebar';
import { Bell, Shield, Info, AlertTriangle, CheckCircle2, Search, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';

export default function NotificationsPage() {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen message="Loading Notifications..." />;
  if (!user) return null;

  const notifications = [
    { id: 1, type: 'alert', title: 'Grid Restoration', desc: 'Main Campus grid power has been restored successfully.', time: '10:45 AM', date: 'Mar 19, 2026', unread: true },
    { id: 2, type: 'warning', title: 'Generator Maintenance', desc: 'Science Block generator scheduled for maintenance at 2 PM.', time: '09:12 AM', date: 'Mar 19, 2026', unread: true },
    { id: 3, type: 'info', title: 'New Zone Deployment', desc: 'A new monitoring node has been deployed in the Sports Complex.', time: '08:00 AM', date: 'Mar 19, 2026', unread: false },
    { id: 4, type: 'success', title: 'Account Verified', desc: 'Your LCU student account has been successfully verified.', time: '11:30 PM', date: 'Mar 18, 2026', unread: false },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'warning': return <Shield className="h-5 w-5 text-rose-500" />;
      case 'success': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      default: return <Info className="h-5 w-5 text-indigo-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
      <Sidebar />
      <main className="flex-1 ml-72 p-10 max-w-[1600px] mx-auto">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Notifications</h1>
            </div>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest ml-14">
              Alerts & <span className="text-indigo-600">Grid Broadcasts</span>
            </p>
          </div>
          <div className="flex gap-4">
            <button className="h-12 px-6 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-600 shadow-sm text-xs font-black uppercase tracking-widest transition-all hover:bg-indigo-50">Mark All as Read</button>
            <button className="h-12 w-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-600 shadow-sm"><Settings className="h-5 w-5" /></button>
          </div>
        </header>

        <div className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif.id} className={`bg-white p-8 rounded-[2.5rem] border transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 ${
              notif.unread ? 'border-indigo-100 bg-indigo-50/10' : 'border-slate-50'
            }`}>
              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-2xl shadow-sm bg-white border border-slate-50 group-hover:scale-110 transition-transform`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-slate-900 truncate pr-4">{notif.title}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{notif.time}</p>
                  </div>
                  <p className="text-slate-500 font-bold leading-relaxed pr-8">{notif.desc}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">View Details</button>
                    {notif.unread && <span className="h-2 w-2 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
