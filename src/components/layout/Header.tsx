"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNotifications, markAllNotificationsRead, subscribeToNotifications, type Notification } from '@/lib/api';
import { getSubscriptions, type Subscription } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useSettings } from '@/lib/settings-context';
import Link from 'next/link';
import Image from 'next/image';

export default function Header({ toggleMobile }: { toggleMobile: () => void }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { formatAmount } = useSettings();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [allSubs, setAllSubs] = useState<Subscription[]>([]);
  const [searchResults, setSearchResults] = useState<Subscription[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getNotifications()
      .then(n => {
        setNotifs(n);
        setUnreadCount(n.filter(x => !x.is_read).length);
      })
      .catch(() => {});
    getSubscriptions().then(setAllSubs).catch(() => {});
  }, []);

  // Realtime: listen for new notifications
  useEffect(() => {
    if (!user?.id) return;
    const sub = subscribeToNotifications(user.id, (newNotif) => {
      setNotifs(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
    return () => sub.unsubscribe();
  }, [user?.id]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowNotifs(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Live search logic
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = allSubs.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q) ||
      s.status.toLowerCase().includes(q) ||
      s.billing_cycle.toLowerCase().includes(q)
    );
    setSearchResults(results);
    setShowSearch(true);
  }, [searchQuery, allSubs]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const statusColor = (status: string) => {
    if (status === 'Active') return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';
    if (status === 'Paused') return 'bg-amber-500/15 text-amber-600 dark:text-amber-400';
    return 'bg-rose-500/15 text-rose-600 dark:text-rose-400';
  };

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] h-16 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex justify-between items-center px-4 lg:px-8 shadow-sm dark:shadow-none border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden text-outline dark:text-slate-400 hover:text-primary transition-colors" onClick={toggleMobile}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="relative w-full max-w-md hidden md:block" ref={searchRef}>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-500 text-xl">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface dark:text-slate-200 placeholder:text-slate-400" 
            placeholder="Search subscriptions..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <AnimatePresence>
            {showSearch && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 top-12 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50"
              >
                <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</span>
                  <Link href="/subscriptions" onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="text-[10px] font-black text-primary dark:text-blue-400 uppercase tracking-widest hover:underline">View All</Link>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {searchResults.slice(0, 6).map((sub) => (
                    <Link
                      key={sub.id}
                      href="/subscriptions"
                      onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                      className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors border-b border-slate-50 dark:border-slate-700/30 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/5 dark:bg-blue-500/10 flex items-center justify-center text-primary dark:text-blue-400 border border-primary/10 dark:border-blue-500/20 shrink-0">
                          <span className="material-symbols-outlined text-base">subscriptions</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary dark:text-white">{sub.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{sub.category || 'General'} · {sub.billing_cycle}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-sm font-bold text-primary dark:text-white">{formatAmount(Number(sub.amount))}</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${statusColor(sub.status)}`}>{sub.status}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
            {showSearch && searchQuery.trim().length > 0 && searchResults.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute left-0 top-12 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 p-6 text-center"
              >
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-3xl mb-2 block">search_off</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No subscriptions found for &ldquo;{searchQuery}&rdquo;</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        {/* Notifications */}
        <div className="relative" ref={ref}>
          <button 
            className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors active:scale-90 relative"
            onClick={() => setShowNotifs(!showNotifs)}
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="absolute -top-1 -right-1 bg-error text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div 
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <h4 className="font-headline font-bold text-primary dark:text-white text-sm">Notifications</h4>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} className="text-surface-tint dark:text-blue-400 text-[10px] font-bold hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifs.length === 0 ? (
                    <div className="p-8 text-center">
                      <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-3xl mb-2 block">notifications_off</span>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400">No notifications yet</p>
                    </div>
                  ) : (
                    notifs.map((n, i) => (
                      <motion.div 
                        key={n.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                        className={`p-4 border-b border-slate-50 dark:border-slate-700/50 last:border-0 transition-colors ${!n.is_read ? 'bg-primary-fixed/30 dark:bg-slate-700/30' : 'hover:bg-slate-50 dark:hover:bg-slate-700/20'}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-sm mt-0.5 text-surface-tint dark:text-blue-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {n.type === 'renewal' ? 'event' : n.type === 'price_change' ? 'trending_up' : n.type === 'dormant' ? 'warning' : 'info'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-primary dark:text-white">{n.title}</p>
                            <p className="text-[10px] text-on-surface-variant dark:text-slate-400 mt-0.5">{n.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors active:scale-90 hidden sm:block">
          <span className="material-symbols-outlined">help</span>
        </button>
        
        <div className="flex items-center gap-3">
          <a href="/add" className="px-4 py-2 lg:px-5 primary-gradient text-white text-sm font-semibold rounded-full active:scale-[0.95] transition-all shadow-sm hover:shadow-md">
            <span className="hidden sm:inline">Add New</span>
            <span className="material-symbols-outlined sm:hidden text-lg" style={{ verticalAlign: '-3px' }}>add</span>
          </a>
          <a href="/settings" className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-surface-container-highest dark:bg-slate-700 overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm shrink-0 flex items-center justify-center hover:ring-2 hover:ring-primary/20 transition-all active:scale-95">
            {user?.user_metadata?.avatar_url ? (
              <Image src={user.user_metadata.avatar_url} alt="Profile" width={40} height={40} unoptimized className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase">
                {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
              </div>
            )}
          </a>
        </div>
      </div>
    </header>
  );
}
