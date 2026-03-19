'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { Zap, ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/users/login', { email, password });
      login(response.data.token, response.data.user);
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data: { message: string } };
        request?: object;
        message?: string;
      };
      
      if (axiosError.response) {
        setError(axiosError.response.data.message || 'Invalid credentials');
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
      {/* Dynamic Background - Unique for Login */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 opacity-95"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/20 rounded-full blur-[120px]"></div>
      </div>

      {loading && <Loader fullScreen message="Securing session..." />}

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-12 border border-white/20 shadow-2xl">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center justify-center bg-indigo-600 p-4 rounded-3xl shadow-xl shadow-indigo-500/20 mb-6 hover:scale-105 transition-transform active:scale-95">
              <Zap className="h-8 w-8 text-white" />
            </Link>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back</h1>
            <p className="text-indigo-100 font-bold opacity-70">Log in to LCU Power Monitor</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                <ShieldCheck className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-indigo-300 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all font-medium"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-300 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all font-medium"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-indigo-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              Secure Sign In
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-indigo-100 font-bold opacity-70 mb-4">New to the community?</p>
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-2 text-white font-black hover:text-indigo-300 transition-colors border-b-2 border-indigo-500/50 hover:border-white pb-1"
            >
              Create LCU Account
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-8 text-indigo-200/50 text-xs font-black uppercase tracking-[0.2em]">
          Official LCU Infrastructure • Secured by IDSECURE
        </p>
      </div>
    </div>
  );
}
