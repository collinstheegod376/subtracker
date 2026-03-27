import { supabase } from './supabase';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeUserToPush() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Workers are not supported in this browser');
  }

  if (!VAPID_PUBLIC_KEY || VAPID_PUBLIC_KEY.includes('replace')) {
    throw new Error('Please configure a valid VAPID PUBLIC KEY in your .env file');
  }

  const registration = await navigator.serviceWorker.ready;
  
  // Check for existing subscription
  const existingSub = await registration.pushManager.getSubscription();
  if (existingSub) {
    return existingSub;
  }

  // Create new subscription
  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY.trim())
  };

  const subscription = await registration.pushManager.subscribe(subscribeOptions);
  return subscription;
}

export async function saveSubscriptionToSupabase(subscription: PushSubscription, userId: string) {
  const subJson = subscription.toJSON();
  
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({
      user_id: userId,
      endpoint: subJson.endpoint,
      p256dh: subJson.keys?.p256dh,
      auth: subJson.keys?.auth
    }, { onConflict: 'user_id, endpoint' });

  if (error) throw error;
}

export async function unsubscribeFromPush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await subscription.unsubscribe();
    // In a real app, you'd also remove it from Supabase here
  }
}
