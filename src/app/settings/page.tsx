"use client";
import { useState } from 'react';
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

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  const { darkMode, setDarkMode, compactView, setCompactView, currency, setCurrency, notifications, setNotification } = useSettings();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState(user?.user_metadata?.full_name?.split(' ')[0] || 'Alex');
  const [lastName, setLastName] = useState(user?.user_metadata?.full_name?.split(' ')[1] || 'Rivera');
  const [email, setEmail] = useState(user?.email || 'alex.rivera@example.com');
  const [saveStatus, setSaveStatus] = useState('');

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwStatus, setPwStatus] = useState('');

  const handleSaveAccount = async () => {
    setSaveStatus('saving');
    try {
      await supabase.auth.updateUser({ 
        email,
        data: { full_name: `${firstName} ${lastName}` }
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
      <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-4xl mx-auto p-4 lg:p-10 pb-24">
        <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-extrabold font-headline tracking-tight text-primary dark:text-white mb-8">Settings</motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          <motion.div variants={fadeUp} className="md:col-span-4">
            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm whitespace-nowrap md:whitespace-normal ${
                    activeTab === tab.id 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-high dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl" style={activeTab === tab.id ? { fontVariationSettings: "'FILL' 1" } : {}}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="md:col-span-8 space-y-6">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="bg-surface-container-lowest dark:bg-slate-800 p-6 lg:p-8 rounded-2xl shadow-sm space-y-6 border border-slate-100 dark:border-slate-700/50">
                <h3 className="font-headline font-bold text-xl text-primary dark:text-white border-b border-surface-variant dark:border-slate-700 pb-4">Account Information</h3>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-surface-container-high dark:bg-slate-700 overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 shrink-0">
                    <img src={user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-3 w-full">
                    <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-widest">Profile Photo URL</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Paste image URL here..."
                        defaultValue={user?.user_metadata?.avatar_url || ''} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setFirstName(prev => prev); // dummy to trigger re-render? No, I should use a state for avatar
                        }}
                        onBlur={async (e) => {
                          const val = e.target.value;
                          if (val) {
                            await supabase.auth.updateUser({ data: { avatar_url: val } });
                          }
                        }}
                        className="flex-1 bg-surface-container-highest dark:bg-slate-700 rounded-xl px-4 py-2 border-none focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 outline-none text-xs text-on-surface dark:text-white transition-all" 
                      />
                      <button className="px-4 py-2 bg-surface-container-high dark:bg-slate-700 hover:bg-surface-variant dark:hover:bg-slate-600 rounded-xl text-xs font-bold transition-colors text-on-surface dark:text-white">Preview</button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 uppercase tracking-widest">First Name</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-surface-container-highest dark:bg-slate-700 rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 outline-none text-sm text-on-surface dark:text-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 uppercase tracking-widest">Last Name</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-surface-container-highest dark:bg-slate-700 rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 outline-none text-sm text-on-surface dark:text-white transition-all" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 uppercase tracking-widest">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface-container-highest dark:bg-slate-700 rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 outline-none text-sm text-on-surface dark:text-white transition-all" />
                  </div>
                </div>
                <div className="pt-4 flex justify-between items-center">
                  {saveStatus === 'saved' && <span className="text-on-tertiary-container text-xs font-bold">✓ Saved!</span>}
                  {saveStatus === 'error' && <span className="text-error text-xs font-bold">Failed to save</span>}
                  {saveStatus !== 'saved' && saveStatus !== 'error' && <span></span>}
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveAccount} disabled={saveStatus === 'saving'} className="px-6 py-2.5 bg-primary dark:bg-blue-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity text-sm shadow-md disabled:opacity-60">
                    {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="bg-surface-container-lowest dark:bg-slate-800 p-6 lg:p-8 rounded-2xl shadow-sm space-y-6 border border-slate-100 dark:border-slate-700/50">
                <h3 className="font-headline font-bold text-xl text-primary dark:text-white border-b border-surface-variant dark:border-slate-700 pb-4">Display & Preferences</h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <h4 className="font-bold text-primary dark:text-white text-sm">Dark Mode</h4>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400">Toggle dark theme across the application</p>
                    </div>
                    <Toggle checked={darkMode} onChange={setDarkMode} />
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <h4 className="font-bold text-primary dark:text-white text-sm">Compact View</h4>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400">Reduce padding in lists and grids</p>
                    </div>
                    <Toggle checked={compactView} onChange={setCompactView} />
                  </div>
                  <div className="pt-2">
                    <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 uppercase tracking-widest">Default Currency</label>
                    <select 
                      value={currency} 
                      onChange={e => setCurrency(e.target.value as Currency)} 
                      className="w-full bg-surface-container-highest dark:bg-slate-700 rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 outline-none text-sm cursor-pointer text-on-surface dark:text-white transition-all"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="NGN">NGN (₦)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="bg-surface-container-lowest dark:bg-slate-800 p-6 lg:p-8 rounded-2xl shadow-sm space-y-6 border border-slate-100 dark:border-slate-700/50">
                <h3 className="font-headline font-bold text-xl text-primary dark:text-white border-b border-surface-variant dark:border-slate-700 pb-4">Notification Alerts</h3>
                <div className="space-y-1">
                  {[
                    { key: 'renewals', title: 'Upcoming Renewals', desc: 'Get notified 3 days before a subscription renews' },
                    { key: 'priceChanges', title: 'Price Changes', desc: 'Alert me when a subscription price increases' },
                    { key: 'weeklySummary', title: 'Weekly Summary', desc: 'Receive a brief recap every Sunday' },
                    { key: 'dormantWarning', title: 'Dormant Warning', desc: "Alert me if I haven't used a service in 30 days" }
                  ].map((notif) => (
                    <div key={notif.key} className="flex justify-between items-center py-4 border-b border-surface-container-low dark:border-slate-700/50 last:border-0">
                      <div>
                        <h4 className="font-bold text-primary dark:text-white text-sm">{notif.title}</h4>
                        <p className="text-xs text-on-surface-variant dark:text-slate-400">{notif.desc}</p>
                      </div>
                      <Toggle checked={(notifications as any)[notif.key]} onChange={(v) => setNotification(notif.key, v)} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="bg-surface-container-lowest dark:bg-slate-800 p-6 lg:p-8 rounded-2xl shadow-sm space-y-6 border border-slate-100 dark:border-slate-700/50">
                <h3 className="font-headline font-bold text-xl text-primary dark:text-white border-b border-surface-variant dark:border-slate-700 pb-4">Billing & Subscription Plan</h3>
                <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant dark:text-slate-400">Current Plan</span>
                      <h4 className="font-headline text-2xl font-extrabold text-primary dark:text-white mt-1">Pro Plan</h4>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">Unlimited subscriptions tracking</p>
                    </div>
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold px-3 py-1 rounded-full">ACTIVE</span>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-600 flex justify-between items-center">
                    <span className="font-headline font-bold text-lg text-primary dark:text-white">$9.99/mo</span>
                    <button className="text-error font-label text-xs font-bold hover:underline">Cancel Subscription</button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-on-surface dark:text-slate-300">Next billing date</span>
                    <span className="text-sm font-bold text-primary dark:text-white">April 15, 2026</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-on-surface dark:text-slate-300">Payment method</span>
                    <span className="text-sm font-bold text-primary dark:text-white">•••• 4242</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="bg-surface-container-lowest dark:bg-slate-800 p-6 lg:p-8 rounded-2xl shadow-sm space-y-6 border border-slate-100 dark:border-slate-700/50">
                <h3 className="font-headline font-bold text-xl text-primary dark:text-white border-b border-surface-variant dark:border-slate-700 pb-4">Security</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 uppercase tracking-widest">Current Password</label>
                    <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="w-full bg-surface-container-highest dark:bg-slate-700 rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 outline-none text-sm text-on-surface dark:text-white transition-all" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 uppercase tracking-widest">New Password</label>
                    <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="w-full bg-surface-container-highest dark:bg-slate-700 rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 outline-none text-sm text-on-surface dark:text-white transition-all" placeholder="Min. 6 characters" />
                  </div>
                  {pwStatus && pwStatus !== 'saving' && (
                    <p className={`text-xs font-bold ${pwStatus.includes('updated') ? 'text-on-tertiary-container' : 'text-error'}`}>{pwStatus}</p>
                  )}
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handlePasswordChange} disabled={pwStatus === 'saving'} className="px-6 py-2.5 bg-primary dark:bg-blue-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity text-sm shadow-md disabled:opacity-60">
                    {pwStatus === 'saving' ? 'Updating...' : 'Update Password'}
                  </motion.button>
                </div>
                <div className="pt-6 border-t border-surface-variant dark:border-slate-700">
                  <h4 className="font-bold text-error text-sm mb-2">Danger Zone</h4>
                  <p className="text-xs text-on-surface-variant dark:text-slate-400 mb-4">Permanently delete your account and all associated data.</p>
                  <button className="px-6 py-2.5 bg-error text-white font-bold rounded-full text-sm hover:opacity-90 transition-opacity">Delete Account</button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
