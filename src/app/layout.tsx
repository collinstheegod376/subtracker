import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { SettingsProvider } from '@/lib/settings-context';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'SUB TRACK',
  description: 'Manage and analyze your subscriptions. Next-gen monitoring for your spendings.',
  manifest: '/manifest.json',
  themeColor: '#2563eb',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} bg-surface dark:bg-[#0f1115] font-body text-on-surface dark:text-slate-200 antialiased transition-colors duration-300 overflow-x-hidden`}>
        <AuthProvider>
          <SettingsProvider>
            {children}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(
                      function(registration) { console.log('Service Worker registered with scope:', registration.scope); },
                      function(err) { console.log('Service Worker registration failed:', err); }
                    );
                  });
                }
              `,
              }}
            />
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
