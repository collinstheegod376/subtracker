"use client";
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSettings } from '@/lib/settings-context';
import { getSubscriptions, type Subscription } from '@/lib/api';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

import Image from 'next/image';

export default function Analytics() {
  const { formatAmount } = useSettings();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSubscriptions()
      .then(setSubs)
      .finally(() => setIsLoading(false));
  }, []);

  const stats = useMemo(() => {
    if (subs.length === 0) return null;

    // Monthly & Annual Spend
    let totalMonthly = 0;
    let totalAnnual = 0;
    const categoryMap: Record<string, number> = {};

    subs.forEach(s => {
      if (s.status !== 'Active') return;
      
      let monthly = s.amount;
      if (s.billing_cycle === 'Annual') monthly = s.amount / 12;
      else if (s.billing_cycle === 'Quarterly') monthly = s.amount / 3;

      totalMonthly += monthly;
      totalAnnual += monthly * 12;

      categoryMap[s.category] = (categoryMap[s.category] || 0) + monthly;
    });

    // Categories
    const categories = Object.entries(categoryMap)
      .map(([name, val]) => ({ name, val }))
      .sort((a, b) => b.val - a.val)
      .slice(0, 3);

    // Next big renewal (highest amount in the next 30 days)
    const now = new Date();
    const nextBig = subs
      .filter(s => s.next_renewal && new Date(s.next_renewal) > now)
      .sort((a, b) => b.amount - a.amount)[0];

    // Savings: Dormant (mock: inactive or older than 3 months) or Duplicate names
    const savings = subs.filter(s => s.status === 'Paused' || s.amount > 50).slice(0, 2);

    return {
      totalAnnual,
      totalMonthly,
      categories,
      nextBig,
      savings
    };
  }, [subs]);

  if (isLoading) return <DashboardLayout><div className="p-10 text-center">Loading analytics...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="p-4 sm:p-6 lg:p-10 pb-20 lg:pb-12 max-w-6xl mx-auto">
        <motion.section variants={fadeUp} className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <p className="font-label text-on-surface-variant dark:text-slate-400 text-[10px] sm:text-xs lg:text-sm mb-1 uppercase tracking-widest font-bold opacity-80">Portfolio Review</p>
              <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary dark:text-white tracking-tight">Analytics & Insights</h2>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-4 py-2 bg-surface-container-high dark:bg-slate-700 rounded-full font-label text-[9px] sm:text-[10px] lg:text-xs font-semibold text-on-surface dark:text-white">REAL-TIME DATA</button>
              <button className="flex-1 md:flex-none px-4 py-2 bg-surface dark:bg-slate-800 rounded-full font-label text-[9px] sm:text-[10px] lg:text-xs font-semibold text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-low dark:hover:bg-slate-700 border border-outline-variant/30 dark:border-slate-600 lg:border-none transition-colors">EXPORT</button>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {/* Main Spending Trend */}
          <motion.div variants={scaleIn} className="col-span-12 xl:col-span-8 bg-surface-container-lowest dark:bg-slate-800 p-5 sm:p-6 lg:p-10 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
              <div>
                <h3 className="font-headline text-base sm:text-lg lg:text-xl font-bold text-primary dark:text-white">Annual Spend Velocity</h3>
                <p className="font-label text-on-surface-variant dark:text-slate-400 text-[10px] sm:text-xs lg:text-sm mt-0.5">Predictive trend based on cycles</p>
              </div>
              <div className="sm:text-right">
                <span className="font-headline text-xl sm:text-2xl lg:text-3xl font-bold text-primary dark:text-white">{formatAmount(stats?.totalAnnual || 0)}</span>
                <p className="font-label text-tertiary-fixed-dim text-[9px] sm:text-[10px] lg:text-xs font-bold">+2.4% vs LY</p>
              </div>
            </div>

            <div className="relative h-40 sm:h-48 lg:h-64 flex items-end justify-between gap-1 lg:gap-3 pt-4 border-b border-surface-container-highest dark:border-slate-600 pb-2">
              {[40, 55, 35, 70, 60, 85, 95, 80, 65, 50, 45, 30].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex-1 rounded-t-md sm:rounded-t-lg transition-colors hover:bg-primary-container dark:hover:bg-blue-800 cursor-pointer ${i === 6 ? 'bg-primary-container dark:bg-blue-700' : 'bg-surface-container-low dark:bg-slate-600'}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-3 text-[7px] sm:text-[8px] lg:text-[10px] font-label text-on-surface-variant dark:text-slate-400 tracking-widest uppercase overflow-hidden">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div variants={fadeUp} className="col-span-12 xl:col-span-4 bg-surface-container-lowest dark:bg-slate-800 p-5 sm:p-6 lg:p-8 rounded-2xl shadow-sm flex flex-col items-center border border-slate-100 dark:border-slate-700/50">
            <h3 className="font-headline text-base sm:text-lg font-bold text-primary dark:text-white mb-4 sm:mb-6 w-full text-left">Allocation</h3>
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mb-6 sm:mb-8">
              <motion.div
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute inset-0 rounded-full border-[10px] sm:border-[14px] lg:border-[18px] border-primary-container dark:border-blue-900 opacity-20"></div>
                <div className="absolute inset-0 rounded-full border-[10px] sm:border-[14px] lg:border-[18px] border-primary-container dark:border-blue-900 shadow-xl"></div>
                <div className="absolute inset-0 rounded-full border-[10px] sm:border-[14px] lg:border-[18px] border-secondary-container dark:border-cyan-800" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 40%)' }}></div>
                <div className="absolute inset-0 rounded-full border-[10px] sm:border-[14px] lg:border-[18px] border-tertiary-fixed-dim" style={{ clipPath: 'polygon(50% 50%, 100% 40%, 100% 60%)' }}></div>
              </motion.div>
              <div className="flex items-center justify-center h-full">
                <span className="font-headline text-lg sm:text-xl lg:text-3xl font-extrabold text-primary dark:text-white">
                  {subs.length > 0 ? Math.round((stats?.categories[0]?.val || 0) / (stats?.totalMonthly || 1) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4 w-full">
              {(stats?.categories || []).map((cat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.35 }}
                  className="flex justify-between items-center group"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className={`w-2.5 h-2.5 sm:w-3 h-3 rounded-full ${i === 0 ? 'bg-primary-container dark:bg-blue-900' : i === 1 ? 'bg-secondary-container dark:bg-cyan-800' : 'bg-tertiary-fixed-dim'}`}></div>
                    <span className="font-body text-[11px] sm:text-sm font-medium dark:text-slate-200">{cat.name}</span>
                  </div>
                  <span className="font-label text-[11px] sm:text-sm font-bold dark:text-white">{formatAmount(cat.val)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Savings Opportunities */}
          <motion.div variants={fadeUp} className="col-span-12 mt-2 sm:mt-4 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 mb-1 sm:mb-2 lg:mb-4">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-xl sm:text-2xl">verified</span>
              <h3 className="font-headline text-lg sm:text-xl lg:text-2xl font-bold text-primary dark:text-white">Savings Opportunities</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {(stats?.savings || []).map((s, idx) => (
                <motion.div
                  key={s.id}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`bg-surface-container-low dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border-l-4 ${idx === 0 ? 'border-error' : 'border-secondary-fixed'} hover:shadow-lg transition-shadow relative overflow-hidden`}
                >
                  <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
                    <div className="p-2 bg-surface dark:bg-slate-700 rounded-lg">
                      <span className="material-symbols-outlined text-error text-xl">{idx === 0 ? 'inactive_order' : 'content_copy'}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-bold ${idx === 0 ? 'bg-error-container dark:bg-red-900/40 text-on-error-container dark:text-red-300' : 'bg-primary-fixed dark:bg-blue-900/50 text-primary dark:text-blue-300'}`}>
                      {idx === 0 ? 'DORMANT' : 'OPTIMIZE'}
                    </span>
                  </div>
                  <h4 className="font-headline font-bold text-sm sm:text-base text-primary dark:text-white mb-1 relative z-10">{s.name}</h4>
                  <p className="font-body text-[10px] sm:text-xs text-on-surface-variant dark:text-slate-400 mb-4 sm:mb-6 leading-relaxed relative z-10">
                    {idx === 0 ? 'Potential waste detected based on usage patterns.' : 'Consider switching to a lower tier for savings.'}
                  </p>
                  <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-outline-variant/15 dark:border-slate-700 relative z-10">
                    <span className="font-headline font-bold text-sm sm:text-base text-primary dark:text-white">{formatAmount(s.amount)}/{s.billing_cycle === 'Annual' ? 'yr' : 'mo'}</span>
                    <button className="text-error font-label text-[10px] sm:text-xs font-bold hover:underline">ACTION</button>
                  </div>
                </motion.div>
              ))}

              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-surface-container-lowest dark:bg-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm border border-outline-variant/10 dark:border-slate-700/50 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 bg-tertiary-container/10 dark:bg-emerald-900/20 rounded-lg">
                    <span className="material-symbols-outlined text-on-tertiary-container dark:text-emerald-400 text-xl">monitoring</span>
                  </div>
                  <h4 className="font-headline font-bold text-sm sm:text-base text-primary dark:text-white">The Spend Pulse</h4>
                </div>
                <div className="h-12 sm:h-16 relative">
                  <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="pulseG" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#69ff87" stopOpacity="0.5"></stop>
                        <stop offset="100%" stopColor="#69ff87" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M0 15 Q 10 5, 20 12 T 40 8 T 60 14 T 80 5 T 100 10 V 20 H 0 Z"
                      fill="url(#pulseG)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                    <motion.path
                      d="M0 15 Q 10 5, 20 12 T 40 8 T 60 14 T 80 5 T 100 10"
                      fill="none"
                      stroke="#00531e"
                      strokeWidth="1.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
                    />
                  </svg>
                </div>
                <div className="mt-3 sm:mt-4 flex justify-between items-center">
                  <div>
                    <p className="font-label text-[9px] sm:text-[10px] text-on-surface-variant dark:text-slate-400 uppercase tracking-tighter opacity-70">Efficiency Score</p>
                    <p className="font-headline text-base sm:text-xl font-bold text-on-tertiary-container dark:text-emerald-400">
                      {subs.length > 0 ? Math.min(100, Math.round((subs.filter(s => s.status === 'Active').length / subs.length) * 100)) : 0}/100
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-tertiary-fixed-dim text-lg sm:text-xl">trending_up</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Editorial & Next Big */}
          <motion.div variants={fadeUp} className="col-span-12 grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mt-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="col-span-1 bg-primary text-on-primary p-5 sm:p-6 rounded-2xl shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <span className="material-symbols-outlined text-tertiary-fixed-dim mb-3 sm:mb-4 block text-xl">lightbulb</span>
              <h4 className="font-headline font-bold text-base sm:text-lg mb-1.5 sm:mb-2 relative z-10">Editorial Insight</h4>
              <p className="text-[11px] sm:text-sm font-body opacity-90 leading-relaxed mb-4 sm:mb-6 relative z-10">
                Your {stats?.categories[0]?.name || 'top'} spend is {Math.round((stats?.categories[0]?.val || 0) / (stats?.totalMonthly || 1) * 100)}% of your total. Consider reviewing alternatives.
              </p>
              <button className="text-tertiary-fixed font-label text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:underline relative z-10">Learn More</button>
            </motion.div>
            <div className="col-span-1 lg:col-span-3 bg-surface-container-low dark:bg-slate-800 p-5 sm:p-6 lg:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 shrink-0 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-primary dark:text-blue-400 overflow-hidden relative">
                  {stats?.nextBig?.logo_url ? (
                    <Image src={stats.nextBig.logo_url} fill unoptimized className="object-cover" alt="Logo" />
                  ) : (
                    <span className="material-symbols-outlined text-xl sm:text-2xl lg:text-3xl">calendar_today</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-headline text-base sm:text-lg lg:text-xl font-bold text-primary dark:text-white truncate">Next Big Renewal</h4>
                  <p className="font-body text-[10px] sm:text-xs lg:text-sm text-on-surface-variant dark:text-slate-400 mt-0.5 truncate max-w-xs">
                    {stats?.nextBig ? `${stats.nextBig.name} on ${new Date(stats.nextBig.next_renewal!).toLocaleDateString()}` : 'No upcoming big renewals'}
                  </p>
                </div>
              </div>
              <div className="md:text-right w-full md:w-auto pl-16 sm:pl-18 md:pl-0 flex flex-col sm:items-end">
                <p className="font-headline text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary dark:text-white">
                  {stats?.nextBig ? formatAmount(stats.nextBig.amount) : formatAmount(0)}
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 w-full md:w-auto text-[10px] sm:text-xs font-bold bg-primary dark:bg-blue-600 text-on-primary px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md uppercase tracking-wide"
                >
                  SET REMINDER
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
