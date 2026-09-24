# Chopti — Meal planning, for real life

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/chopti&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_KEY,NEXT_PUBLIC_PAYSTACK_KEY,OPENAI_API_KEY&project-name=chopti&repository-name=chopti)

Live demo: https://chopti.vercel.app

# Chopti v3
Next.js 14 app with landing + app, pricing, onboarding, WhatsApp export, Paystack-ready.

## Run
npm install
npm run dev

## Paystack Integration
In app/page.tsx, replace auth button with Paystack inline:
```
const handler = PaystackPop.setup({key: 'pk_test_...', email, amount: 350000, ...})
```
Set env NEXT_PUBLIC_PAYSTACK_KEY.

Deploy to Vercel.
