"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSettings } from '@/lib/settings-context';
import { useAuth } from '@/lib/auth-context';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { compactView } = useSettings();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSupabaseConfigured && !loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (isSupabaseConfigured && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-[#0f1115]">
        <div className="w-8 h-8 rounded-full border-4 border-primary dark:border-blue-400 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (isSupabaseConfigured && !user) {
    return null;
  }

  return (
    <div className="h-[100dvh] bg-surface dark:bg-[#0f1115] transition-colors duration-300 overflow-hidden flex flex-col relative font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Header toggleMobile={() => setMobileOpen(true)} />
      {/* Main Content Area — compactView reduces padding */}
      <main className={`lg:ml-64 pt-16 flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ${compactView ? 'compact-layout' : ''}`}>
        <div className="min-h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
