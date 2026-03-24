"use client";
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0f1115]">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Header toggleMobile={() => setMobileOpen(true)} />
      {/* Main Content Area */}
      <main className="lg:ml-64 pt-16 min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
