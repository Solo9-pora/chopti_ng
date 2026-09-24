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

## Edge Functions

### 1. generate-plan
Deploys your AI meal generation.
```bash
supabase functions deploy generate-plan
supabase secrets set OPENAI_API_KEY=sk-xxx
```

Call from frontend:
```ts
const { data } = await supabase.functions.invoke('generate-plan', {
  body: { user_id: user.id, week_start: '2025-05-12', diet: 'high_protein', budget_weekly: 20000, servings: 2, avoid: ['fish'], time_per_day: 45 }
})
```

### 2. format-whatsapp
Formats shopping list for WhatsApp.

## Storage
Create bucket `meal-images` public. Policy:
```sql
create policy "Public read" on storage.objects for select using (bucket_id='meal-images');
create policy "Users upload" on storage.objects for insert with check (bucket_id='meal-images' AND auth.role()='authenticated');
```
Upload custom meal images:
```ts
const file = input.files[0]
const { data } = await supabase.storage.from('meal-images').upload(`${user.id}/${Date.now()}.jpg`, file)
const { data:{publicUrl} } = supabase.storage.from('meal-images').getPublicUrl(data.path)
// Save publicUrl to meal_plans.days[day][0].custom_image
```
