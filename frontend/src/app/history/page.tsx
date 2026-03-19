'use client';

import Sidebar from '@/components/Sidebar';
import { History, Zap, Shield, Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';

export default function HistoryPage() {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen message="Loading History..." />;
  if (!user) return null;

  const mockHistory = [
    { id: 1, zone: 'Main Campus', source: 'grid', time: '10:45 AM', date: 'Mar 19, 2026', status: 'Restored' },
    { id: 2, zone: 'Science Block', source: 'generator', time: '09:12 AM', date: 'Mar 19, 2026', status: 'Maintenance' },
    { id: 3, zone: 'Hostel Zone', source: 'off', time: '08:00 AM', date: 'Mar 19, 2026', status: 'Fault Reported' },
    { id: 4, zone: 'Library Complex', source: 'grid', time: '11:30 PM', date: 'Mar 18, 2026', status: 'Stable' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
      <Sidebar />
      <main className="flex-1 ml-72 p-10 max-w-[1600px] mx-auto">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
                <History className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Grid History</h1>
            </div>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest ml-14">
              Historical <span className="text-indigo-600">Power Events</span> & Logs
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search events..." className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl w-64 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50 shadow-sm" />
            </div>
            <button className="h-12 w-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-600 shadow-sm"><Filter className="h-5 w-5" /></button>
          </div>
        </header>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Event Date</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Campus Zone</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockHistory.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-10 py-8">
                    <p className="text-sm font-black text-slate-900">{event.date}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{event.time}</p>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{event.zone}</p>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                      event.source === 'grid' ? 'text-emerald-600' : event.source === 'generator' ? 'text-amber-600' : 'text-rose-500'
                    }`}>
                      {event.source === 'grid' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {event.source}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-sm font-bold text-slate-600">{event.status}</span>
                  </td>
                  <td className="px-10 py-8 text-sm text-gray-500">
                    <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex justify-center">
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Load More History</button>
          </div>
        </div>
      </main>
    </div>
  );
}
