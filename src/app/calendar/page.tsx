"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getSubscriptions, type Subscription } from '@/lib/api';
import { useSettings } from '@/lib/settings-context';
import Link from 'next/link';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// Compute the next N renewal dates for a subscription
function getRenewalDatesInRange(sub: Subscription, startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  if (!sub.next_renewal) return dates;

  let current = new Date(sub.next_renewal);
  // Walk backwards if needed to find the first occurrence before start
  const increment = sub.billing_cycle === 'Annual' ? 12 : sub.billing_cycle === 'Quarterly' ? 3 : 1;
  
  // Go back to before start
  while (current > startDate) {
    const prev = new Date(current);
    prev.setMonth(prev.getMonth() - increment);
    if (prev < startDate) break;
    current = prev;
  }

  // Now walk forward collecting dates in range
  while (current <= endDate) {
    if (current >= startDate) {
      dates.push(new Date(current));
    }
    const next = new Date(current);
    next.setMonth(next.getMonth() + increment);
    current = next;
  }
  return dates;
}

export default function CalendarPage() {
  const { formatAmount } = useSettings();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());

  useEffect(() => {
    getSubscriptions()
      .then(setSubs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeSubs = subs.filter(s => s.status === 'Active');

  // Build a map of dateKey -> subscriptions for the current view month
  const renewalMap = useMemo(() => {
    const map: Record<string, Subscription[]> = {};
    const monthStart = new Date(viewYear, viewMonth, 1);
    const monthEnd = new Date(viewYear, viewMonth + 1, 0);

    activeSubs.forEach(sub => {
      const dates = getRenewalDatesInRange(sub, monthStart, monthEnd);
      dates.forEach(d => {
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if (!map[key]) map[key] = [];
        map[key].push(sub);
      });
    });
    return map;
  }, [activeSubs, viewMonth, viewYear]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  // Selected day subs
  const selectedSubs = selectedDay ? (renewalMap[selectedDay] || []) : [];

  // Total renewals this month
  const totalRenewals = Object.values(renewalMap).reduce((sum, arr) => sum + arr.length, 0);
  const totalAmount = Object.values(renewalMap).flat().reduce((sum, s) => {
    let monthly = Number(s.amount);
    if (s.billing_cycle === 'Annual') monthly = monthly / 12;
    if (s.billing_cycle === 'Quarterly') monthly = monthly / 3;
    return sum + monthly;
  }, 0);

  const goNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };
  const goPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };

  const isToday = (day: number) => {
    return viewYear === now.getFullYear() && viewMonth === now.getMonth() && day === now.getDate();
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 sm:p-6 lg:p-10 pb-24 lg:pb-12 space-y-6"
      >
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        >
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-widest opacity-80">Renewal Timeline</p>
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary dark:text-white tracking-tight">Calendar</h2>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 dark:border-slate-700/30 text-center">
              <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Renewals</p>
              <p className="text-lg font-black text-primary dark:text-white font-headline">{totalRenewals}</p>
            </div>
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 dark:border-slate-700/30 text-center">
              <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">This Month</p>
              <p className="text-lg font-black text-primary dark:text-white font-headline">{formatAmount(totalAmount)}</p>
            </div>
          </div>
        </motion.section>

        {loading ? (
          <div className="flex justify-center p-20"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Calendar Grid */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl border border-white/20 dark:border-slate-700/30"
            >
              {/* Month Navigation */}
              <div className="flex justify-between items-center mb-6">
                <button onClick={goPrevMonth} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-95">
                  <span className="material-symbols-outlined text-primary dark:text-white">chevron_left</span>
                </button>
                <div className="text-center">
                  <h3 className="font-headline text-xl sm:text-2xl font-black text-primary dark:text-white">{MONTH_NAMES[viewMonth]}</h3>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{viewYear}</p>
                </div>
                <button onClick={goNextMonth} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-95">
                  <span className="material-symbols-outlined text-primary dark:text-white">chevron_right</span>
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAY_NAMES.map(d => (
                  <div key={d} className="text-center text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest py-2">{d}</div>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells before first day */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[52px] sm:min-h-[72px]" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateKey = `${viewYear}-${viewMonth}-${day}`;
                  const daySubs = renewalMap[dateKey] || [];
                  const hasRenewals = daySubs.length > 0;
                  const isSelected = selectedDay === dateKey;
                  const today = isToday(day);

                  return (
                    <motion.button
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDay(isSelected ? null : dateKey)}
                      className={`min-h-[52px] sm:min-h-[72px] rounded-xl sm:rounded-2xl p-1.5 sm:p-2 transition-all duration-200 border text-left flex flex-col relative ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                          : hasRenewals
                          ? 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30 hover:border-primary/40'
                          : 'bg-white/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className={`text-xs sm:text-sm font-bold ${
                        isSelected ? 'text-white' : today ? 'text-primary dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {day}
                      </span>
                      {today && !isSelected && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary dark:bg-blue-400"></div>
                      )}
                      {hasRenewals && (
                        <div className="mt-auto flex flex-wrap gap-0.5">
                          {daySubs.slice(0, 3).map((_, j) => (
                            <div key={j} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/60' : 'bg-primary dark:bg-blue-400'}`} />
                          ))}
                          {daySubs.length > 3 && (
                            <span className={`text-[7px] font-bold ${isSelected ? 'text-white/80' : 'text-primary/60 dark:text-blue-400/60'}`}>+{daySubs.length - 3}</span>
                          )}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Sidebar — Selected Day / Upcoming */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4 space-y-4"
            >
              {/* Selected Day Detail */}
              <AnimatePresence mode="wait">
                {selectedDay && (
                  <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-primary dark:bg-blue-600 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Selected Date</p>
                      <h4 className="font-headline text-2xl font-black mb-4">
                        {MONTH_NAMES[viewMonth]} {selectedDay.split('-')[2]}, {viewYear}
                      </h4>
                      {selectedSubs.length === 0 ? (
                        <div className="py-4 text-center opacity-70">
                          <span className="material-symbols-outlined text-3xl mb-2 block opacity-50">event_busy</span>
                          <p className="text-xs font-medium">No renewals on this date</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedSubs.map((sub) => (
                            <div key={sub.id} className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-bold text-sm">{sub.name}</p>
                                  <p className="text-[10px] opacity-60 mt-0.5">{sub.category || 'General'} · {sub.billing_cycle}</p>
                                </div>
                                <span className="font-headline font-black text-lg">{formatAmount(Number(sub.amount))}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Upcoming Renewals List */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-slate-700/30">
                <h4 className="font-headline text-lg font-black text-primary dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                  Upcoming
                </h4>
                <div className="space-y-3">
                  {activeSubs
                    .filter(s => s.next_renewal && new Date(s.next_renewal) >= now)
                    .sort((a, b) => new Date(a.next_renewal!).getTime() - new Date(b.next_renewal!).getTime())
                    .slice(0, 5)
                    .map((sub) => {
                      const renewDate = new Date(sub.next_renewal!);
                      const daysUntil = Math.ceil((renewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <motion.div
                          key={sub.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-3 bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-white/20 dark:border-slate-700/30 hover:border-primary/20 transition-all"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-blue-500/10 flex flex-col items-center justify-center shrink-0 border border-primary/10 dark:border-blue-500/20">
                            <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase leading-none">{MONTH_NAMES[renewDate.getMonth()].slice(0, 3)}</span>
                            <span className="text-sm font-black text-primary dark:text-white leading-none">{renewDate.getDate()}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-primary dark:text-white truncate">{sub.name}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                              {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                            </p>
                          </div>
                          <span className="text-sm font-black text-primary dark:text-white">{formatAmount(Number(sub.amount))}</span>
                        </motion.div>
                      );
                    })}
                  {activeSubs.filter(s => s.next_renewal && new Date(s.next_renewal) >= now).length === 0 && (
                    <div className="text-center py-6 opacity-60">
                      <span className="material-symbols-outlined text-2xl text-slate-400 mb-2 block">event_available</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No upcoming renewals</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Navigate */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-slate-700/30">
                <h4 className="font-headline text-sm font-black text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-widest">Quick Jump</h4>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2].map(offset => {
                    const m = (now.getMonth() + offset) % 12;
                    const y = now.getFullYear() + Math.floor((now.getMonth() + offset) / 12);
                    const isActive = viewMonth === m && viewYear === y;
                    return (
                      <button
                        key={offset}
                        onClick={() => { setViewMonth(m); setViewYear(y); setSelectedDay(null); }}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                          isActive
                            ? 'bg-primary text-white shadow-lg'
                            : 'bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700/50'
                        }`}
                      >
                        {MONTH_NAMES[m].slice(0, 3)} {y}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
