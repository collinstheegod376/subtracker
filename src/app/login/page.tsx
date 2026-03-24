"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error.message || 'Invalid credentials');
    } else {
      router.push('/');
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
          <h1 className="text-2xl font-extrabold font-headline text-primary dark:text-white">SUB TRACK</h1>
          <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">SO YOU WONT OVER SPEND MADE BY ITACHI.</p>
        </div>

        <div className="bg-surface-container-lowest dark:bg-slate-800/80 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/50">
          <h2 className="text-2xl font-extrabold font-headline text-primary dark:text-white mb-6 text-center">Welcome Back</h2>
          
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-error-container text-on-error-container text-xs font-medium px-4 py-3 rounded-xl mb-4">
              {error}
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-high dark:bg-slate-700 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 outline-none text-on-surface dark:text-white placeholder:text-slate-400 transition-all" 
                placeholder="you@example.com" 
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant dark:text-slate-400 mb-2 uppercase tracking-widest">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-high dark:bg-slate-700 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-surface-tint dark:focus:ring-blue-500 outline-none text-on-surface dark:text-white placeholder:text-slate-400 transition-all" 
                placeholder="••••••••" 
                required
              />
            </div>
            <motion.button 
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full primary-gradient text-white font-bold py-3 rounded-full mt-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>
          <p className="text-center mt-6 text-sm text-on-surface-variant dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-surface-tint dark:text-blue-400 font-bold hover:underline">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
