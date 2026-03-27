"use client";
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function DonationPage() {
  return (
    <DashboardLayout>
      <motion.div variants={stagger} initial="hidden" animate="show" className="p-4 sm:p-6 lg:p-10 pb-20 lg:pb-10 space-y-6 sm:space-y-8 lg:space-y-10">
        <motion.section variants={fadeUp} className="flex flex-col gap-0.5 sm:gap-1">
          <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary dark:text-white tracking-tight">Support the Project</h2>
          <p className="font-body text-xs sm:text-sm lg:text-base text-on-surface-variant dark:text-slate-400">Keep SUB TRACK alive with a donation or by supporting our sponsors.</p>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-2 relative">
          {/* Donation Info */}
          <motion.div variants={fadeUp} className="bg-primary dark:bg-blue-600 rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10">
              <span className="material-symbols-outlined text-3xl mb-4 block opacity-80">volunteer_activism</span>
              <h3 className="font-headline text-2xl font-black mb-3">Help Us Grow</h3>
              <p className="text-sm opacity-80 leading-relaxed mb-6">
                SUB TRACK is a free tool built with passion. Your support helps us maintain servers, add new features, and keep the app running smoothly for everyone.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://github.com/collinstheegod376/subtracker" target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-white/10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">star</span>
                  Star on GitHub
                </a>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-white/10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">share</span>
                  Share App
                </button>
              </div>
            </div>
          </motion.div>

          {/* Google Ads Component */}
          <motion.div variants={fadeUp} className="bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center items-center relative overflow-hidden min-h-[250px] sm:min-h-[300px]">
            <div className="absolute top-3 sm:top-4 left-5 sm:left-6">
              <span className="text-[9px] sm:text-[10px] font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-widest opacity-60">Sponsored</span>
            </div>
            <div className="w-full flex items-center justify-center mt-4 pt-4">
              <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2058540379247198" crossOrigin="anonymous"></script>
              <ins className="adsbygoogle"
                   style={{ display: "block", width: "100%", height: "250px" }}
                   data-ad-client="ca-pub-2058540379247198"
                   data-ad-slot="f08c47fec0942fa0"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
              <script dangerouslySetInnerHTML={{ __html: "(window.adsbygoogle = window.adsbygoogle || []).push({});" }} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
