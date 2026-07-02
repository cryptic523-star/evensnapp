# EventSnap

AI-powered event marketing image generator, rebuilt as a production-ready Next.js 15 SaaS app.

## Stack
- **Next.js 15** (App Router, Server Components, Server Actions)
- **TypeScript**
- **Tailwind CSS** with the original EventSnap dark design tokens (`tailwind.config.ts`)
- **shadcn/ui**-style primitives in `components/ui` (Button, Input, Card, Toast, etc.) built on Radix
- **Framer Motion** for transitions (toasts, results reveal)
- **Supabase**: Auth (email/password + OAuth-ready), Postgres, Storage, Row Level Security
- **OpenAI** (DALL·E 3 + GPT-4o-mini) called only from server-side API routes
- **Stripe** subscriptions (Checkout + webhook scaffold)
- Meta (Instagram/Facebook) & LinkedIn publishing scaffold

## Project structure
```
app/
  (auth)/login, (auth)/signup       — public auth pages + server actions
  (dashboard)/...                   — protected app shell (dashboard, create, library, brand-kit, social, settings, billing)
  api/generate-image                — secure OpenAI image generation (credits-gated)
  api/captions                      — secure GPT caption generation
  api/stripe/checkout, webhook      — subscription billing
  api/social/publish                — publish-to-social scaffold
components/
  ui/                               — shadcn-style design system primitives
  layout/                           — sidebar, logo
  create/, library/, brand-kit/, social/, dashboard/ — feature components
lib/
  supabase/{client,server,admin,middleware}.ts
  openai.ts, stripe.ts, utils.ts
supabase/migrations/0001_init.sql   — full schema, RLS policies, storage buckets
types/                              — Database + domain types
```

## Setup
1. `npm install`
2. Create a Supabase project, then run `supabase/migrations/0001_init.sql` in the SQL editor
   (creates `profiles`, `brand_kits`, `images`, `captions`, `social_accounts`, `publish_jobs`,
   RLS policies, and the `generated-images` / `brand-assets` storage buckets).
3. Copy `.env.example` to `.env.local` and fill in Supabase, OpenAI, and Stripe keys.
4. `npm run dev`

## Notes on what's scaffolded vs. fully wired
- **Auth, image generation, captions, brand kit persistence, image library** are fully wired
  end-to-end against Supabase + OpenAI.
- **Stripe**: checkout session creation and webhook handler are implemented; you need to create
  the Price in Stripe and point `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO` / `STRIPE_WEBHOOK_SECRET` at it.
- **Social publishing**: `social_accounts` table, UI, and `/api/social/publish` route are in place;
  the actual Meta Graph API / LinkedIn UGC API calls are stubbed with a clear TODO — add OAuth
  connect routes (`/api/social/connect/meta`, `/api/social/connect/linkedin`) and fill in the
  provider calls once you have app credentials.
- Run `npm run db:types` after linking the Supabase CLI to regenerate `types/database.ts` from
  the live schema instead of the hand-written version included here.
