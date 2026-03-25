-- =============================================
-- Subscription Tracker — Full Supabase Schema
-- Run this in your Supabase SQL Editor (one time)
-- =============================================

-- 1. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'NGN',
  billing_cycle text NOT NULL CHECK (billing_cycle IN ('Monthly', 'Quarterly', 'Annual')),
  category text,
  status text DEFAULT 'Active' CHECK (status IN ('Active', 'Paused', 'Cancelled')),
  start_date date DEFAULT CURRENT_DATE,
  next_renewal date,
  logo_url text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subscriptions" ON public.subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- 2. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('renewal', 'price_change', 'dormant', 'info')),
  is_read boolean DEFAULT false,
  subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- 3. User Settings Table (server-persisted preferences)
CREATE TABLE IF NOT EXISTS public.user_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  dark_mode boolean DEFAULT false,
  compact_view boolean DEFAULT false,
  currency text DEFAULT 'NGN',
  notif_renewals boolean DEFAULT true,
  notif_price_changes boolean DEFAULT true,
  notif_weekly_summary boolean DEFAULT false,
  notif_dormant_warning boolean DEFAULT false,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. Enable Realtime for notifications (live bell updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 5. Auto-calculate next_renewal on insert
CREATE OR REPLACE FUNCTION public.calculate_next_renewal()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.next_renewal IS NULL AND NEW.start_date IS NOT NULL THEN
    CASE NEW.billing_cycle
      WHEN 'Monthly' THEN NEW.next_renewal := NEW.start_date + INTERVAL '1 month';
      WHEN 'Quarterly' THEN NEW.next_renewal := NEW.start_date + INTERVAL '3 months';
      WHEN 'Annual' THEN NEW.next_renewal := NEW.start_date + INTERVAL '1 year';
      ELSE NEW.next_renewal := NEW.start_date + INTERVAL '1 month';
    END CASE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_calculate_renewal
  BEFORE INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_next_renewal();

-- 6. Auto-create user settings row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. Push Subscriptions Table (Web Push)
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, endpoint)
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own push subs" ON public.push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own push subs" ON public.push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own push subs" ON public.push_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own push subs" ON public.push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- 8. Add push_enabled to user_settings
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS push_enabled boolean DEFAULT false;
-- 9. Scheduled Reminders (Cron)
-- To enable scheduling, run this in your Supabase SQL Editor:
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the push-reminders function to run twice daily:
-- Morning reminder at 9:00 AM UTC
-- SELECT cron.schedule('push-reminders-morning', '0 9 * * *', 'SELECT net.http_post(url:=''https://<YOUR-PROJECT-ID>.supabase.co/functions/v1/push-reminders'', headers:=''{"Content-Type": "application/json", "Authorization": "Bearer <YOUR-SERVICE-ROLE-KEY>"}''::jsonb, body:='''')');

-- Evening reminder at 6:00 PM UTC
-- SELECT cron.schedule('push-reminders-evening', '0 18 * * *', 'SELECT net.http_post(url:=''https://<YOUR-PROJECT-ID>.supabase.co/functions/v1/push-reminders'', headers:=''{"Content-Type": "application/json", "Authorization": "Bearer <YOUR-SERVICE-ROLE-KEY>"}''::jsonb, body:='''')');
