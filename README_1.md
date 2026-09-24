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
