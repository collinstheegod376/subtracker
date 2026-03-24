"use client";
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSettings } from '@/lib/settings-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { compactView } = useSettings();

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0f1115] transition-colors duration-300">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Header toggleMobile={() => setMobileOpen(true)} />
      {/* Main Content Area — compactView reduces padding */}
      <main className={`lg:ml-64 pt-16 min-h-screen transition-all duration-300 ${compactView ? 'compact-layout' : ''}`}>
        {children}
      </main>
    </div>
  );
}
