'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Zap, 
  History, 
  Settings, 
  User, 
  Bell, 
  LogOut,
  Shield,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Analytics', icon: BarChart3, href: '/analytics' },
    { name: 'History', icon: History, href: '/history' },
    { name: 'Notifications', icon: Bell, href: '/notifications', count: 3 },
  ];

  const bottomItems = [
    { name: 'Profile', icon: User, href: '/profile' },
    { name: 'Settings', icon: Settings, href: '/settings' },
    { name: 'Help', icon: HelpCircle, href: '/help' },
  ];

  if (user?.role === 'super_admin' || user?.role === 'power_admin') {
    menuItems.push({ name: 'Admin Portal', icon: Shield, href: '/admin' });
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-100 flex flex-col z-50">
      {/* Brand */}
      <div className="p-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">LCU POWER</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
              pathname === item.href 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-4">
              <item.icon className={`h-5 w-5 ${pathname === item.href ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-900'}`} />
              <span className="font-bold text-sm">{item.name}</span>
            </div>
            {item.count && (
              <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 mt-auto border-t border-gray-50 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group"
          >
            <item.icon className="h-5 w-5 text-gray-400 group-hover:text-gray-900" />
            <span className="font-bold text-sm">{item.name}</span>
          </Link>
        ))}
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-bold text-sm">Sign Out</span>
        </button>
      </div>

      {/* User Mini Profile */}
      <div className="p-6 bg-gray-50/50 m-4 rounded-[2rem] border border-gray-100/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-black text-xs border-2 border-white shadow-sm">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight truncate">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
