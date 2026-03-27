"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    // For automatic redirect after 5 seconds
    const timer = setTimeout(() => {
        router.push('/');
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-[#0f1115] p-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full bg-surface-container-lowest dark:bg-slate-800/80 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/50 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
            <span className="material-symbols-outlined text-emerald-500 text-5xl">check_circle</span>
          </div>
        </div>

        <h1 className="text-3xl font-black font-headline text-primary dark:text-white mb-2 tracking-tight">Verification Successful!</h1>
        <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-8 font-medium">Your account has been fully verified. You can now access all features of Sub Tracker.</p>

        <div className="space-y-3">
          <Link 
            href="/" 
            className="w-full primary-gradient text-white font-black py-4 rounded-full shadow-lg hover:shadow-xl transition-all inline-block uppercase tracking-widest text-xs"
          >
            Go to Dashboard
          </Link>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest pt-2">Redirecting in 5 seconds...</p>
        </div>
      </motion.div>
    </div>
  );
}
