'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { Zap, ShieldCheck, User, Mail, Lock, GraduationCap, MapPin, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface Zone {
  id: number;
  name: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    matricNumber: '',
    role: 'student',
    campusZoneId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/users/register', {
        ...formData,
        campusZoneId: formData.campusZoneId ? parseInt(formData.campusZoneId) : undefined,
      });
      
      if (response.data && response.data.token) {
        login(response.data.token, response.data.user);
      } else {
        throw new Error('Registration failed. Please check your details and try again.');
      }
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data: { message: string } };
        request?: object;
        message?: string;
      };
      
      if (axiosError.response) {
        setError(axiosError.response.data.message || 'An unexpected error occurred during registration.');
      } else if (axiosError.request) {
        setError('No response from server. Please check if the backend is running.');
      } else {
        setError(`Request error: ${axiosError.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Dynamic Background - Unique for Signup */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-700 to-blue-800 opacity-95"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-400/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-400/30 rounded-full blur-[120px]"></div>
      </div>

      {loading && <Loader fullScreen message="Creating secure profile..." />}

      <div className="relative z-10 w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white/10 backdrop-blur-2xl rounded-[3rem] p-8 sm:p-12 border border-white/20 shadow-2xl">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center justify-center bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-500/20 mb-6 hover:scale-105 transition-transform active:scale-95">
              <ShieldCheck className="h-8 w-8 text-white" />
            </Link>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Join LCU Power</h1>
            <p className="text-blue-100 font-bold opacity-70">Create your verified student account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2">
                <Zap className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] ml-1">Account Type</label>
              <select
                name="role"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student" className="text-slate-900">Student Access</option>
                <option value="power_admin" className="text-slate-900">Staff (Power Admin)</option>
                <option value="super_admin" className="text-slate-900">System (Super Admin)</option>
              </select>
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-blue-300 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  name="firstName"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all font-medium"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-blue-300 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  name="lastName"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all font-medium"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-blue-300 group-focus-within:text-white transition-colors" />
              </div>
              <input
                name="email"
                type="email"
                required
                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all font-medium"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-white transition-colors" />
              </div>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="block w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all font-medium"
                placeholder="Secure Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {formData.role === 'student' && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-blue-300 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  name="matricNumber"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all font-medium"
                  placeholder="Matric Number (LCU/UG/YY/XXXXX)"
                  value={formData.matricNumber}
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-blue-300 group-focus-within:text-white transition-colors" />
              </div>
              <select
                name="campusZoneId"
                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all font-medium appearance-none"
                value={formData.campusZoneId}
                onChange={handleChange}
              >
                <option value="" className="text-gray-900">Select Primary Zone (Optional)</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id} className="text-gray-900">
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-500 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 mt-4"
            >
              Initialize Account
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-blue-100 font-bold opacity-70 mb-2">Already registered?</p>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-white font-black hover:text-blue-300 transition-colors border-b-2 border-blue-500/50 hover:border-white pb-1"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-8 text-blue-200/50 text-xs font-black uppercase tracking-[0.2em]">
          Community Driven • Official LCU Power Portal
        </p>
      </div>
    </div>
  );
}
