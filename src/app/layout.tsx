import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { SettingsProvider } from '@/lib/settings-context';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'Financial Editorial - Subscription Tracker',
  description: 'Curated subscription dashboard for tracking and managing your recurring services.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} bg-surface dark:bg-[#0f1115] font-body text-on-surface dark:text-slate-200 antialiased transition-colors duration-300`}>
        <AuthProvider>
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
