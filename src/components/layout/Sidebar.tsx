"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (v: boolean) => void }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: 'dashboard' },
    { name: 'Subscriptions', href: '/subscriptions', icon: 'subscriptions' },
    { name: 'Add Service', href: '/add', icon: 'add_circle' },
    { name: 'Analytics', href: '/analytics', icon: 'analytics' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={clsx(
          "h-screen w-64 fixed left-0 top-0 border-r-0 bg-slate-50 dark:bg-slate-900 flex flex-col p-4 gap-2 z-50 transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 px-2 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#002B5C] dark:text-blue-100 font-headline">The Editorial</h1>
            <p className="font-label text-xs text-slate-500">Financial Curator</p>
          </div>
          <button className="lg:hidden text-slate-500" onClick={() => setMobileOpen(false)}>
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
                  "flex items-center gap-3 px-4 py-3 font-medium rounded-lg transition-all active:scale-95 group relative overflow-hidden",
                  isActive 
                    ? "text-[#002B5C] dark:text-blue-200 font-bold bg-white dark:bg-slate-800 shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
                )}
              >
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 rounded-lg" />
                )}
                <span className={clsx("material-symbols-outlined relative z-10", isActive && "active-icon")} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
                <span className="font-label relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-4 bg-primary-container/10 border border-primary-container/5 rounded-xl mb-4 hidden lg:block">
            <p className="text-xs font-bold text-primary-container uppercase tracking-wider mb-2 font-label">Current Tier</p>
            <p className="text-sm font-bold text-on-surface dark:text-white font-headline mb-4">Pro Plan</p>
            <button className="w-full py-2.5 px-4 primary-gradient text-white rounded-full text-xs font-bold transition-transform active:scale-95 shadow-md">
              Upgrade Plan
            </button>
          </div>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-slate-500 dark:text-slate-400 font-medium hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors rounded-lg">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label text-sm">Settings</span>
          </Link>
          <Link href="/login" className="flex items-center gap-3 px-4 py-2 text-slate-500 dark:text-slate-400 font-medium hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors rounded-lg">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label text-sm">Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
