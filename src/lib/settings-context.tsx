"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

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
  };
  setNotification: (key: string, value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [currency, setCurrencyState] = useState<Currency>('USD');
  const [notifications, setNotifications] = useState({
    renewals: true,
    priceChanges: true,
    weeklySummary: false,
    dormantWarning: false,
  });

  // Load saved settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('app-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.darkMode !== undefined) setDarkModeState(parsed.darkMode);
        if (parsed.compactView !== undefined) setCompactView(parsed.compactView);
        if (parsed.currency) setCurrencyState(parsed.currency);
        if (parsed.notifications) setNotifications(parsed.notifications);
      }
    } catch {}
  }, []);

  // Persist settings to localStorage on change
  const persist = useCallback(() => {
    localStorage.setItem('app-settings', JSON.stringify({ darkMode, compactView, currency, notifications }));
  }, [darkMode, compactView, currency, notifications]);

  useEffect(() => { persist(); }, [persist]);

  // Toggle dark mode on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const setDarkMode = (v: boolean) => setDarkModeState(v);
  const setCurrency = (v: Currency) => setCurrencyState(v);

  const currencySymbol = currencySymbols[currency];

  const formatAmount = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const setNotification = (key: string, value: boolean) => {
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
