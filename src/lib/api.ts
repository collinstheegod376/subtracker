import { supabase, isSupabaseConfigured } from './supabase';

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: 'Monthly' | 'Quarterly' | 'Annual';
  category: string;
  status: 'Active' | 'Paused' | 'Cancelled';
  start_date: string;
  next_renewal: string | null;
  logo_url: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'renewal' | 'price_change' | 'dormant' | 'info';
  is_read: boolean;
  subscription_id: string | null;
  created_at: string;
}

// ========== Subscriptions ==========

export async function getSubscriptions(): Promise<Subscription[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addSubscription(sub: Omit<Subscription, 'id' | 'created_at' | 'next_renewal'>) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('subscriptions')
    .insert(sub)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSubscription(id: string, updates: Partial<Subscription>) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSubscription(id: string) {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ========== Notifications ==========

export async function getNotifications(): Promise<Notification[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data || [];
}

export async function markNotificationRead(id: string) {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);
  if (error) throw error;
}

export async function markAllNotificationsRead() {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('is_read', false);
  if (error) throw error;
}

// ========== Realtime Notifications ==========

export function subscribeToNotifications(
  userId: string,
  onNewNotification: (notification: Notification) => void
) {
  if (!isSupabaseConfigured) return { unsubscribe: () => {} };
  
  const channel = supabase
    .channel('notifications-realtime')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onNewNotification(payload.new as Notification);
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}
