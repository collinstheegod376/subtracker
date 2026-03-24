"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSettings } from '@/lib/settings-context';
import { useAuth } from '@/lib/auth-context';
import { addSubscription } from '@/lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function AddService() {
  const { currencySymbol, currency } = useSettings();
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [startDate, setStartDate] = useState('');
  const [category, setCategory] = useState('Software & Tools');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !amount) {
      setErrorMsg('Please fill in the service name and amount.');
      return;
    }
    setStatus('saving');
    setErrorMsg('');
    try {
      await addSubscription({
        user_id: user?.id || '',
        name: name.trim(),
        amount: parseFloat(amount),
        currency,
        billing_cycle: billingCycle as 'Monthly' | 'Quarterly' | 'Annual',
        category,
        status: 'Active',
        start_date: startDate || new Date().toISOString().split('T')[0],
        logo_url: null,
      });
      setStatus('success');
      setTimeout(() => router.push('/subscriptions'), 1500);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to save. Make sure Supabase is configured.');
    }
  };

  const handleDiscard = () => {
    setName('');
    setAmount('');
    setBillingCycle('Monthly');
    setStartDate('');
    setCategory('Software & Tools');
    setErrorMsg('');
    setStatus('idle');
  };

  return (
    <DashboardLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-6xl mx-auto p-4 lg:p-10 pb-24">
        <motion.div variants={fadeUp} className="mb-8 lg:mb-12">
          <span className="inline-block px-3 py-1 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold rounded-full mb-4 tracking-widest hidden lg:inline-block">NEW ENTRY</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-primary dark:text-white tracking-tight mb-2">Catalog a New Commitment</h2>
          <p className="text-sm lg:text-base text-on-surface-variant dark:text-slate-400 font-medium max-w-xl">Each subscription is a chapter in your financial narrative. Define its scope and impact with precision.</p>
        </motion.div>

        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          <motion.div variants={fadeUp} className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-surface-container-lowest dark:bg-slate-800 p-6 lg:p-8 rounded-2xl shadow-sm space-y-8 border border-slate-100 dark:border-slate-700/50">
              {/* Success Message */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-tertiary-fixed/20 dark:bg-emerald-900/30 border border-tertiary-fixed/40 dark:border-emerald-700/40 rounded-xl p-6 text-center"
                >
                  <span className="material-symbols-outlined text-on-tertiary-container dark:text-emerald-400 text-4xl mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <p className="font-headline font-bold text-primary dark:text-white">Subscription Added!</p>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">Redirecting to your subscriptions...</p>
                </motion.div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-error-container dark:bg-red-900/30 text-on-error-container dark:text-red-300 text-xs font-medium px-4 py-3 rounded-xl"
                >
                  {errorMsg}
                </motion.div>
              )}

              {status !== 'success' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 tracking-widest uppercase">Service Identity</label>
                      <input
                        className="w-full bg-surface-container-highest dark:bg-slate-700 border-none focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 rounded-xl px-4 py-3 text-primary dark:text-white font-semibold transition-all outline-none"
                        placeholder="e.g. Bloomberg Terminal"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 tracking-widest uppercase">Monetary Value</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary dark:text-blue-400 font-bold">{currencySymbol}</span>
                        <input
                          className="w-full bg-surface-container-highest dark:bg-slate-700 border-none focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 rounded-xl pl-8 pr-4 py-3 text-primary dark:text-white font-semibold outline-none"
                          placeholder="0.00"
                          type="number"
                          step="0.01"
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 tracking-widest uppercase">Billing Cycle</label>
                      <select
                        className="w-full bg-surface-container-highest dark:bg-slate-700 border-none focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 rounded-xl px-4 py-3 text-primary dark:text-white font-semibold outline-none appearance-none cursor-pointer"
                        value={billingCycle}
                        onChange={e => setBillingCycle(e.target.value)}
                      >
                        <option>Monthly</option>
                        <option>Quarterly</option>
                        <option>Annual</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 tracking-widest uppercase">Inception Date</label>
                      <input
                        className="w-full bg-surface-container-highest dark:bg-slate-700 border-none focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 rounded-xl px-4 py-3 text-primary dark:text-white font-semibold outline-none cursor-pointer"
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 tracking-widest uppercase">Category Classification</label>
                      <select
                        className="w-full bg-surface-container-highest dark:bg-slate-700 border-none focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 rounded-xl px-4 py-3 text-primary dark:text-white font-semibold outline-none appearance-none cursor-pointer"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                      >
                        <option>Software & Tools</option>
                        <option>Entertainment</option>
                        <option>Information & News</option>
                        <option>Lifestyle & Wellness</option>
                        <option>Logistics & Transport</option>
                        <option>Cloud Storage</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-surface-variant dark:border-slate-700 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                    <button
                      onClick={handleDiscard}
                      className="text-on-surface-variant dark:text-slate-400 text-sm font-semibold hover:text-primary dark:hover:text-white transition-colors w-full sm:w-auto py-3"
                    >
                      Discard Draft
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      disabled={status === 'saving'}
                      className="primary-gradient text-white px-10 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 w-full sm:w-auto disabled:opacity-60"
                    >
                      {status === 'saving' ? 'Saving...' : 'Commit to Ledger'}
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-surface-container-low dark:bg-slate-800 p-6 lg:p-8 rounded-2xl space-y-6 border border-slate-100 dark:border-slate-700/50">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-4 tracking-widest uppercase">Quick Tips</label>
                <div className="space-y-4">
                  {[
                    { icon: 'lightbulb', text: 'Track annual costs monthly for better budgeting' },
                    { icon: 'notifications', text: 'Enable renewal alerts so you never miss a charge' },
                    { icon: 'savings', text: 'Review dormant subscriptions monthly to save money' },
                  ].map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.12, duration: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <span className="material-symbols-outlined text-surface-tint dark:text-blue-400 text-lg mt-0.5">{tip.icon}</span>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-relaxed">{tip.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
