"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message || 'Error updating password');
    } else {
      router.push('/');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-[#0f1115]">
        <div className="w-12 h-12 border-4 border-surface-tint border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-[#0f1115] p-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full"
      >
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="SUB TRACK" width={200} height={80} className="h-16 lg:h-20 w-auto object-contain drop-shadow-lg rounded-xl" />
        </div>

        <div className="bg-surface-container-lowest dark:bg-slate-800/80 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/50">
          <h2 className="text-2xl font-extrabold font-headline text-primary dark:text-white mb-2 text-center">Set New Password</h2>
          <p className="text-sm font-medium text-slate-500 mb-6 text-center">Please enter your new password below to regain access.</p>

          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-error-container text-on-error-container text-xs font-medium px-4 py-3 rounded-xl mb-4">
              {error}
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 uppercase tracking-widest">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-high dark:bg-slate-700 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 outline-none text-on-surface dark:text-white placeholder:text-slate-400 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 uppercase tracking-widest">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-surface-container-high dark:bg-slate-700 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 outline-none text-on-surface dark:text-white placeholder:text-slate-400 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full primary-gradient text-white font-bold py-3 rounded-full mt-4 shadow-lg hover:shadow-xl transition-all disabled:opacity-60 uppercase tracking-widest text-xs"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
