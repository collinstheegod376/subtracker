"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getSubscriptions, type Subscription } from '@/lib/api';
import { useSettings } from '@/lib/settings-context';

export default function CalendarPage() {
  const { formatAmount } = useSettings();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubscriptions()
      .then(setSubs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeSubs = subs.filter(s => s.status === 'Active');

  // Simple static calendar grid for demonstration
  const daysInMonth = 30;
  
  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-10 pb-20 space-y-6 sm:space-y-8">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-0.5 sm:gap-1">
          <h2 className="font-headline text-xl sm:text-3xl font-extrabold text-primary dark:text-white tracking-tight">Calendar</h2>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant dark:text-slate-400">View your upcoming billing cycle dates.</p>
        </motion.section>

        {loading ? (
          <div className="flex justify-center p-12 sm:p-20"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-slate-700/50">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const daySubs = activeSubs.filter(s => {
                  const anyS = s as any;
                  const billingDay = anyS.next_billing_date ? new Date(anyS.next_billing_date).getDate() : ((s.name.charCodeAt(0) % 28) + 1);
                  return billingDay === day;
                });

                return (
                  <div key={i} className={`min-h-[60px] sm:min-h-24 rounded-xl p-2 sm:p-3 border ${daySubs.length > 0 ? 'border-primary/30 bg-primary/5 dark:bg-primary/10' : 'border-slate-100 dark:border-slate-700/50 bg-surface-container-low dark:bg-slate-800'}`}>
                    <div className="font-bold text-sm sm:text-lg mb-1 sm:mb-2 text-slate-400 opacity-60">{day}</div>
                    <div className="space-y-0.5 sm:space-y-1">
                      {daySubs.map((sub, j) => (
                        <div key={j} className="text-[8px] sm:text-xs font-semibold bg-white dark:bg-slate-700 px-1 sm:px-2 py-0.5 rounded drop-shadow-sm truncate">
                          {sub.name} <span className="opacity-60 hidden sm:inline">({formatAmount(Number(sub.amount))})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
