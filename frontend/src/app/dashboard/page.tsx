'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import api from '@/lib/api';
import { io } from 'socket.io-client';
import Link from 'next/link';
import PredictionChart from '@/components/PredictionChart';
import ReportOutageModal from '@/components/ReportOutageModal';
import { Zap, AlertTriangle, TrendingUp, Users, Clock, Shield, MapPin, Search, Bell, ChevronRight, Activity, BatteryCharging, ZapOff } from 'lucide-react';
import Loader from '@/components/Loader';

interface Prediction {
  prediction_for: string;
  predicted_source: 'grid' | 'generator' | 'off';
  confidence_score: number;
  campus_zone_id: number;
}

interface PowerStatus {
  id: number;
  campus_zone_id: number;
  campus_zone_name: string;
  power_source: 'grid' | 'generator' | 'off';
  status: string;
  changed_by_name: string;
  timestamp: string;
  fuel_level?: number;
  notes?: string;
  predictions?: Prediction[];
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [statuses, setStatuses] = useState<PowerStatus[]>([]);
  const [activeReportZone, setActiveReportZone] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, predictionsRes] = await Promise.all([
          api.get('/power/status').catch(() => ({ data: [] })),
          api.get('/predictions/all').catch(() => ({ data: [] }))
        ]);
        
        const statusesData = Array.isArray(statusRes.data) ? statusRes.data : [];
        const predictionsData = Array.isArray(predictionsRes.data) ? predictionsRes.data : [];
        
        const statusWithPredictions = statusesData.map((s: PowerStatus) => ({
          ...s,
          predictions: predictionsData.filter((p: Prediction) => p.campus_zone_id === s.campus_zone_id)
        }));
        
        setStatuses(statusWithPredictions);
      } catch (err) {
        console.error('Failed to process dashboard data', err);
        setStatuses([]);
      }
    };

    fetchData();

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const newSocket = io(socketUrl);

    newSocket.on('powerStatusChanged', (newStatus: PowerStatus) => {
      setStatuses((prev) => 
        prev.map((s) => s.campus_zone_id === newStatus.campus_zone_id ? { ...s, ...newStatus } : s)
      );
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleQuickToggle = async (zoneId: number, source: 'grid' | 'generator' | 'off') => {
    try {
      const response = await api.post('/power/status', {
        campusZoneId: zoneId,
        powerSource: source,
        status: source === 'grid' ? 'Stable Grid Supply' : source === 'generator' ? 'Generator Active' : 'Total Outage',
        notes: `Quick toggle from dashboard`
      });
      
      setStatuses(prev => prev.map(s => s.campus_zone_id === zoneId ? { ...s, ...response.data } : s));
    } catch (err) {
      console.error('Failed to toggle power status', err);
    }
  };

  if (loading) return <Loader fullScreen message="Loading Dashboard..." />;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest">Access Denied</div>;

  const getStatusColor = (source: string) => {
    switch (source) {
      case 'grid': return 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-50';
      case 'generator': return 'bg-amber-50 text-amber-700 border-amber-100 shadow-amber-50';
      case 'off': return 'bg-rose-50 text-rose-700 border-rose-100 shadow-rose-50';
      default: return 'bg-gray-50 text-gray-700 border-gray-100 shadow-gray-50';
    }
  };

  const filteredStatuses = statuses.filter(s => 
    s.campus_zone_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
      <Sidebar />
      
      <main className="flex-1 ml-72 p-10 max-w-[1600px] mx-auto">
        {/* Top Professional Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">University Status</h1>
            <p className="text-slate-500 font-bold flex items-center gap-2 uppercase tracking-[0.2em] text-[10px]">
              <Activity className="w-4 h-4 text-indigo-600" />
              Real-time Grid Synchronization Active
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search campus zones..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl w-80 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all shadow-sm"
              />
            </div>

            {/* Notifications Toggle */}
            <button className="relative h-12 w-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm group">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
            </button>
          </div>
        </header>

        {/* User Context & Quick Stats Card */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-white/5 rounded-full blur-[80px]"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Welcome back,</p>
                <h2 className="text-4xl font-black mb-2">{user.firstName} {user.lastName}</h2>
                <div className="flex items-center gap-3 text-slate-300 font-bold text-sm">
                  <MapPin className="h-4 w-4 text-indigo-400" />
                  Primary Zone: <span className="text-white">{statuses.find(s => s.campus_zone_id === user.campusZoneId)?.campus_zone_name || 'Not Set'}</span>
                </div>
              </div>
              <div className="mt-12 flex gap-4">
                <Link 
                  href="/profile"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                >
                  Update Profile
                </Link>
                <Link 
                  href="/analytics"
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all border border-white/10 active:scale-95"
                >
                  View Analytics
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-emerald-600" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Community</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">2.4k+</h3>
            </div>
            <p className="text-slate-500 font-bold text-sm">Active students monitoring</p>
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-indigo-600" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-2">System Health</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">99.9%</h3>
            </div>
            <p className="text-slate-500 font-bold text-sm">Grid verification accuracy</p>
          </div>
        </section>

        {/* Grid Status Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Campus Grid Overview</h3>
            <span className="bg-white border border-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {filteredStatuses.length} Zones Tracked
            </span>
          </div>
          <Link href="/history" className="text-sm font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-2 group">
            View History Logs <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {filteredStatuses.map((status) => (
            <div key={status.campus_zone_id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 transition-all duration-500 group">
              <div className="p-8">
                {/* Status Indicator & Title */}
                <div className="flex items-start justify-between mb-8">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {status.campus_zone_name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Last sync {new Date(status.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className={`h-3 w-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] ${
                    status.power_source === 'grid' ? 'bg-emerald-500 animate-pulse' : 
                    status.power_source === 'generator' ? 'bg-amber-500' : 'bg-rose-500'
                  }`}></div>
                </div>

                {/* Main Status Display */}
                <div className={`rounded-3xl p-6 border mb-8 flex flex-col gap-4 ${getStatusColor(status.power_source)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/50 p-3 rounded-2xl backdrop-blur-sm">
                        {status.power_source === 'grid' ? <Zap className="h-6 w-6" /> : 
                         status.power_source === 'generator' ? <BatteryCharging className="h-6 w-6" /> : 
                         <ZapOff className="h-6 w-6" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Source</p>
                        <p className="text-lg font-black uppercase tracking-tight">{status.power_source}</p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Quick Toggles */}
                  {user.role !== 'student' && (
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => handleQuickToggle(status.campus_zone_id, 'grid')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${status.power_source === 'grid' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white/50 hover:bg-white text-slate-600'}`}
                      >
                        Grid
                      </button>
                      <button 
                        onClick={() => handleQuickToggle(status.campus_zone_id, 'generator')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${status.power_source === 'generator' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white/50 hover:bg-white text-slate-600'}`}
                      >
                        Gen
                      </button>
                      <button 
                        onClick={() => handleQuickToggle(status.campus_zone_id, 'off')}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${status.power_source === 'off' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white/50 hover:bg-white text-slate-600'}`}
                      >
                        Off
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub Stats */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Description
                    </span>
                    <span className="text-slate-900">{status.status}</span>
                  </div>
                  
                  {status.power_source === 'generator' && status.fuel_level !== undefined && (
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Fuel Reserve</span>
                        <span className={`text-sm font-black ${status.fuel_level < 20 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {status.fuel_level}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-50 rounded-full h-2.5 p-0.5 border border-slate-100">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-700 ${
                            status.fuel_level < 20 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 
                            'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          }`} 
                          style={{ width: `${status.fuel_level}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chart Integration */}
                {status.predictions && status.predictions.length > 0 && (
                  <div className="pt-6 border-t border-slate-50">
                    <h4 className="text-[10px] font-black text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                      <TrendingUp className="w-4 h-4 text-indigo-500" />
                      Predicted Grid Load
                    </h4>
                    <PredictionChart data={status.predictions} />
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="bg-slate-50/50 px-8 py-5 border-t border-slate-100 flex justify-between items-center">
                {user.role !== 'student' ? (
                  <Link 
                    href={`/dashboard/update/${status.campus_zone_id}`}
                    className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-2 uppercase tracking-widest"
                  >
                    Manage Zone
                  </Link>
                ) : (
                  <button 
                    onClick={() => setActiveReportZone(status.campus_zone_id)}
                    className="text-xs font-black text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition-all uppercase tracking-widest"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Report
                  </button>
                )}
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Sync ID: #{status.id}</span>
              </div>
            </div>
          ))}
        </div>
        
        {activeReportZone && (
          <ReportOutageModal 
            zoneId={activeReportZone} 
            onClose={() => setActiveReportZone(null)} 
          />
        )}
      </main>
    </div>
  );
}
