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
          <motion.div variants={scaleIn} className="col-span-12 lg:col-span-8 bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 lg:p-10 flex flex-col justify-between min-h-[350px] lg:min-h-[400px] shadow-sm border border-slate-100 dark:border-slate-700/50">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] lg:text-xs font-label text-on-surface-variant dark:text-slate-400 uppercase tracking-widest font-semibold">Total Commitment</span>
                <div className="flex flex-wrap items-baseline gap-2 mt-2">
                  <motion.h3 
                    key={displayTotal}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="font-headline text-5xl lg:text-6xl font-bold text-primary dark:text-white tracking-tighter"
                  >
                    {formatAmount(displayTotal)}
                  </motion.h3>
                  <span className="text-tertiary-fixed-dim lg:text-sm text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span> 
                    4.2%
                  </span>
                </div>
              </div>
              <motion.div 
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="bg-surface-container-low dark:bg-slate-700 p-3 lg:p-4 rounded-xl"
              >
                <span className="material-symbols-outlined text-primary dark:text-blue-400 text-2xl lg:text-3xl">account_balance_wallet</span>
              </motion.div>
            </div>

            <div className="mt-8 relative h-32 lg:h-40 w-full bg-surface-container-low dark:bg-slate-700/50 rounded-xl overflow-hidden">
              <div className="absolute inset-0 spend-pulse-gradient"></div>
              <svg className="absolute bottom-0 w-full h-full lg:h-24" preserveAspectRatio="none" viewBox="0 0 100 100">
                <motion.path 
                  d="M0,80 Q10,75 20,85 T40,60 T60,70 T80,40 T100,50 L100,100 L0,100 Z" 
                  fill="rgba(105, 255, 135, 0.2)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
                <motion.path 
                  d="M0,80 Q10,75 20,85 T40,60 T60,70 T80,40 T100,50" 
                  fill="none" 
                  stroke="#00aa45" 
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                />
              </svg>
              <div className="absolute top-4 left-4 lg:left-6 flex flex-col">
                <span className="text-[10px] lg:text-xs font-bold text-on-tertiary-container dark:text-emerald-400">DAILY VELOCITY</span>
                <span className="text-base lg:text-lg font-headline font-bold text-primary dark:text-white">{formatAmount(displayDaily)} / day</span>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Reminders */}
          <motion.div variants={fadeUp} className="col-span-12 lg:col-span-4 bg-primary rounded-2xl p-6 lg:p-8 text-on-primary flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-headline text-lg lg:text-xl font-bold">Upcoming</h4>
              <span className="material-symbols-outlined text-on-primary-container">event</span>
            </div>
            <div className="space-y-6 flex-1">
              {upcomingReminders.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-4 items-center"
                >
                  <div className="h-10 w-10 lg:h-12 lg:w-12 shrink-0 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">{item.day}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-bold text-sm truncate">{item.name}</p>
                    <p className="text-[10px] lg:text-xs text-on-primary-container truncate">{item.note}</p>
                  </div>
                  <span className="font-headline font-bold text-sm">{item.amount}</span>
                </motion.div>
              ))}
            </div>
            <Link href="/calendar" className="mt-8 w-full block text-center bg-white/10 hover:bg-white/20 py-3 rounded-full text-xs lg:text-sm font-bold transition-colors">
              View Calendar
            </Link>
          </motion.div>

          {/* Sector Distribution */}
          <motion.div variants={fadeUp} className="col-span-12 lg:col-span-5 bg-surface-container-low dark:bg-slate-800 rounded-2xl p-6 lg:p-8">
            <h4 className="font-headline text-lg lg:text-xl font-bold text-primary dark:text-white mb-6">Sector Distribution</h4>
            <div className="space-y-4">
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
                  const colors = ['bg-surface-tint', 'bg-error', 'bg-on-tertiary-container', 'bg-secondary', 'bg-tertiary'];
                  return { 
                    name, 
                    amount, 
                    pct: totalMonthly > 0 ? (amount / totalMonthly) * 100 : 0, 
                    color: colors[index % colors.length] 
                  };
                })
                : [
                  { name: 'Software & SaaS', amount: 642.00, pct: 65, color: 'bg-surface-tint' },
                  { name: 'Entertainment', amount: 184.20, pct: 25, color: 'bg-error' },
                  { name: 'Core Utilities', amount: 422.30, pct: 40, color: 'bg-on-tertiary-container' },
                ]
              ).map((cat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-surface-container-lowest dark:bg-slate-700/50 p-4 rounded-xl flex flex-col gap-3 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
                      <span className="font-headline font-bold text-sm text-primary dark:text-white">{cat.name}</span>
                    </div>
                    <span className="font-body font-bold text-sm text-primary dark:text-white">{formatAmount(cat.amount)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-high dark:bg-slate-600 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${cat.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Subscriptions */}
          <motion.div variants={fadeUp} className="col-span-12 lg:col-span-7 bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-headline text-lg lg:text-xl font-bold text-primary dark:text-white">Top Subscriptions</h4>
              <a href="/subscriptions" className="text-surface-tint dark:text-blue-400 font-bold text-sm hover:underline">Manage All</a>
            </div>
            <div className="space-y-3">
              {topSubs.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-between p-3 lg:p-4 bg-surface dark:bg-slate-700/30 hover:bg-surface-container-low dark:hover:bg-slate-700/60 rounded-xl transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 lg:h-12 lg:w-12 shrink-0 rounded-xl bg-surface-container-high dark:bg-slate-600 flex items-center justify-center text-primary dark:text-blue-400">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div>
                      <h5 className="font-headline font-bold text-sm lg:text-base text-primary dark:text-white">{item.name}</h5>
                      <p className="text-[10px] lg:text-xs text-on-surface-variant dark:text-slate-400 font-medium">{item.sub}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="font-body font-bold text-sm lg:text-base text-primary dark:text-white">{item.price}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] lg:text-[10px] font-bold tracking-wider ${item.color}`}>
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
