"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

import Image from 'next/image';

export default function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (v: boolean) => void }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: 'dashboard' },
    { name: 'Subscriptions', href: '/subscriptions', icon: 'subscriptions' },
    { name: 'Add Service', href: '/add', icon: 'add_circle' },
    { name: 'Analytics', href: '/analytics', icon: 'analytics' },
    { name: 'Donation', href: '/donation', icon: 'volunteer_activism' },
  ];

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" 
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside 
        className={clsx(
          "h-screen w-64 fixed left-0 top-0 bg-slate-50 dark:bg-slate-900 flex flex-col p-4 gap-2 z-50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-x-0 border-r border-slate-100 dark:border-slate-800",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 px-2 flex justify-between items-center">
          <Image src="/logo.png" alt="SUB TRACK" width={150} height={48} className="h-10 lg:h-12 w-auto object-contain drop-shadow-sm rounded-lg" />
          <button className="lg:hidden text-slate-400 hover:text-slate-600 transition-colors p-1" onClick={() => setMobileOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                href={item.href} 
                key={item.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-all duration-200 active:scale-[0.97] relative overflow-hidden",
                  isActive 
                    ? "text-[#002B5C] dark:text-blue-200 font-bold bg-white dark:bg-slate-800 shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/50"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-bg" 
                    className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm -z-10" 
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} 
                  />
                )}
                <span 
                  className="material-symbols-outlined text-xl" 
                  style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 500" } : {}}
                >
                  {item.icon}
                </span>
                <span className="font-label text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl mb-4 hidden lg:block">
            <p className="text-[10px] font-bold text-primary dark:text-blue-400 uppercase tracking-wider mb-2 font-label">Current Tier</p>
            <p className="text-sm font-bold text-on-surface dark:text-white font-headline mb-4">Pro Plan</p>
            <button className="w-full py-2.5 px-4 primary-gradient text-white rounded-full text-xs font-bold transition-all active:scale-[0.97] shadow-md hover:shadow-lg">
              Upgrade Plan
            </button>
          </div>
          <Link href="/settings" onClick={() => setMobileOpen(false)} className={clsx("flex items-center gap-3 px-4 py-2.5 font-medium rounded-xl transition-all duration-200", pathname === '/settings' ? "text-[#002B5C] dark:text-blue-200 font-bold bg-white dark:bg-slate-800 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50")}>
            <span className="material-symbols-outlined text-xl" style={pathname === '/settings' ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
            <span className="font-label text-sm">Settings</span>
          </Link>
          <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-slate-500 dark:text-slate-400 font-medium hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all rounded-xl">
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="font-label text-sm">Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
