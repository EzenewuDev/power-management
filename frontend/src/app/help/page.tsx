'use client';

import Sidebar from '@/components/Sidebar';
import { HelpCircle, Search, MessageCircle, ExternalLink, Zap, Shield, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';

export default function HelpPage() {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen message="Loading Help..." />;
  if (!user) return null;

  const faqs = [
    { q: 'How accurate are the power predictions?', a: 'Our AI model achieves over 90% accuracy by analyzing historical data patterns and scheduled grid maintenance.' },
    { q: 'Can I report a power outage in my hostel?', a: 'Yes! Students can use the "Report Outage" feature. Once verified, it gets broadcasted to everyone.' },
    { q: 'Is this service official?', a: 'Absolutely. We cover all LCU zones including the Main Campus, Science Block, and Hostels.' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
      <Sidebar />
      <main className="flex-1 ml-72 p-10 max-w-[1600px] mx-auto">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Help Center</h1>
            </div>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest ml-14">
              Resources & <span className="text-indigo-600">Support Guide</span>
            </p>
          </div>
          <button className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all gap-3">
            <MessageCircle className="h-4 w-4" /> Live Support
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          {[
            { title: 'Quick Start', icon: BookOpen, desc: 'Learn how to monitor your campus zone effectively.' },
            { title: 'Security Guide', icon: Shield, desc: 'How we protect your LCU student data and credentials.' },
            { title: 'System Status', icon: Zap, desc: 'Real-time uptime status of our monitoring infrastructure.' },
          ].map((item) => (
            <div key={item.title} className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm text-center group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                <item.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-500 font-bold leading-relaxed mb-8">{item.desc}</p>
              <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest flex items-center gap-2 mx-auto">
                Read Documentation <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white p-12 rounded-[4rem] border border-slate-50 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Search className="h-64 w-64" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-12 tracking-tight">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-12">
            {faqs.map((faq) => (
              <div key={faq.q} className="space-y-4">
                <h4 className="text-lg font-black text-slate-900 flex items-center gap-4">
                  <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                  {faq.q}
                </h4>
                <p className="text-slate-500 font-bold leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
