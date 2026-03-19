'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Shield, TrendingUp, ChevronDown, Menu, X, Users, ZapOff, BookOpen } from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How accurate are the power predictions?",
      answer: "Our AI model achieves over 90% accuracy by analyzing historical data patterns and scheduled grid maintenance from Lead City University's power history."
    },
    {
      question: "Can I report a power outage in my hostel?",
      answer: "Yes! Students can use the 'Report Outage' feature. Once 3 students in the same zone report the same status, it gets verified and broadcasted to everyone."
    },
    {
      question: "Is this service available for all campus zones?",
      answer: "Absolutely. We cover all LCU zones including the Main Campus, Science Block, Hostel Areas, and the Library Complex."
    },
    {
      question: "How do I get notified of power changes?",
      answer: "You can enable browser push notifications or check the live dashboard. We're also working on SMS and Email alerts for verified users."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo and Brand - Stays on the left */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-gray-900">LCU POWER</span>
            </div>

            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors">How it Works</Link>
              <Link href="#faq" className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors">FAQ</Link>
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors">Sign in</Link>
              <Link href="/signup" className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                Create Account
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-900 p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
            <div className="space-y-1 px-4 pt-2 pb-6">
              <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-base font-bold text-gray-900">Features</Link>
              <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-base font-bold text-gray-900">How it Works</Link>
              <Link href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-base font-bold text-gray-900">FAQ</Link>
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/login" className="flex justify-center py-3 text-base font-bold text-gray-900 border border-gray-200 rounded-xl">Sign in</Link>
                <Link href="/signup" className="flex justify-center py-3 text-base font-bold text-white bg-indigo-600 rounded-xl shadow-lg">Create Account</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                Live across LCU Campus
              </div>
              <h1 className="text-5xl sm:text-7xl font-black text-gray-900 leading-[1.1] mb-8">
                Master Your Time with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">LCU Power</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-10 max-w-xl">
                The official electricity monitoring platform for Lead City University. Real-time status, smart predictions, and crowdsourced reports at your fingertips.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="rounded-2xl bg-indigo-600 px-10 py-5 text-lg font-black text-white shadow-2xl shadow-indigo-200 hover:bg-indigo-500 hover:-translate-y-1 active:translate-y-0 transition-all text-center"
                >
                  Start Monitoring
                </Link>
                <Link
                  href="/login"
                  className="rounded-2xl bg-white border-2 border-gray-100 px-10 py-5 text-lg font-black text-gray-900 hover:bg-gray-50 hover:border-gray-200 transition-all text-center flex items-center justify-center gap-2"
                >
                  Live Dashboard <ChevronDown className="h-5 w-5 -rotate-90" />
                </Link>
              </div>
            </div>
            
            <div className="relative lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white group aspect-[4/3]">
                <Image 
                  src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200" 
                  alt="Lead City University Senate Building" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-500 h-3 w-3 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                    <span className="font-black uppercase tracking-widest text-xs">Currently: Main Grid Active</span>
                  </div>
                </div>
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -right-6 md:right-12 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-3 rounded-xl">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">2.4k+</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Students Tracking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-indigo-600 font-black uppercase tracking-[0.2em] text-sm mb-4">Core Capabilities</h2>
            <p className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
              Designed for the modern LCU student experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Live Grid Sync",
                desc: "Real-time synchronization with LCU's central power house for up-to-the-second source updates.",
                icon: Zap,
                color: "bg-amber-500"
              },
              {
                title: "Smart Forecasts",
                desc: "Know exactly when power will likely go off. Plan your phone charging and study time effectively.",
                icon: TrendingUp,
                color: "bg-indigo-600"
              },
              {
                title: "Zone Monitoring",
                desc: "Specific status for every hostel, lecture hall, and administrative block across campus.",
                icon: Shield,
                color: "bg-blue-600"
              },
              {
                title: "Crowd Verification",
                desc: "If something's wrong, report it. Community-driven data verification for 100% accuracy.",
                icon: Users,
                color: "bg-purple-600"
              },
              {
                title: "Generator Health",
                desc: "Monitor fuel levels and generator efficiency during grid outages to stay informed.",
                icon: ZapOff,
                color: "bg-emerald-600"
              },
              {
                title: "Study Hub",
                desc: "Find which campus zones currently have power for late-night study sessions.",
                icon: BookOpen,
                color: "bg-rose-600"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-gray-200`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-xl">
                  <Image 
                    src="https://images.unsplash.com/photo-1592288333363-ad2f42954c41?auto=format&fit=crop&q=80&w=600" 
                    alt="Lead City University Main Gate" 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-xl mt-12">
                  <Image 
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600" 
                    alt="LCU Graduation Students" 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="absolute -top-10 -left-10 bg-indigo-600 text-white p-8 rounded-full font-black text-2xl shadow-2xl animate-pulse">
                LCU
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-indigo-600 font-black uppercase tracking-[0.2em] text-sm mb-4">Step by Step</h2>
              <p className="text-4xl font-black text-gray-900 mb-12 tracking-tight">How to stay powered up</p>
              
              <div className="space-y-12">
                {[
                  { step: "01", title: "Join the Community", desc: "Create your account using your LCU matric number for verified access." },
                  { step: "02", title: "Select Your Zones", desc: "Choose your hostel and primary lecture areas to receive targeted updates." },
                  { step: "03", title: "Get Live Alerts", desc: "Receive instant notifications when power sources change or outages occur." },
                  { step: "04", title: "Plan Ahead", desc: "Use our AI forecasts to know exactly when to charge your devices." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-8 group">
                    <span className="text-5xl font-black text-indigo-100 group-hover:text-indigo-200 transition-colors leading-none">{item.step}</span>
                    <div>
                      <h4 className="text-xl font-black text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-indigo-600 font-black uppercase tracking-[0.2em] text-sm mb-4">Questions</h2>
            <p className="text-4xl font-black text-gray-900 tracking-tight">Frequently Asked</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-black text-gray-900">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-gray-600 font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[40rem] h-[40rem] bg-white/10 rounded-full blur-[100px]"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 leading-tight">
                Ready to never be in the dark again?
              </h2>
              <p className="text-indigo-100 text-lg sm:text-xl font-bold mb-12 opacity-90">
                Join thousands of LCU students already using the platform. Secure, fast, and 100% official.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/signup" className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all shadow-xl shadow-black/10">
                  Join Now Free
                </Link>
                <Link href="/login" className="bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-800 transition-all border border-indigo-500/30">
                  Student Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">LCU POWER</span>
              </div>
              <p className="text-gray-500 font-bold max-w-sm mb-8">
                Empowering Lead City University students with intelligent power data and real-time campus-wide monitoring.
              </p>
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer">
                  <Users className="h-5 w-5" />
                </div>
                <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-8">Platform</h4>
              <ul className="space-y-4">
                <li><Link href="#features" className="text-gray-500 font-bold hover:text-indigo-600 transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="text-gray-500 font-bold hover:text-indigo-600 transition-colors">How it Works</Link></li>
                <li><Link href="/login" className="text-gray-500 font-bold hover:text-indigo-600 transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-8">Support</h4>
              <ul className="space-y-4">
                <li><Link href="#faq" className="text-gray-500 font-bold hover:text-indigo-600 transition-colors">FAQ</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-500 font-bold hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center pt-12 border-t border-gray-50">
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
              © 2026 Lead City University • Designed for Excellence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
