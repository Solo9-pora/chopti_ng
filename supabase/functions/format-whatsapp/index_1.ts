
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
serve(async (req)=>{
  const { items, total, week } = await req.json()
  const grouped:any = {}
  items.forEach((i:any)=>{ if(!grouped[i.cat]) grouped[i.cat]=[]; grouped[i.cat].push(i) })
  let text = `*Chopti Shopping - ${week || 'This Week'}*\n\n`
  for (const [cat, list] of Object.entries(grouped)){
    const emoji = cat==='Proteins'?'🥩':cat==='Produce'?'🥬':cat==='Grains'?'🌾':'🛒'
    text += `${emoji} ${cat}:\n`
    ;(list as any[]).forEach((it:any)=> text += `- ${it.name} ${it.qty||''}\n`)
    text += '\n'
  }
  text += `Total: ₦${total}\n\nGenerated via Chopti`
  const waLink = `https://wa.me/?text=${encodeURIComponent(text)}`
  return new Response(JSON.stringify({text, waLink}), {headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}})
})
