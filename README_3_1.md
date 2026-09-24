# Chopti v3 - Next.js + Supabase + Paystack

## Stack
- Next.js 14 App Router
- Tailwind CSS (dark #0A0A0B, lime #A3FF12)
- Supabase Auth + Postgres + RLS
- Paystack Checkout

## Setup

1. Create Supabase project at supabase.com
2. In SQL Editor, run `supabase/schema.sql` (full schema, RLS, trigger for profiles)
3. Copy env:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
NEXT_PUBLIC_PAYSTACK_KEY=pk_test_xxx
```
4. `npm install && npm run dev`

## Auth Flow (implemented in page.tsx)
- Uses `@supabase/ssr` browser client
- `supabase.auth.signUp({email,password})` on signup
- On auth, `profiles` row auto-created via trigger
- `onAuthStateChange` -> setIsLanding(false)

## Data Model
- `meal_plans.days` JSON: { mon: [{meal_id, servings, prepped, custom_image_url}] }
- Custom images uploaded to Supabase Storage bucket `meal-images` (create bucket public)
- Shopping aggregated from plan -> `shopping_lists`
- Notifications realtime via `supabase.channel('notifications')`

## Paystack
```ts
import { payWithPaystack } from '@/lib/paystack'
payWithPaystack({email: user.email, amount: 3500, plan: 'pro', onSuccess: async ()=>{
  await supabase.from('subscriptions').insert({user_id, plan_tier:'pro', amount:3500})
  await supabase.from('profiles').update({plan_tier:'pro'}).eq('id', user_id)
}})
```
Add `<script src="https://js.paystack.co/v1/inline.js"></script>` in layout.tsx head.

## Deploy
Vercel -> add env vars -> deploy. Supabase storage CORS allow Vercel domain.

## WhatsApp Export
No backend needed - uses `wa.me/?text=` with formatted list from shopping_lists.

## Next steps
- Add realtime notifications
- Add edge function for weekly plan generation (OpenAI)
