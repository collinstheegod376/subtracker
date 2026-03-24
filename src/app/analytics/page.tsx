"use client";
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSettings } from '@/lib/settings-context';

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

export default function Analytics() {
  const { formatAmount } = useSettings();

  return (
    <DashboardLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="p-4 lg:p-10 pb-20 lg:pb-12 max-w-6xl mx-auto">
        <motion.section variants={fadeUp} className="mb-8 lg:mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <p className="font-label text-on-surface-variant dark:text-slate-400 text-xs lg:text-sm mb-1 uppercase tracking-widest font-bold">Portfolio Review</p>
              <h2 className="font-headline text-3xl lg:text-4xl font-extrabold text-primary dark:text-white tracking-tight">Analytics & Insights</h2>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-4 py-2 bg-surface-container-high dark:bg-slate-700 rounded-full font-label text-[10px] lg:text-xs font-semibold text-on-surface dark:text-white">LAST 12 MONTHS</button>
              <button className="flex-1 md:flex-none px-4 py-2 bg-surface dark:bg-slate-800 rounded-full font-label text-[10px] lg:text-xs font-semibold text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-low dark:hover:bg-slate-700 border border-outline-variant/30 dark:border-slate-600 lg:border-none transition-colors">EXPORT REPORT</button>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Spending Trend */}
          <motion.div variants={scaleIn} className="col-span-12 xl:col-span-8 bg-surface-container-lowest dark:bg-slate-800 p-6 lg:p-10 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h3 className="font-headline text-lg lg:text-xl font-bold text-primary dark:text-white">Annual Spend Velocity</h3>
                <p className="font-label text-on-surface-variant dark:text-slate-400 text-xs lg:text-sm">Predictive trend based on cycles</p>
              </div>
              <div className="md:text-right">
                <span className="font-headline text-2xl lg:text-3xl font-bold text-primary dark:text-white">{formatAmount(14240.50)}</span>
                <p className="font-label text-tertiary-fixed-dim text-[10px] lg:text-xs font-bold">+2.4% vs LY</p>
              </div>
            </div>

            <div className="relative h-48 lg:h-64 flex items-end justify-between gap-1 lg:gap-3 pt-4 border-b border-surface-container-highest dark:border-slate-600 pb-2">
              {[40, 55, 35, 70, 60, 85, 95, 80, 65, 50, 45, 30].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex-1 rounded-t-lg transition-colors hover:bg-primary-container dark:hover:bg-blue-800 cursor-pointer ${i === 6 ? 'bg-primary-container dark:bg-blue-700' : 'bg-surface-container-low dark:bg-slate-600'}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-3 text-[8px] lg:text-[10px] font-label text-on-surface-variant dark:text-slate-400 tracking-widest uppercase">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </motion.div>

          {/* Category Distribution */}
          <motion.div variants={fadeUp} className="col-span-12 xl:col-span-4 bg-surface-container-lowest dark:bg-slate-800 p-6 lg:p-8 rounded-2xl shadow-sm flex flex-col items-center border border-slate-100 dark:border-slate-700/50">
            <h3 className="font-headline text-lg font-bold text-primary dark:text-white mb-6 w-full text-left">Allocation</h3>
            <div className="relative w-40 h-40 lg:w-48 lg:h-48 mb-8">
              <motion.div
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute inset-0 rounded-full border-[14px] lg:border-[18px] border-primary-container dark:border-blue-900"></div>
                <div className="absolute inset-0 rounded-full border-[14px] lg:border-[18px] border-secondary-container dark:border-cyan-800" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 40%)' }}></div>
                <div className="absolute inset-0 rounded-full border-[14px] lg:border-[18px] border-tertiary-fixed-dim" style={{ clipPath: 'polygon(50% 50%, 100% 40%, 100% 60%)' }}></div>
              </motion.div>
              <div className="flex items-center justify-center h-full">
                <span className="font-headline text-xl lg:text-3xl font-extrabold text-primary dark:text-white">82%</span>
              </div>
            </div>
            <div className="space-y-4 w-full">
              {[
                { name: 'Entertainment', val: 420.00, bg: 'bg-primary-container dark:bg-blue-900' },
                { name: 'Productivity', val: 185.20, bg: 'bg-secondary-container dark:bg-cyan-800' },
                { name: 'Lifestyle', val: 94.00, bg: 'bg-tertiary-fixed-dim' }
              ].map((cat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.35 }}
                  className="flex justify-between items-center group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${cat.bg}`}></div>
                    <span className="font-body text-sm font-medium dark:text-slate-200">{cat.name}</span>
                  </div>
                  <span className="font-label text-sm font-bold dark:text-white">{formatAmount(cat.val)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Savings Opportunities */}
          <motion.div variants={fadeUp} className="col-span-12 mt-4 space-y-6">
            <div className="flex items-center gap-2 mb-2 lg:mb-4">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">verified</span>
              <h3 className="font-headline text-xl lg:text-2xl font-bold text-primary dark:text-white">Savings Opportunities</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-surface-container-low dark:bg-slate-800 p-6 rounded-2xl border-l-4 border-error hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-surface dark:bg-slate-700 rounded-lg">
                    <span className="material-symbols-outlined text-error">inactive_order</span>
                  </div>
                  <span className="bg-error-container dark:bg-red-900/40 text-on-error-container dark:text-red-300 px-2 py-0.5 rounded text-[10px] font-bold">DORMANT</span>
                </div>
                <h4 className="font-headline font-bold text-primary dark:text-white mb-1">Adobe Creative Cloud</h4>
                <p className="font-body text-xs text-on-surface-variant dark:text-slate-400 mb-6">No activity recorded in 45 days. Potential waste.</p>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/15 dark:border-slate-700">
                  <span className="font-headline font-bold text-primary dark:text-white">{formatAmount(54.99)}/mo</span>
                  <button className="text-error font-label text-xs font-bold hover:underline">CANCEL NOW</button>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-surface-container-low dark:bg-slate-800 p-6 rounded-2xl border-l-4 border-secondary-fixed hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-surface dark:bg-slate-700 rounded-lg">
                    <span className="material-symbols-outlined text-primary dark:text-blue-400">content_copy</span>
                  </div>
                  <span className="bg-primary-fixed dark:bg-blue-900/50 text-primary dark:text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">DUPLICATE</span>
                </div>
                <h4 className="font-headline font-bold text-primary dark:text-white mb-1">Dropbox + iCloud</h4>
                <p className="font-body text-xs text-on-surface-variant dark:text-slate-400 mb-6">Overlapping cloud storage found (4TB total).</p>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/15 dark:border-slate-700">
                  <span className="font-headline font-bold text-primary dark:text-white">{formatAmount(19.98)}/mo</span>
                  <button className="text-primary dark:text-blue-400 font-label text-xs font-bold hover:underline">CONSOLIDATE</button>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-surface-container-lowest dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-outline-variant/10 dark:border-slate-700/50 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-tertiary-container/10 dark:bg-emerald-900/20 rounded-lg">
                    <span className="material-symbols-outlined text-on-tertiary-container dark:text-emerald-400">monitoring</span>
                  </div>
                  <h4 className="font-headline font-bold text-primary dark:text-white">The Spend Pulse</h4>
                </div>
                <div className="h-16 relative">
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
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="font-label text-[10px] text-on-surface-variant dark:text-slate-400 uppercase tracking-tighter">Efficiency Score</p>
                    <p className="font-headline text-xl font-bold text-on-tertiary-container dark:text-emerald-400">94/100</p>
                  </div>
                  <span className="material-symbols-outlined text-tertiary-fixed-dim">trending_up</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="col-span-12 grid grid-cols-1 lg:grid-cols-4 gap-6 mt-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="col-span-1 bg-primary text-on-primary p-6 rounded-2xl shadow-md"
            >
              <span className="material-symbols-outlined text-tertiary-fixed-dim mb-4 block">lightbulb</span>
              <h4 className="font-headline font-bold text-lg mb-2">Editorial Insight</h4>
              <p className="text-sm font-body opacity-90 leading-relaxed mb-6">Your entertainment spend is 12% higher than similar users. Consider family plan consolidation.</p>
              <button className="text-tertiary-fixed font-label text-xs font-bold uppercase tracking-widest hover:underline">Learn More</button>
            </motion.div>
            <div className="col-span-1 lg:col-span-3 bg-surface-container-low dark:bg-slate-800 p-6 lg:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="w-14 h-14 lg:w-16 lg:h-16 shrink-0 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-primary dark:text-blue-400 text-2xl lg:text-3xl">calendar_today</span>
                </div>
                <div>
                  <h4 className="font-headline text-lg lg:text-xl font-bold text-primary dark:text-white">Next Big Renewal</h4>
                  <p className="font-body text-xs lg:text-sm text-on-surface-variant dark:text-slate-400">Annual Amazon Prime renewal on Sept 14th</p>
                </div>
              </div>
              <div className="md:text-right w-full md:w-auto pl-18 md:pl-0">
                <p className="font-headline text-2xl lg:text-3xl font-extrabold text-primary dark:text-white">{formatAmount(139.00)}</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 w-full md:w-auto text-xs font-bold bg-primary dark:bg-blue-600 text-on-primary px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
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
