# 📊 The Editorial — Subscription Tracker

A premium, mobile-optimized subscription tracker built with **Next.js 14**, **Tailwind CSS**, **Framer Motion**, and **Supabase**.

Track all your recurring subscriptions, get renewal notifications, analyze spending patterns, and manage everything from a beautiful dashboard.

---

## ✨ Features

- **Dashboard** — Total spend, daily velocity chart, upcoming renewals, sector breakdown
- **Subscriptions** — Full list with status filtering (All/Active/Paused), pause & delete actions
- **Add Service** — Form that saves directly to Supabase with dynamic currency
- **Analytics** — Annual spend velocity chart, category allocation, savings opportunities
- **Settings** — Dark mode, compact view, currency selector (USD, EUR, GBP, **NGN ₦**), notification toggles
- **Auth** — Login & Signup via Supabase Auth
- **Notifications** — Live bell icon powered by Supabase Realtime
- **Responsive** — Desktop sidebar + mobile hamburger menu

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and paste the contents of `supabase_schema.sql` → click **Run**
3. Go to **Settings → API** and copy your **Project URL** and **anon key**

### 3. Configure Environment Variables

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel

1. Push this project to a **GitHub repository**
2. Go to [vercel.com](https://vercel.com) → **Import Project** → select your repo
3. Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel dashboard
4. Click **Deploy** — done!

---

## 🗂️ Tech Stack

| Layer        | Technology                    |
|-------------|-------------------------------|
| Framework   | Next.js 14 (App Router)       |
| Styling     | Tailwind CSS 3.4              |
| Animations  | Framer Motion 11              |
| Backend/DB  | Supabase (Postgres + Auth)    |
| Icons       | Material Symbols Outlined     |
| Fonts       | Inter + Manrope (Google)      |
| Deployment  | Vercel                        |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx           # Dashboard
│   ├── subscriptions/     # Subscription list
│   ├── add/               # Add new subscription
│   ├── analytics/         # Spending analytics
│   ├── settings/          # App settings
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── components/layout/
│   ├── DashboardLayout.tsx
│   ├── Header.tsx         # Top bar + notification bell
│   └── Sidebar.tsx        # Side navigation
└── lib/
    ├── api.ts             # Supabase API functions
    ├── auth-context.tsx    # Auth state provider
    ├── settings-context.tsx # Settings state provider
    └── supabase.ts        # Supabase client
```

---

## 💱 Currency Support

Switch currency from **Settings → Preferences → Default Currency**:
- USD ($), EUR (€), GBP (£), **NGN (₦)**

All amounts across the app update automatically.

---

## 🔔 Notifications

Notifications are powered by **Supabase Realtime**. The `notifications` table supports types:
- `renewal` — Upcoming subscription renewals
- `price_change` — Price increase alerts
- `dormant` — Unused service warnings
- `info` — General notifications

The bell icon in the header updates live without page refresh.