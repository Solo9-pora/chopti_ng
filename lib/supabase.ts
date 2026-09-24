
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type MealPlan = {
  id: string
  user_id: string
  week_start: string
  days: any // JSON: { mon: [{meal_id, servings, prepped, image_url}] }
  budget_total: number
  created_at: string
}

export type UserProfile = {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  diet: string
  budget_weekly: number
  allergies: string[]
  plan_tier: 'free'|'pro'|'family'
}
