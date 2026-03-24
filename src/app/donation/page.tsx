"use client";
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OPayCard from '@/components/OPayCard';

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
      <motion.div variants={stagger} initial="hidden" animate="show" className="p-4 lg:p-10 pb-20 lg:pb-10 space-y-8 lg:space-y-10">
        <motion.section variants={fadeUp} className="flex flex-col gap-1">
          <h2 className="font-headline text-3xl lg:text-4xl font-extrabold text-primary dark:text-white tracking-tight">Support the Project</h2>
          <p className="font-body text-sm lg:text-base text-on-surface-variant dark:text-slate-400">Keep SUB TRACK alive with a donation or by supporting our sponsors.</p>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* OPay Donation Component */}
          <motion.div variants={fadeUp} className="bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center">
            <div className="mb-6">
              <h4 className="font-headline text-lg lg:text-xl font-bold text-primary dark:text-white">Direct Transfer</h4>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">Send a direct donation via the OPay account below.</p>
            </div>
            <OPayCard />
          </motion.div>

          {/* Google Ads Component */}
          <motion.div variants={fadeUp} className="bg-surface-container-lowest dark:bg-slate-800 rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center items-center relative overflow-hidden min-h-[300px]">
            <div className="absolute top-4 left-6">
              <span className="text-[10px] font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-widest">Sponsored</span>
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
