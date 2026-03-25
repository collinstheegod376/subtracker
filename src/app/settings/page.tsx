"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSettings, Currency } from '@/lib/settings-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus:ring-2 focus:ring-primary/30 ${checked ? 'bg-primary dark:bg-blue-500' : 'bg-surface-container-highest dark:bg-slate-600'}`}
    >
      <motion.span 
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 mt-0.5 ${checked ? 'ml-[22px]' : 'ml-0.5'}`}
      />
    </button>
  );
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

import Image from 'next/image';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  const { darkMode, setDarkMode, compactView, setCompactView, currency, setCurrency, notifications, setNotification } = useSettings();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  // Sync state with user data
  useEffect(() => {
    if (user && !firstName && !lastName) { // Only sync if fields are empty to avoid overwriting user edits
      const fullName = user.user_metadata?.full_name || '';
      const parts = fullName.split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
  }, [user]);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwStatus, setPwStatus] = useState('');

  const handleSaveAccount = async () => {
    setSaveStatus('saving');
    try {
      await supabase.auth.updateUser({ 
        email,
        data: { full_name: `${firstName} ${lastName}`, avatar_url: avatarUrl }
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch {
      setSaveStatus('error');
    }
  };

  const handlePasswordChange = async () => {
    if (newPw.length < 6) {
      setPwStatus('Password must be at least 6 characters');
      return;
    }
    setPwStatus('saving');
    try {
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      setPwStatus('Password updated!');
      setCurrentPw('');
      setNewPw('');
      setTimeout(() => setPwStatus(''), 3000);
    } catch (err: any) {
      setPwStatus(err.message || 'Failed to update');
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: 'person' },
    { id: 'preferences', label: 'Preferences', icon: 'tune' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'billing', label: 'Billing & Plan', icon: 'credit_card' },
    { id: 'security', label: 'Security', icon: 'lock' },
  ];

  return (
    <DashboardLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10 pb-32">
        <motion.section variants={fadeUp} className="mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black font-headline tracking-tight text-primary dark:text-white">Settings</h2>
          <p className="text-xs sm:text-sm lg:text-base text-slate-500 dark:text-slate-400 mt-1 sm:mt-2 font-medium">Manage your profile, preferences, and billing security.</p>
        </motion.section>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start relative">
          <motion.div variants={fadeUp} className="lg:col-span-4 lg:sticky lg:top-24 z-20">
            <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] p-3 sm:p-4 lg:p-6 shadow-xl border border-white/20 dark:border-slate-700/30 flex flex-row lg:flex-col gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-3 lg:pb-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 font-black text-xs sm:text-sm whitespace-nowrap lg:whitespace-normal group ${
                    activeTab === tab.id 
                      ? 'bg-primary text-white shadow-2xl shadow-primary/20 scale-[1.02]' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl sm:text-2xl transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} style={activeTab === tab.id ? { fontVariationSettings: "'FILL' 1" } : {}}>{tab.icon}</span>
                  <span className="tracking-tight">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 sm:p-8 lg:p-12 rounded-3xl lg:rounded-[3rem] shadow-xl border border-white/20 dark:border-slate-700/30 space-y-8 sm:space-y-10">
                <div className="border-b border-slate-200/50 dark:border-slate-700/50 pb-4 sm:pb-6">
                  <h3 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white tracking-tight">Personal Details</h3>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10">
                  <div className="relative group">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[2.5rem] bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 shrink-0 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      <Image 
                        src={avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                        alt="avatar" 
                        width={128}
                        height={128}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-primary text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg cursor-pointer">
                      <span className="material-symbols-outlined text-xs sm:text-sm">photo_camera</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] opacity-80">Profile Photo Identity</label>
                    <div className="flex gap-2 sm:gap-3">
                      <input 
                        type="text" 
                        placeholder="Image URL..."
                        value={avatarUrl} 
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="flex-1 bg-white/50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 border border-slate-100 dark:border-slate-700/50 focus:ring-2 focus:ring-primary/20 outline-none text-xs sm:text-sm text-primary dark:text-white transition-all backdrop-blur-md" 
                      />
                      <button 
                        type="button"
                        onClick={() => window.open(avatarUrl, '_blank')}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black transition-all shadow-sm border border-slate-100 dark:border-slate-600 active:scale-95"
                      >
                        PREVIEW
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] opacity-80">First Name</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-slate-100 dark:border-slate-700/50 focus:ring-2 focus:ring-primary/20 outline-none text-xs sm:text-sm font-bold text-primary dark:text-white transition-all" />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] opacity-80">Last Name</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-slate-100 dark:border-slate-700/50 focus:ring-2 focus:ring-primary/20 outline-none text-xs sm:text-sm font-bold text-primary dark:text-white transition-all" />
                  </div>
                  <div className="sm:col-span-2 space-y-2 sm:space-y-3">
                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] opacity-80">Primary Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-slate-100 dark:border-slate-700/50 focus:ring-2 focus:ring-primary/20 outline-none text-xs sm:text-sm font-bold text-primary dark:text-white transition-all" />
                  </div>
                </div>

                <div className="pt-4 sm:pt-6 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-6 -m-6 sm:-m-8 lg:-m-12 mt-6 sm:mt-10 rounded-b-3xl lg:rounded-b-[3rem] border-t border-slate-200/30 dark:border-slate-700/30">
                  <div className="flex items-center gap-2">
                    {saveStatus === 'saved' && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5 sm:gap-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] sm:text-xs">
                        <span className="material-symbols-outlined text-sm">check_circle</span> <span className="hidden sm:inline">Changes saved!</span><span className="sm:hidden">Saved</span>
                      </motion.div>
                    )}
                    {saveStatus === 'error' && <span className="text-rose-500 text-[10px] sm:text-xs font-black uppercase tracking-widest">Failed</span>}
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }} 
                    onClick={handleSaveAccount} 
                    disabled={saveStatus === 'saving'} 
                    className="px-5 sm:px-8 py-3 sm:py-4 bg-primary dark:bg-blue-600 text-white font-black rounded-xl sm:rounded-2xl hover:shadow-2xl hover:shadow-primary/30 transition-all text-xs sm:text-sm tracking-widest uppercase disabled:opacity-50"
                  >
                    {saveStatus === 'saving' ? 'Syncing...' : 'Sync Profile'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 sm:p-8 lg:p-12 rounded-3xl lg:rounded-[3rem] shadow-xl border border-white/20 dark:border-slate-700/30 space-y-8 sm:space-y-10">
                <h3 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white tracking-tight border-b border-white/10 pb-4 sm:pb-6">App Preferences</h3>
                <div className="space-y-4">
                  {[
                    { key: 'darkMode', title: 'Aesthetic: Dark', desc: 'Sleek dark interface for reduced strain', value: darkMode, setter: setDarkMode },
                    { key: 'compactView', title: 'Layout: Compact', desc: 'Maximize information density', value: compactView, setter: setCompactView }
                  ].map((item) => (
                    <div key={item.key} className="flex justify-between items-center p-4 sm:p-6 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-700/30 rounded-2xl sm:rounded-3xl group hover:border-primary/20 transition-all duration-300">
                      <div className="flex-1 pr-4">
                        <h4 className="font-black text-primary dark:text-white text-sm sm:text-base tracking-tight">{item.title}</h4>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 font-medium">{item.desc}</p>
                      </div>
                      <Toggle checked={item.value} onChange={item.setter} />
                    </div>
                  ))}
                  <div className="p-6 sm:p-8 bg-slate-900/5 dark:bg-black/20 rounded-3xl lg:rounded-[2rem] border border-white/10">
                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 dark:text-slate-400 mb-3 sm:mb-4 uppercase tracking-[0.2em] opacity-80">Transaction Currency</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                      {(['USD', 'EUR', 'GBP', 'NGN'] as Currency[]).map((curr) => (
                        <button
                          key={curr}
                          onClick={() => setCurrency(curr)}
                          className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-[10px] sm:text-xs font-black transition-all border ${
                            currency === curr 
                              ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                              : 'bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-transparent hover:bg-white dark:hover:bg-slate-700'
                          }`}
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 sm:p-8 lg:p-12 rounded-3xl lg:rounded-[3rem] shadow-xl border border-white/20 dark:border-slate-700/30 space-y-8 sm:space-y-10">
                <h3 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white tracking-tight border-b border-white/10 pb-4 sm:pb-6">Smart Alerts</h3>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {[
                    { key: 'pushNotifications', title: 'Device Push Alerts', desc: 'Direct system notifications' },
                    { key: 'renewals', title: 'Upcoming Renewals', desc: 'Advance warnings 72h before' },
                    { key: 'priceChanges', title: 'Budget Deviations', desc: 'Alerts on cost hikes' },
                    { key: 'weeklySummary', title: 'Strategic Recap', desc: 'Weekly efficiency report' },
                    { key: 'dormantWarning', title: 'Utility Analysis', desc: 'Alerts for zero usage' }
                  ].map((notif) => (
                    <div key={notif.key} className="flex justify-between items-center p-4 sm:p-6 bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-700/30 rounded-2xl sm:rounded-3xl group hover:border-primary/20 transition-all duration-300">
                      <div className="flex-1 pr-4">
                        <h4 className="font-black text-primary dark:text-white text-sm sm:text-base tracking-tight">{notif.title}</h4>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 font-medium">{notif.desc}</p>
                      </div>
                      <Toggle checked={(notifications as any)[notif.key]} onChange={(v) => setNotification(notif.key, v)} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 sm:p-8 lg:p-12 rounded-3xl lg:rounded-[3rem] shadow-xl border border-white/20 dark:border-slate-700/30 space-y-8 sm:space-y-10">
                <h3 className="font-headline font-black text-xl sm:text-2xl text-primary dark:text-white tracking-tight border-b border-white/10 pb-4 sm:pb-6">Account Fortress</h3>
                <div className="space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] opacity-80">Current Password</label>
                    <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-slate-100 dark:border-slate-700/50 focus:ring-2 focus:ring-primary/20 outline-none text-xs sm:text-sm font-bold text-primary dark:text-white transition-all" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] opacity-80">New Access Code</label>
                    <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="w-full bg-white/50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 border border-slate-100 dark:border-slate-700/50 focus:ring-2 focus:ring-primary/20 outline-none text-xs sm:text-sm font-bold text-primary dark:text-white transition-all" placeholder="Min. 6 characters" />
                  </div>
                  {pwStatus && pwStatus !== 'saving' && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${pwStatus.toLowerCase().includes('updated') ? 'text-emerald-500' : 'text-rose-500'}`}>{pwStatus}</motion.p>
                  )}
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }} 
                    onClick={handlePasswordChange} 
                    disabled={pwStatus === 'saving'} 
                    className="px-6 py-3 sm:py-4 bg-primary dark:bg-blue-600 text-white font-black rounded-xl sm:rounded-2xl hover:shadow-2xl transition-all text-xs sm:text-sm tracking-widest uppercase disabled:opacity-50"
                  >
                    {pwStatus === 'saving' ? 'UPDATING...' : 'Rotate Password'}
                  </motion.button>
                </div>
                <div className="pt-8 sm:pt-10 border-t border-slate-200 dark:border-slate-700/50">
                  <h4 className="font-black text-rose-500 text-sm sm:text-base mb-3 sm:mb-4 tracking-tight">Danger Zone</h4>
                  <div className="p-4 sm:p-6 bg-rose-50 dark:bg-rose-950/20 rounded-2xl sm:rounded-[2rem] border border-rose-100 dark:border-rose-900/30 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
                    <div className="text-center md:text-left">
                      <p className="text-xs sm:text-sm font-black text-rose-900 dark:text-rose-400 tracking-tight">Erase Account & Content</p>
                      <p className="text-[10px] text-rose-700/60 dark:text-rose-400/50 mt-0.5 sm:mt-1 font-medium">This action is irreversible.</p>
                    </div>
                    <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-rose-600 text-white font-black rounded-xl text-[10px] sm:text-xs tracking-widest uppercase hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20">Decline Access</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-primary dark:bg-blue-600 rounded-3xl lg:rounded-[3rem] p-6 sm:p-10 lg:p-14 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10 flex flex-col h-full gap-8 sm:gap-12">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Status</span>
                      <h4 className="font-headline text-2xl sm:text-4xl lg:text-5xl font-black mt-2 sm:mt-3">Pro Access</h4>
                      <p className="text-xs sm:text-sm font-medium opacity-80 mt-1 sm:mt-2">Unlimited tracking enabled.</p>
                    </div>
                    <div className="bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl backdrop-blur-md">
                      <span className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase">Active</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-2">
                    <div className="bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-2xl lg:rounded-[2rem] border border-white/5">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-60">Annual Cycle</span>
                      <p className="text-lg sm:text-2xl font-black mt-1 sm:mt-2 font-headline">$9.99<span className="text-xs sm:text-sm opacity-60 font-medium">/mo</span></p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-2xl lg:rounded-[2rem] border border-white/5">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-60">Next Cycle</span>
                      <p className="text-lg sm:text-2xl font-black mt-1 sm:mt-2 font-headline">Apr 2026</p>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-6 sm:w-12 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-[8px] sm:text-[10px]">VISA</div>
                      <p className="text-xs sm:text-sm font-black tracking-widest">•••• 4242</p>
                    </div>
                    <button className="text-white/60 hover:text-white font-black text-[9px] sm:text-[10px] tracking-widest uppercase underline transition-colors">Terminate</button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
