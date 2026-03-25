"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './auth-context';
import { supabase } from './supabase';
import { subscribeUserToPush, saveSubscriptionToSupabase, unsubscribeFromPush } from './push-service';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'NGN';

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  NGN: '₦',
};

interface SettingsContextType {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  compactView: boolean;
  setCompactView: (v: boolean) => void;
  currency: Currency;
  setCurrency: (v: Currency) => void;
  currencySymbol: string;
  formatAmount: (amount: number) => string;
  notifications: {
    renewals: boolean;
    priceChanges: boolean;
    weeklySummary: boolean;
    dormantWarning: boolean;
    pushNotifications: boolean;
  };
  setNotification: (key: string, value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [darkMode, setDarkModeState] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [currency, setCurrencyState] = useState<Currency>('NGN');
  const [notifications, setNotifications] = useState({
    renewals: true,
    priceChanges: true,
    weeklySummary: false,
    dormantWarning: false,
    pushNotifications: false,
  });

  // Load saved settings (Cloud Sync > LocalStorage)
  useEffect(() => {
    async function loadSettings() {
      if (user) {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (data && !error) {
          setDarkModeState(data.dark_mode);
          setCompactView(data.compact_view);
          setCurrencyState(data.currency as Currency);
          setNotifications({
            renewals: data.notif_renewals,
            priceChanges: data.notif_price_changes,
            weeklySummary: data.notif_weekly_summary,
            dormantWarning: data.notif_dormant_warning,
            pushNotifications: data.push_enabled,
          });
          return;
        }
      }

      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('app-settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.darkMode !== undefined) setDarkModeState(parsed.darkMode);
          if (parsed.compactView !== undefined) setCompactView(parsed.compactView);
          if (parsed.currency) setCurrencyState(parsed.currency);
          if (parsed.notifications) setNotifications(prev => ({ ...prev, ...parsed.notifications }));
        }
      } catch {}
    }
    loadSettings();
  }, [user]);

  // Persist settings
  const persist = useCallback(async (updates?: any) => {
    const finalSettings = { darkMode, compactView, currency, notifications, ...updates };
    localStorage.setItem('app-settings', JSON.stringify(finalSettings));

    if (user) {
      await supabase.from('user_settings').upsert({
        user_id: user.id,
        dark_mode: finalSettings.darkMode,
        compact_view: finalSettings.compactView,
        currency: finalSettings.currency,
        notif_renewals: finalSettings.notifications.renewals,
        notif_price_changes: finalSettings.notifications.priceChanges,
        notif_weekly_summary: finalSettings.notifications.weeklySummary,
        notif_dormant_warning: finalSettings.notifications.dormantWarning,
        push_enabled: finalSettings.notifications.pushNotifications,
        updated_at: new Date().toISOString(),
      });
    }
  }, [darkMode, compactView, currency, notifications, user]);

  // Sync on local change
  useEffect(() => {
    const timer = setTimeout(() => persist(), 1000);
    return () => clearTimeout(timer);
  }, [darkMode, compactView, currency, notifications, persist]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const setDarkMode = (v: boolean) => setDarkModeState(v);
  const setCurrency = (v: Currency) => setCurrencyState(v);

  const currencySymbol = currencySymbols[currency];
  const formatAmount = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const setNotification = async (key: string, value: boolean) => {
    if (key === 'pushNotifications' && value === true) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted' && user) {
          const sub = await subscribeUserToPush();
          await saveSubscriptionToSupabase(sub, user.id);
        } else if (permission !== 'granted') {
          alert('Please enable notifications in your browser settings to receive push alerts.');
          return;
        }
      } catch (err: any) {
        console.error('Push error:', err);
        alert(err.message || 'Failed to enable push notifications');
        return;
      }
    } else if (key === 'pushNotifications' && value === false) {
      await unsubscribeFromPush();
    }
    
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{
      darkMode, setDarkMode,
      compactView, setCompactView,
      currency, setCurrency,
      currencySymbol, formatAmount,
      notifications, setNotification,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
