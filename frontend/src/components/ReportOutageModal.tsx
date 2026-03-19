'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { AlertTriangle, CheckCircle, Zap } from 'lucide-react';

export default function ReportOutageModal({ zoneId, onClose }: { zoneId: number, onClose: () => void }) {
  const [source, setSource] = useState<'grid' | 'generator' | 'off'>('grid');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/crowdsource/report', { campusZoneId: zoneId, reportedSource: source });
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="text-indigo-600 w-5 h-5" />
            Report Power Status
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium">Thank you!</p>
            <p className="text-gray-500">Your report helps fellow LCU students.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-gray-500">What is the current power status in your area?</p>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'grid', label: 'Main Grid (NEPA)', icon: Zap, color: 'text-green-600' },
                { id: 'generator', label: 'Generator', icon: Zap, color: 'text-yellow-600' },
                { id: 'off', label: 'No Power (Outage)', icon: AlertTriangle, color: 'text-red-600' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSource(opt.id as 'grid' | 'generator' | 'off')}
                  className={`flex items-center gap-4 p-4 border rounded-xl transition-all ${
                    source === opt.id ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <opt.icon className={`w-6 h-6 ${opt.color}`} />
                  <span className="font-semibold text-gray-800">{opt.label}</span>
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Reporting...' : 'Submit Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
