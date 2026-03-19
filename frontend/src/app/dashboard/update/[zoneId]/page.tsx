'use client';

import { useEffect, useState, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { ArrowLeft, Save, Info, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

interface Zone {
  id: number;
  name: string;
}

export default function UpdateStatusPage({ params }: { params: Promise<{ zoneId: string }> }) {
  const { zoneId } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [zone, setZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState({
    powerSource: 'grid',
    status: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchZone = async () => {
      try {
        const response = await api.get('/power/zones');
        const foundZone = response.data.find((z: Zone) => z.id === parseInt(zoneId));
        if (foundZone) setZone(foundZone);
      } catch (err) {
        console.error('Failed to fetch zone', err);
      }
    };
    fetchZone();
  }, [zoneId]);

  if (loading) return <Loader fullScreen message="Loading Admin Panel..." />;
  if (!user || (user.role !== 'power_admin' && user.role !== 'super_admin')) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-center px-4">Unauthorized Access - Staff Only</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.post('/power/status', {
        campusZoneId: parseInt(zoneId),
        powerSource: formData.powerSource,
        status: formData.status,
        notes: formData.notes,
      });
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response: { data: { message: string } } };
        setError(axiosError.response?.data?.message || 'Failed to update status');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
      <Sidebar />
      
      <main className="flex-1 ml-72 p-10 max-w-4xl">
        {/* Header */}
        <header className="flex items-center gap-6 mb-12">
          <button 
            onClick={() => router.back()}
            className="h-12 w-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Zone Management</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
              Updating: <span className="text-indigo-600">{zone?.name || '...'}</span>
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Form Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                  <Info className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Status Configuration</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Power Source</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all appearance-none cursor-pointer"
                      value={formData.powerSource}
                      onChange={(e) => setFormData({ ...formData, powerSource: e.target.value })}
                    >
                      <option value="grid">Main Grid (NEPA)</option>
                      <option value="generator">Backup Generator</option>
                      <option value="off">Complete Outage</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Status Label</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all placeholder:text-slate-300"
                      placeholder="e.g., Stable Supply"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Internal Notes</label>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all placeholder:text-slate-300 min-h-[120px]"
                    rows={4}
                    placeholder="Details about maintenance or specific issues..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    <Save className="h-5 w-5" />
                    {submitting ? 'Broadcasting Updates...' : 'Publish Status Update'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-4 bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 rounded-2xl font-black text-sm transition-all active:scale-[0.98]"
                  >
                    Discard
                  </button>
                </div>
              </form>
            </div>
            
            {/* Context Footer */}
            <div className="bg-slate-50/50 p-8 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                <span className="text-indigo-600 font-black">Staff Notice:</span> Status updates are broadcasted in real-time to all connected students and campus dashboards via WebSockets.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
