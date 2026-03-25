"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSettings } from '@/lib/settings-context';
import { getSubscriptions, type Subscription } from '@/lib/api';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Dashboard() {
  const { formatAmount, currencySymbol } = useSettings();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubscriptions()
      .then(setSubs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Compute totals from real data, fallback to demo data
  const activeSubs = subs.filter(s => s.status === 'Active');
  const totalMonthly = activeSubs.reduce((sum, s) => {
    const amt = Number(s.amount);
    if (s.billing_cycle === 'Annual') return sum + amt / 12;
    if (s.billing_cycle === 'Quarterly') return sum + amt / 3;
    return sum + amt;
  }, 0);
  const dailyVelocity = totalMonthly / 30;

  // Demo data for display when no subs from DB
  const hasSubs = subs.length > 0;
  const displayTotal = hasSubs ? totalMonthly : 1248.50;
  const displayDaily = hasSubs ? dailyVelocity : 41.61;

  const topSubs = hasSubs 
    ? activeSubs.slice(0, 4).map(s => ({
        name: s.name,
        sub: `${s.category || 'General'} • ${s.billing_cycle}`,
        price: formatAmount(Number(s.amount)),
        icon: 'subscriptions',
        status: s.status === 'Active' ? 'ACTIVE' : 'PAUSED',
        color: s.status === 'Active' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-secondary-fixed text-on-secondary-fixed',
      }))
    : [
        { name: 'Google One', sub: '2TB Storage • Monthly', price: formatAmount(9.99), icon: 'cloud', status: 'ACTIVE', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
        { name: 'GitHub Pro', sub: 'Advanced Security • Annual', price: formatAmount(4.00), icon: 'terminal', status: 'ACTIVE', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
        { name: 'Netflix Premium', sub: '4K + HDR • Monthly', price: formatAmount(22.99), icon: 'movie', status: 'DUE SOON', color: 'bg-secondary-fixed text-on-secondary-fixed' },
        { name: 'Spotify Family', sub: '6 Accounts • Monthly', price: formatAmount(16.99), icon: 'music_note', status: 'ACTIVE', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
      ];

  const upcomingReminders = hasSubs
    ? activeSubs.map(s => {
        // Fallback to a stable fake day if no next_billing_date exists in the database
        const anyS = s as any;
        const day = anyS.next_billing_date ? new Date(anyS.next_billing_date).getDate().toString() : ((s.name.charCodeAt(0) % 28) + 1).toString().padStart(2, '0');
        return {
          day,
          name: s.name,
          note: `${s.billing_cycle} renewal`,
          amount: formatAmount(Number(s.amount))
        };
      }).sort((a, b) => Number(a.day) - Number(b.day)).slice(0, 3)
    : [
        { day: '12', name: 'Creative Cloud', note: 'Auto-renewing tomorrow', amount: formatAmount(54.99) },
        { day: '15', name: 'AWS Services', note: 'Usage-based estimate', amount: formatAmount(210.00) },
        { day: '18', name: 'Hulu + Live TV', note: 'Legacy Plan', amount: formatAmount(74.99) },
      ];

  return (
    <DashboardLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="p-4 lg:p-10 pb-20 lg:pb-10 space-y-8 lg:space-y-10">
        <motion.section variants={fadeUp} className="flex flex-col gap-1">
          <h2 className="font-headline text-3xl lg:text-4xl font-extrabold text-primary dark:text-white tracking-tight">The Monthly Edition</h2>
          <p className="font-body text-sm lg:text-base text-on-surface-variant dark:text-slate-400">Your financial footprint, curated for this month.</p>
        </motion.section>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Spending Card */}
          <motion.div 
            variants={scaleIn} 
            className="col-span-12 lg:col-span-8 relative overflow-hidden bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-12 flex flex-col justify-between min-h-[400px] lg:min-h-[450px] shadow-2xl border border-white/20 dark:border-slate-700/30 group"
          >
            {/* Background decorative elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 dark:bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-tertiary/10 dark:bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="text-[10px] lg:text-xs font-label text-on-surface-variant dark:text-slate-400 uppercase tracking-[0.2em] font-bold opacity-70">Total Monthly Commitment</span>
                <div className="flex flex-wrap items-baseline gap-3 mt-3">
                  <motion.h3 
                    key={displayTotal}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="font-headline text-6xl lg:text-7xl font-black text-primary dark:text-white tracking-tighter"
                  >
                    {formatAmount(displayTotal)}
                  </motion.h3>
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> 
                    4.2%
                  </span>
                </div>
              </div>
              <motion.div 
                whileHover={{ rotate: -15, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-primary/5 dark:bg-white/5 p-5 lg:p-6 rounded-[2rem] border border-primary/10 dark:border-white/10 shadow-inner"
              >
                <span className="material-symbols-outlined text-primary dark:text-blue-400 text-3xl lg:text-4xl">account_balance_wallet</span>
              </motion.div>
            </div>

            <div className="relative z-10 mt-12 h-40 lg:h-52 w-full bg-slate-900/5 dark:bg-black/20 rounded-[2rem] overflow-hidden border border-black/5 dark:border-white/5 group-hover:border-primary/20 transition-colors">
              <div className="absolute inset-0 spend-pulse-gradient opacity-60"></div>
              <svg className="absolute bottom-0 w-full h-full lg:h-32" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
                    <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                  </linearGradient>
                </defs>
                <motion.path 
                  d="M0,80 Q10,75 20,85 T40,60 T60,70 T80,40 T100,50 L100,100 L0,100 Z" 
                  fill="url(#chartGradient)"
                  initial={{ opacity: 0, d: "M0,100 Q10,100 20,100 T40,100 T60,100 T80,100 T100,100 L100,100 L0,100 Z" }}
                  animate={{ opacity: 1, d: "M0,80 Q10,75 20,85 T40,60 T60,70 T80,40 T100,50 L100,100 L0,100 Z" }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.path 
                  d="M0,80 Q10,75 20,85 T40,60 T60,70 T80,40 T100,50" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
                />
              </svg>
              <div className="absolute top-6 left-8 flex flex-col">
                <span className="text-[10px] lg:text-xs font-bold text-slate-500 dark:text-emerald-400 uppercase tracking-widest">Daily Velocity</span>
                <span className="text-xl lg:text-2xl font-headline font-black text-primary dark:text-white mt-1">{formatAmount(displayDaily)} / day</span>
              </div>
              <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <button className="bg-white/80 dark:bg-slate-800/80 px-4 py-1.5 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-md border border-white/20">VIEW INSIGHTS</button>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Reminders */}
          <motion.div variants={fadeUp} className="col-span-12 lg:col-span-4 bg-primary dark:bg-blue-600 rounded-[2.5rem] p-8 text-white flex flex-col shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h4 className="font-headline text-2xl font-black">Upcoming</h4>
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <span className="material-symbols-outlined text-white">event</span>
              </div>
            </div>
            <div className="space-y-6 flex-1 relative z-10">
              {upcomingReminders.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-4 items-center group/item"
                >
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/15 backdrop-blur-md flex flex-col items-center justify-center border border-white/10 group-hover/item:bg-white/25 transition-colors">
                    <span className="text-[10px] font-black opacity-60 leading-none mb-1">MAR</span>
                    <span className="font-headline font-black text-base leading-none">{item.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-bold text-sm truncate group-hover/item:translate-x-1 transition-transform">{item.name}</p>
                    <p className="text-[10px] text-white/60 truncate uppercase tracking-widest mt-0.5">{item.note}</p>
                  </div>
                  <span className="font-headline font-black text-sm tabular-nums">{item.amount}</span>
                </motion.div>
              ))}
            </div>
            <Link href="/calendar" className="mt-10 w-full block text-center bg-white/15 hover:bg-white/25 py-4 rounded-[1.5rem] text-xs font-black tracking-widest uppercase transition-all active:scale-[0.98] border border-white/10 backdrop-blur-sm">
              View Calendar
            </Link>
          </motion.div>

          {/* Sector Distribution */}
          <motion.div variants={fadeUp} className="col-span-12 lg:col-span-5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-white/20 dark:border-slate-700/30">
            <h4 className="font-headline text-xl font-black text-primary dark:text-white mb-8 flex items-center gap-3">
              <span className="w-2 h-6 bg-tertiary rounded-full"></span>
              Sector Distribution
            </h4>
            <div className="space-y-6">
              {(hasSubs ? 
                Object.entries(
                  activeSubs.reduce((acc, s) => {
                    const cat = s.category || 'General';
                    const amt = Number(s.amount);
                    let monthlyAmt = amt;
                    if (s.billing_cycle === 'Annual') monthlyAmt = amt / 12;
                    if (s.billing_cycle === 'Quarterly') monthlyAmt = amt / 3;
                    acc[cat] = (acc[cat] || 0) + monthlyAmt;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([name, amount], index) => {
                  const colors = ['bg-blue-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500'];
                  return { 
                    name, 
                    amount, 
                    pct: totalMonthly > 0 ? (amount / totalMonthly) * 100 : 0, 
                    color: colors[index % colors.length] 
                  };
                })
                : [
                  { name: 'Software & SaaS', amount: 642.00, pct: 65, color: 'bg-blue-500' },
                  { name: 'Entertainment', amount: 184.20, pct: 25, color: 'bg-rose-500' },
                  { name: 'Core Utilities', amount: 422.30, pct: 40, color: 'bg-emerald-500' },
                ]
              ).map((cat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3"
                >
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3 group">
                      <div className={`w-3 h-3 rounded-full ${cat.color} shadow-lg shadow-${cat.color.split('-')[1]}-500/20 group-hover:scale-125 transition-transform`}></div>
                      <span className="font-headline font-bold text-sm text-slate-700 dark:text-slate-300">{cat.name}</span>
                    </div>
                    <span className="font-body font-black text-sm text-primary dark:text-white">{formatAmount(cat.amount)}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden p-[1px]">
                    <motion.div 
                      className={`h-full ${cat.color} rounded-full relative`}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.pct}%` }}
                      transition={{ duration: 1, delay: 0.7 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Subscriptions */}
          <motion.div variants={fadeUp} className="col-span-12 lg:col-span-7 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-white/20 dark:border-slate-700/30">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-headline text-xl font-black text-primary dark:text-white">Active Subscriptions</h4>
              <Link href="/subscriptions" className="text-primary dark:text-blue-400 font-black text-xs hover:underline tracking-widest uppercase">Manage All</Link>
            </div>
            <div className="space-y-4">
              {topSubs.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-between p-4 bg-white/40 dark:bg-slate-700/30 hover:bg-white dark:hover:bg-slate-700/60 rounded-2xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-slate-100 dark:hover:border-slate-600 hover:shadow-lg active:scale-[0.99]"
                >
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary/5 dark:bg-blue-500/10 flex items-center justify-center text-primary dark:text-blue-400 border border-primary/10 dark:border-blue-500/20 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                    </div>
                    <div>
                      <h5 className="font-headline font-black text-base text-primary dark:text-white tracking-tight">{item.name}</h5>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-70">{item.sub}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="font-body font-black text-lg text-primary dark:text-white">{item.price}</p>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-[0.1em] ${item.color.replace('fixed', 'container')} shadow-sm`}>
                      {item.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Mobile FAB */}
      <motion.a
        href="/add"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 h-14 w-14 rounded-full primary-gradient text-on-primary shadow-2xl flex items-center justify-center z-50"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </motion.a>
    </DashboardLayout>
  );
}
