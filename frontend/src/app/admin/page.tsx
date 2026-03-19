'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { Shield, Plus, Table, AlertCircle, Info, CheckCircle2, XCircle } from 'lucide-react';
import api from '@/lib/api';
import Loader from '@/components/Loader';

interface Zone {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [zones, setZones] = useState<Zone[]>([]);
  const [newZone, setNewZone] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await api.get('/power/zones');
        setZones(response.data);
      } catch (err) {
        console.error('Failed to fetch zones', err);
      }
    };
    fetchZones();
  }, []);

  if (loading) return <Loader fullScreen message="Loading Admin Settings..." />;
  if (!user || user.role !== 'super_admin') return <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-center px-4">Super Admin Access Required</div>;

  const handleAddZone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/power/zones', newZone);
      setZones([...zones, response.data]);
      setNewZone({ name: '', description: '' });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response: { data: { message: string } } };
        setError(axiosError.response?.data?.message || 'Failed to add zone');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
      <Sidebar />
      
      <main className="flex-1 ml-72 p-10 max-w-6xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Infrastructure Control</h1>
          </div>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest ml-14">
            System Configuration & <span className="text-indigo-600">Zone Management</span>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden sticky top-10">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                    <Plus className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Provision New Zone</h2>
                </div>

                <form onSubmit={handleAddZone} className="space-y-6">
                  {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Zone Identifier</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Science Complex"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all"
                      value={newZone.name}
                      onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contextual Description</label>
                    <textarea
                      required
                      placeholder="Specify buildings or coverage area..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all min-h-[100px]"
                      value={newZone.description}
                      onChange={(e) => setNewZone({ ...newZone, description: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    Deploy Infrastructure
                  </button>
                </form>
              </div>
              <div className="bg-slate-50/50 p-6 border-t border-slate-100">
                <div className="flex gap-3">
                  <Info className="h-4 w-4 text-indigo-600 mt-0.5" />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    New zones are immediately available for status monitoring and crowdsourced reporting once deployed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-50 p-2 rounded-xl text-slate-600">
                    <Table className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Active Grid Nodes</h2>
                </div>
                <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {zones.length} Total Clusters
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Node ID</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Name</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {zones.map((zone) => (
                      <tr key={zone.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-6 text-sm font-black text-slate-400">#00{zone.id}</td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{zone.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1">{zone.description}</p>
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-500">
                          {zone.is_active ? (
                            <span className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                              <CheckCircle2 className="h-3 w-3" /> Syncing
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-rose-400 font-black text-[10px] uppercase tracking-widest">
                              <XCircle className="h-3 w-3" /> Offline
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">
                            Configure
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
