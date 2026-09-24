
// Supabase Edge Function: generate-plan
// Deploy: supabase functions deploy generate-plan --no-verify-jwt
// Env: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const NIGERIAN_MEALS_POOL = [
  { slug:'jollof-chicken', name:'Jollof Rice & Chicken', tag:'HIGH PROTEIN', kcal:650, time:45, cost:2800, protein:32, ingredients:[{name:'Long grain rice', qty:'400g', cat:'Grains'}, {name:'Chicken thighs', qty:'600g', cat:'Proteins'}, {name:'Tomato blend', qty:'500ml', cat:'Produce'}] },
  { slug:'ewa-agoyin', name:'Ewa Agoyin & Plantain', tag:'VEGAN', kcal:480, time:30, cost:1200, protein:12, ingredients:[{name:'Honey beans', qty:'300g', cat:'Grains'}, {name:'Plantain', qty:'3 pcs', cat:'Produce'}] },
  { slug:'amala-ewedu', name:'Amala & Ewedu + Gbegiri', tag:'FIBER RICH', kcal:520, time:40, cost:1500, protein:14, ingredients:[{name:'Yam flour', qty:'250g', cat:'Grains'}, {name:'Ewedu leaves', qty:'200g', cat:'Produce'}] },
  { slug:'suya-bowl', name:'Suya Bowl & Jollof', tag:'HIGH PROTEIN', kcal:620, time:25, cost:3200, protein:35, ingredients:[{name:'Beef sirloin', qty:'400g', cat:'Proteins'}, {name:'Yaji spice', qty:'30g', cat:'Spices'}] },
  { slug:'ofada-rice', name:'Ofada Rice & Ayamase', tag:'SPICY', kcal:580, time:50, cost:2600, protein:18, ingredients:[{name:'Ofada rice', qty:'350g', cat:'Grains'}, {name:'Green bell peppers', qty:'200g', cat:'Produce'}] },
  { slug:'moi-moi', name:'Moi Moi & Pap', tag:'LOW FAT', kcal:380, time:60, cost:1100, protein:16, ingredients:[{name:'Beans flour', qty:'300g', cat:'Grains'}] },
  { slug:'egusi-soup', name:'Egusi Soup & Fufu', tag:'KETO FRIENDLY', kcal:590, time:45, cost:2400, protein:28, ingredients:[{name:'Egusi seeds', qty:'200g', cat:'Grains'}, {name:'Ugu leaves', qty:'150g', cat:'Produce'}] },
  { slug:'fried-rice', name:'Nigerian Fried Rice & Turkey', tag:'BALANCED', kcal:600, time:40, cost:2700, protein:30, ingredients:[{name:'Rice', qty:'400g', cat:'Grains'}, {name:'Turkey', qty:'500g', cat:'Proteins'}] },
]

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { user_id, week_start, diet, budget_weekly, servings, avoid, time_per_day } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_KEY')!
    )

    // Get user profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user_id).single()

    // --- AI GENERATION (OpenAI if key exists, else smart heuristic) ---
    let generatedDays:any = {}
    const days = ['mon','tue','wed','thu','fri','sat','sun']
    const budgetPerDay = (budget_weekly || profile?.budget_weekly || 20000) / 7

    // Filter pool by diet & avoid
    let pool = NIGERIAN_MEALS_POOL.filter(m => {
      if (diet === 'vegan' && m.tag !== 'VEGAN') return false
      if (diet === 'high_protein' && m.protein < 25) return false
      if (diet === 'keto' && m.tag !== 'KETO FRIENDLY') return false
      if (avoid && avoid.some((a:string) => m.name.toLowerCase().includes(a.toLowerCase()))) return false
      return true
    })
    if (pool.length < 3) pool = NIGERIAN_MEALS_POOL

    // If OPENAI_API_KEY present, use it for smarter balancing
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (openaiKey) {
      const prompt = `You are Chopti, a Nigerian meal planning AI. User diet:${diet}, budget:${budget_weekly} NGN/week, servings:${servings}, avoid:${avoid}, time per day:${time_per_day}m. Pick 7 dinners from this pool: ${pool.map(p=>p.name).join(', ')}. Balance protein, cost ~${budgetPerDay} per day, variety. Return JSON: {"mon": {"meal_slug":"jollof-chicken", "servings":2}, ... }`
      try {
        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method:'POST',
          headers:{'Authorization':`Bearer ${openaiKey}`, 'Content-Type':'application/json'},
          body: JSON.stringify({ model:'gpt-4o-mini', messages:[{role:'user', content:prompt}], response_format:{type:'json_object'} })
        })
        const aiData = await aiRes.json()
        const content = JSON.parse(aiData.choices[0].message.content)
        // Map AI slugs to full structure
        for (const d of days) {
          const sel = pool.find(p=>p.slug===content[d]?.meal_slug) || pool[Math.floor(Math.random()*pool.length)]
          generatedDays[d] = [{ meal_id: sel.slug, meal_slug: sel.slug, name: sel.name, servings: content[d]?.servings || servings || 2, cost: sel.cost, kcal: sel.kcal, prepped:false }]
        }
      } catch(e){
        console.log('OpenAI failed, fallback heuristic', e)
      }
    }

    // Fallback heuristic if AI not used
    if (Object.keys(generatedDays).length === 0) {
      for (let i=0;i<7;i++){
        const meal = pool[i % pool.length]
        generatedDays[days[i]] = [{ meal_id: meal.slug, meal_slug: meal.slug, name: meal.name, servings: servings||2, cost: meal.cost, kcal: meal.kcal, prepped:false, ingredients: meal.ingredients }]
      }
    }

    const totalCost = Object.values(generatedDays).flat().reduce((s:any, m:any)=> s + (m.cost||0), 0)

    // Upsert meal_plans
    const { data: plan, error } = await supabase.from('meal_plans').upsert({
      user_id,
      week_start,
      days: generatedDays,
      budget_total: totalCost,
      shopping_generated: false
    }, { onConflict: 'user_id,week_start' }).select().single()

    if (error) throw error

    // Generate shopping list aggregated
    const shoppingMap = new Map()
    Object.values(generatedDays).flat().forEach((m:any)=>{
      const full = NIGERIAN_MEALS_POOL.find(p=>p.slug===m.meal_slug)
      full?.ingredients.forEach((ing:any)=>{
        const key = ing.name
        if (!shoppingMap.has(key)) shoppingMap.set(key, {...ing, qty:ing.qty, total_cost: full.cost/3})
        else {
          // aggregate qty naive
          shoppingMap.set(key, {...shoppingMap.get(key), qty: shoppingMap.get(key).qty + ' + ' + ing.qty})
        }
      })
    })
    const shoppingItems = Array.from(shoppingMap.values())

    const { data: shopping } = await supabase.from('shopping_lists').insert({
      user_id,
      plan_id: plan.id,
      items: shoppingItems,
      total_cost: totalCost
    }).select().single()

    // Create notification
    await supabase.from('notifications').insert({
      user_id,
      type: 'plan_generated',
      title: 'Weekly plan generated',
      body: `7 meals • ${Math.round(totalCost/1000*10)/10}k budget • Auto-balanced for ${diet || 'any'} diet`,
      read: false
    })

    // Update onboarding step 2 completed
    await supabase.from('profiles').update({
      onboarding_steps: [true, true, false, false, false]
    }).eq('id', user_id)

    return new Response(JSON.stringify({ plan, shopping, days: generatedDays, message: 'Plan generated' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err:any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
