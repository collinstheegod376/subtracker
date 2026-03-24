"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) {
      setError(error.message || 'Something went wrong');
    } else {
      setSuccess(true);
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold font-headline text-primary dark:text-white">The Editorial</h1>
          <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">Financial Curator</p>
        </div>

        <div className="bg-surface-container-lowest dark:bg-slate-800/80 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/50">
          {success ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <span className="material-symbols-outlined text-on-tertiary-container text-5xl mb-4">check_circle</span>
              <h2 className="text-xl font-bold font-headline text-primary dark:text-white mb-2">Account Created!</h2>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-6">Check your email to verify your account, then sign in.</p>
              <Link href="/login" className="primary-gradient text-white font-bold px-8 py-3 rounded-full inline-block">Go to Login</Link>
            </motion.div>
          ) : (
            <>
              <h2 className="text-2xl font-extrabold font-headline text-primary dark:text-white mb-6 text-center">Create Account</h2>
              
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-error-container text-on-error-container text-xs font-medium px-4 py-3 rounded-xl mb-4">
                  {error}
                </motion.div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 uppercase tracking-widest">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-surface-container-high dark:bg-slate-700 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 outline-none text-on-surface dark:text-white placeholder:text-slate-400 transition-all" placeholder="Alex Rivera" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 uppercase tracking-widest">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface-container-high dark:bg-slate-700 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 outline-none text-on-surface dark:text-white placeholder:text-slate-400 transition-all" placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 uppercase tracking-widest">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-surface-container-high dark:bg-slate-700 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 outline-none text-on-surface dark:text-white placeholder:text-slate-400 transition-all" placeholder="Min. 6 characters" required />
                </div>
                <motion.button whileTap={{ scale: 0.97 }} disabled={loading} className="w-full primary-gradient text-white font-bold py-3 rounded-full mt-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-60">
                  {loading ? 'Creating...' : 'Create Account'}
                </motion.button>
              </form>
              <p className="text-center mt-6 text-sm text-on-surface-variant dark:text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="text-surface-tint dark:text-blue-400 font-bold hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
