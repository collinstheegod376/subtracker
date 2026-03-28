"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    const { error } = await resetPassword(email);
    setLoading(false);
    
    if (error) {
      setError(error.message || 'Failed to send reset email');
    } else {
      setMessage('Password reset link sent! Check your inbox.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-[#0f1115] p-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full"
      >
        <div className="flex justify-center mb-8">
           <Link href="/login">
            <Image src="/logo.png" alt="SUB TRACK" width={200} height={80} className="h-16 lg:h-20 w-auto object-contain drop-shadow-lg rounded-xl" />
           </Link>
        </div>

        <div className="bg-surface-container-lowest dark:bg-slate-800/80 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/50">
          <h2 className="text-2xl font-extrabold font-headline text-primary dark:text-white mb-2 text-center">Reset Password</h2>
          <p className="text-center text-sm text-on-surface-variant dark:text-slate-400 mb-6 font-medium">Enter your email and we'll send you a link to get back into your account.</p>
          
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-error-container text-on-error-container text-xs font-medium px-4 py-3 rounded-xl mb-4">
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-primary-container text-primary text-xs font-bold px-4 py-3 rounded-xl mb-4">
              {message}
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-high dark:bg-slate-700 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 outline-none text-on-surface dark:text-white placeholder:text-slate-400 transition-all font-medium" 
                placeholder="you@example.com" 
                required
              />
            </div>
            
            <motion.button 
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full primary-gradient text-white font-bold py-3 rounded-full mt-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </motion.button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50 text-center">
            <Link href="/login" className="text-sm font-bold text-primary dark:text-blue-400 hover:underline flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
