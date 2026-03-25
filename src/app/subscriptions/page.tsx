"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSettings } from '@/lib/settings-context';
import { useAuth } from '@/lib/auth-context';
import { getSubscriptions, updateSubscription, deleteSubscription, type Subscription } from '@/lib/api';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function SubscriptionsList() {
  const { formatAmount, compactView } = useSettings();
  const { user } = useAuth();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Paused'>('All');
  const [loading, setLoading] = useState(true);

  // Demo fallback data
  const demoSubs: Subscription[] = [
    { id: '1', user_id: '', name: 'Spotify Premium', amount: 16.99, currency: 'NGN', billing_cycle: 'Monthly', category: 'Entertainment', status: 'Active', start_date: '', next_renewal: null, logo_url: null, created_at: '' },
    { id: '2', user_id: '', name: 'Netflix', amount: 22.99, currency: 'NGN', billing_cycle: 'Monthly', category: 'Entertainment', status: 'Paused', start_date: '', next_renewal: null, logo_url: null, created_at: '' },
    { id: '3', user_id: '', name: 'Adobe Creative Cloud', amount: 599.88, currency: 'NGN', billing_cycle: 'Annual', category: 'Software & Tools', status: 'Active', start_date: '', next_renewal: null, logo_url: null, created_at: '' },
    { id: '4', user_id: '', name: 'Google One', amount: 9.99, currency: 'NGN', billing_cycle: 'Monthly', category: 'Cloud Storage', status: 'Active', start_date: '', next_renewal: null, logo_url: null, created_at: '' },
  ];

  useEffect(() => {
    getSubscriptions()
      .then(data => setSubs(data.length > 0 ? data : demoSubs))
      .catch(() => setSubs(demoSubs))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = filter === 'All' ? subs : subs.filter(s => s.status === filter);

  const totalActive = subs
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => {
      const amt = Number(s.amount);
      if (s.billing_cycle === 'Annual') return sum + amt / 12;
      if (s.billing_cycle === 'Quarterly') return sum + amt / 3;
      return sum + amt;
    }, 0);

  const handleToggleStatus = async (sub: Subscription) => {
    const newStatus = sub.status === 'Active' ? 'Paused' : 'Active';
    try {
      await updateSubscription(sub.id, { status: newStatus });
      setSubs(prev => prev.map(s => s.id === sub.id ? { ...s, status: newStatus as 'Active' | 'Paused' } : s));
    } catch {
      // For demo mode, just toggle locally
      setSubs(prev => prev.map(s => s.id === sub.id ? { ...s, status: newStatus as 'Active' | 'Paused' } : s));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubscription(id);
      setSubs(prev => prev.filter(s => s.id !== id));
    } catch {
      setSubs(prev => prev.filter(s => s.id !== id));
    }
  };

  const iconMap: Record<string, string> = {
    'Entertainment': 'movie',
    'Software & Tools': 'code',
    'Cloud Storage': 'cloud',
    'Information & News': 'newspaper',
    'Lifestyle & Wellness': 'spa',
    'Logistics & Transport': 'local_shipping',
  };

  return (
    <DashboardLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="p-4 sm:p-6 lg:p-10 pb-24 sm:pb-20 lg:pb-10 max-w-6xl mx-auto">
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-headline tracking-tight text-primary dark:text-white mb-1 sm:mb-2">Subscriptions</h2>
            <p className="text-xs sm:text-sm lg:text-base text-on-surface-variant dark:text-slate-400 font-medium">Manage your recurring digital editorial assets.</p>
          </div>
          <div className="flex w-full md:w-auto overflow-x-auto gap-1.5 sm:gap-2 p-1 bg-surface-container-low dark:bg-slate-800 rounded-full no-scrollbar shrink-0">
            {(['All', 'Active', 'Paused'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs lg:text-sm font-bold transition-all whitespace-nowrap ${
                  filter === f
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-white'
                    : 'text-on-surface-variant dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
          {filtered.map((sub, i) => (
            <motion.div
              key={sub.id}
              variants={fadeUp}
              layout
              className={`group flex flex-col lg:grid lg:grid-cols-12 items-start lg:items-center ${compactView ? 'p-3 lg:p-4' : 'p-4 sm:p-5 lg:p-6'} bg-surface-container-lowest dark:bg-slate-800 rounded-2xl hover:shadow-lg transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600 gap-3 sm:gap-4 lg:gap-0 relative`}
            >
              <div className="col-span-4 flex items-center gap-3 sm:gap-4 w-full pr-16 lg:pr-0">
                <div className={`${compactView ? 'w-9 h-9 sm:w-10 sm:h-10' : 'w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14'} shrink-0 rounded-xl bg-surface-container-high dark:bg-slate-700 flex items-center justify-center text-primary dark:text-blue-400`}>
                  <span className="material-symbols-outlined text-xl">{iconMap[sub.category] || 'subscriptions'}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-headline font-bold text-sm sm:text-base lg:text-lg text-primary dark:text-white truncate">{sub.name}</h3>
                  <p className="text-[9px] sm:text-[10px] lg:text-xs font-label text-on-surface-variant dark:text-slate-400 truncate">{sub.category || 'General'}</p>
                </div>
              </div>
              
              <div className="flex w-full lg:w-auto lg:contents justify-between items-end lg:items-center gap-4 mt-1 lg:mt-0">
                <div className="col-span-2">
                  <p className="text-[9px] text-on-surface-variant dark:text-slate-400 font-label mb-0.5 sm:mb-1 uppercase tracking-wider hidden lg:block">Amount</p>
                  <p className="font-headline font-bold text-sm sm:text-base lg:text-lg text-on-surface dark:text-white">{formatAmount(Number(sub.amount))}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-[9px] text-on-surface-variant dark:text-slate-400 font-label mb-0.5 sm:mb-1 uppercase tracking-wider hidden lg:block">Cycle</p>
                  <span className={`px-2 py-0.5 sm:py-1 lg:px-3 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-tight ${sub.billing_cycle === 'Annual' ? 'bg-primary-fixed text-on-primary-fixed-variant dark:bg-blue-900/50 dark:text-blue-300' : 'bg-secondary-container text-on-secondary-container dark:bg-slate-600 dark:text-slate-200'}`}>
                    {sub.billing_cycle}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <p className="text-[9px] text-on-surface-variant dark:text-slate-400 font-label mb-0.5 sm:mb-1 uppercase tracking-wider hidden lg:block">Status</p>
                  <div className="flex items-center gap-1.5">
                    <motion.span 
                      animate={{ scale: sub.status === 'Active' ? [1, 1.3, 1] : 1 }}
                      transition={{ repeat: sub.status === 'Active' ? Infinity : 0, duration: 2 }}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${sub.status === 'Active' ? 'bg-tertiary-fixed' : 'bg-surface-dim'}`}
                    />
                    <span className={`text-[10px] sm:text-xs lg:text-sm font-semibold ${sub.status === 'Active' ? 'text-on-surface dark:text-white' : 'text-on-surface-variant dark:text-slate-400'}`}>{sub.status}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-1 absolute top-4 sm:top-5 right-4 sm:right-5 lg:relative lg:top-auto lg:right-auto lg:col-span-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleToggleStatus(sub)}
                  className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high dark:hover:bg-slate-600 text-on-surface-variant dark:text-slate-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">{sub.status === 'Active' ? 'pause_circle' : 'play_circle'}</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleDelete(sub.id)}
                  className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-full hover:bg-error-container/20 text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-8 lg:mt-12 p-5 sm:p-6 lg:p-8 glass-card dark:bg-slate-800/50 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 shrink-0 rounded-full primary-gradient flex items-center justify-center text-white shadow-xl">
              <span className="material-symbols-outlined text-xl sm:text-2xl lg:text-3xl">payments</span>
            </div>
            <div>
              <h4 className="font-headline font-bold text-base sm:text-lg lg:text-xl text-primary dark:text-white">Monthly Forecast</h4>
              <p className="text-[10px] sm:text-xs lg:text-sm text-on-surface-variant dark:text-slate-400 font-medium">Estimated spend based on active cycles.</p>
            </div>
          </div>
          <div className="text-left md:text-right w-full md:w-auto pl-14 sm:pl-16 md:pl-0">
            <p className="text-[9px] lg:text-xs font-bold text-primary-container dark:text-blue-400 uppercase tracking-widest mb-0.5 sm:mb-1 font-label">Total Projection</p>
            <motion.p 
              key={totalActive}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-headline text-primary dark:text-white"
            >
              {formatAmount(totalActive)}
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
