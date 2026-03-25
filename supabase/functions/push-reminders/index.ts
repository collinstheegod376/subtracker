import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import * as webpush from "https://esm.sh/web-push@3.6.1";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;

webpush.setVapidDetails(
  "mailto:support@subtracker.app",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    const now = new Date();
    const isMorning = now.getUTCHours() < 12;
    const timeOfDay = isMorning ? "morning" : "evening";

    // 1. Get subscriptions due today OR tomorrow
    // Tomorrow: 1 day before due
    // Today: due date
    const todayStr = now.toISOString().split('T')[0];
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Fetch subscriptions due today or tomorrow
    const { data: dueSubs, error: subError } = await supabase
      .from('subscriptions')
      .select('*, user_id')
      .in('next_renewal', [todayStr, tomorrowStr])
      .eq('status', 'Active');

    if (subError) throw subError;

    for (const sub of dueSubs) {
      const isDueToday = sub.next_renewal === todayStr;
      const title = isDueToday ? `Subscription Due Today!` : `Subscription Renewal Tomorrow`;
      const body = isDueToday 
        ? `Your ${sub.name} subscription (${sub.currency}${sub.amount}) is due today. ${timeOfDay === 'morning' ? 'Ensure you have enough balance.' : 'This is your final reminder for today.'}`
        : `Your ${sub.name} subscription will renew tomorrow for ${sub.currency}${sub.amount}. ${timeOfDay === 'morning' ? 'Heads up!' : 'Just checking in once more.'}`;

      // Get user push registrations
      const { data: registrations } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', sub.user_id);

      if (!registrations) continue;

      for (const reg of registrations) {
        try {
          await webpush.sendNotification(
            {
              endpoint: reg.endpoint,
              keys: {
                p256dh: reg.p256dh,
                auth: reg.auth
              }
            },
            JSON.stringify({
              title,
              body,
              url: `/subscriptions/${sub.id}`
            })
          );
        } catch (err) {
          console.error(`Error sending push to ${reg.endpoint}:`, err);
          // If 410 Gone, remove from DB
          if (err.statusCode === 410) {
            await supabase.from('push_subscriptions').delete().eq('id', reg.id);
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true, count: dueSubs.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
