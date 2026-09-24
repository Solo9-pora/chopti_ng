
"use client"
import { useState } from 'react'
import { mealsData } from '@/lib/data'

export default function Page(){
  const [isLanding, setIsLanding] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(mealsData[0])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [onboarding, setOnboarding] = useState([false,false,false,false,false])
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [billing, setBilling] = useState<'monthly'|'yearly'>('monthly')
  const [toast, setToast] = useState('')
  const triggerToast = (m:string)=>{setToast(m); setTimeout(()=>setToast(''),3000)}

  if(isLanding){
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white">
        <header className="border-b border-[#1E1E22] px-8 py-4 flex justify-between items-center sticky top-0 bg-[#0A0A0B]/80 backdrop-blur z-20">
          <div className="flex items-center gap-8"><span className="font-bold tracking-tight text-[18px]">CHOPTI<span className="text-[#A3FF12]">.</span></span><nav className="hidden md:flex gap-6 mono text-[11px] text-[#8A8A90]"><a href="#pricing" className="hover:text-white">Pricing</a><a className="hover:text-white">Product</a><a className="hover:text-white">Manifesto</a></nav></div>
          <div className="flex gap-3"><button onClick={()=>{setShowAuth(true)}} className="px-4 py-2 rounded-full border border-[#232326] mono text-[12px]">Log in</button><button onClick={()=>setShowAuth(true)} className="px-4 py-2 rounded-full bg-[#A3FF12] text-black font-semibold mono text-[12px]">Sign up - Free</button></div>
        </header>

        <section className="px-8 py-20 grid lg:grid-cols-2 gap-12 max-w-[1440px] mx-auto">
          <div><h1 className="text-[56px] leading-[0.95] font-bold tracking-[-0.03em]">Meal planning,<br/>for real life.</h1><p className="mt-6 text-[#9CA3AF] max-w-[480px]">Auto-balanced Nigerian meals, voice planning, smart shopping. Built like Linear for your kitchen.</p><div className="mt-8 flex gap-3"><button onClick={()=>setShowAuth(true)} className="h-12 px-6 rounded-full bg-white text-black font-semibold">Start Planning - Free</button><button className="h-12 px-6 rounded-full border border-[#232326]">See how it works</button></div><div className="mt-12 mono text-[11px] text-[#4A4A50]">7 meals • 4.2h cooking • ₦14.8k • Auto-balanced</div></div>
          <div className="rounded-[20px] border border-[#1E1E22] bg-[#121214] p-4">
            <div className="space-y-3">{mealsData.map(m=><div key={m.id} onClick={()=>{setIsLanding(false); setSelectedMeal(m)}} className="cursor-pointer p-3 rounded-xl bg-[#18181B] border border-[#1E1E22] flex gap-3 hover:border-[#A3FF12]/30"><div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl" style={{background:`${m.color}22`}}>{m.emoji}</div><div><div className="mono text-[10px] text-[#8A8A90]">{m.tag} • {m.time}</div><div className="text-[13px] font-medium">{m.name}</div></div></div>)}</div>
            <button className="mt-4 w-full h-12 rounded-full bg-[#A3FF12] text-black font-semibold">Voice Plan ⌘V</button>
          </div>
        </section>

        <section id="pricing" className="px-8 py-20 border-t border-[#141417] max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-10"><h2 className="text-[32px] font-bold">Simple pricing</h2><div className="p-1 rounded-full bg-[#18181B] border border-[#1E1E22] flex"><button onClick={()=>setBilling('monthly')} className={`px-4 py-1.5 rounded-full mono text-[11px] ${billing==='monthly'?'bg-white text-black':''}`}>Monthly</button><button onClick={()=>setBilling('yearly')} className={`px-4 py-1.5 rounded-full mono text-[11px] ${billing==='yearly'?'bg-white text-black':''}`}>Yearly -20%</button></div></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[{name:'Free', price:'₦0', feat:['3 meals/week','Basic recipes','Shopping list']},{name:'Pro', price:billing==='monthly'?'₦3,500':'₦2,800', pop:true, feat:['Unlimited meals','Voice planning','Auto-balanced','Pantry sync','Edit images','Cook Mode']},{name:'Family', price:billing==='monthly'?'₦8,500':'₦6,800', feat:['Everything Pro','6 profiles','Family merge','12 servings'] }].map(tier=>(
              <div key={tier.name} className={`rounded-[20px] p-6 border ${tier.pop?'border-[#A3FF12] bg-[#121214] shadow-[0_0_0_1px_#A3FF12]':'border-[#1E1E22] bg-[#121214]'}`}>
                {tier.pop && <span className="mono text-[10px] px-2 py-1 rounded-full bg-[#A3FF12] text-black">MOST POPULAR</span>}
                <div className="mt-4 font-bold">{tier.name}</div><div className="text-[32px] font-bold mt-2">{tier.price}<span className="text-[14px] font-normal text-[#8A8A90]">/mo</span></div>
                <ul className="mt-6 space-y-2 mono text-[12px] text-[#9CA3AF]">{tier.feat.map(f=><li key={f}>✓ {f}</li>)}</ul>
                <button onClick={()=>setShowAuth(true)} className={`mt-6 w-full h-11 rounded-full font-semibold ${tier.pop?'bg-[#A3FF12] text-black':'bg-white text-black'}`}>Go {tier.name}</button>
              </div>
            ))}
          </div>
        </section>

        {showAuth && <div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50 p-4"><div className="w-full max-w-[400px] rounded-[20px] bg-[#18181B] border border-[#2A2A2E] p-6"><h3 className="font-bold text-[18px]">Create your Chopti account</h3><input placeholder="Email" className="mt-4 w-full h-11 px-4 rounded-xl bg-[#0A0A0B] border border-[#232326] mono text-[13px]"/><input placeholder="Password" type="password" className="mt-3 w-full h-11 px-4 rounded-xl bg-[#0A0A0B] border border-[#232326] mono text-[13px]"/><button onClick={()=>{setShowAuth(false); setIsLanding(false); triggerToast('Welcome to Chopti Pro!')}} className="mt-4 w-full h-11 rounded-full bg-[#A3FF12] text-black font-semibold">Continue</button><div className="mt-3 text-center mono text-[11px] text-[#6B7280]">Paystack secure checkout enabled</div><button onClick={()=>setShowAuth(false)} className="mt-3 w-full mono text-[11px] text-[#8A8A90]">Cancel</button></div></div>}
        {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#1C1C1F] border border-[#2A2A2E] text-[13px]">{toast}</div>}
      </div>
    )
  }

  // APP MODE
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col">
      <header className="h-14 border-b border-[#1E1E22] px-6 flex items-center justify-between">
        <div className="flex items-center gap-6"><span className="font-bold">CHOPTI.</span><div className="hidden md:flex gap-4 mono text-[11px]"><span className="text-white">Plan</span><span className="text-[#6B7280]">Recipes</span><span className="text-[#6B7280]">Pantry</span><span className="text-[#6B7280] cursor-pointer" onClick={()=>setShowWhatsApp(true)}>Shopping</span></div></div>
        <div className="flex items-center gap-3"><button onClick={()=>setShowNotifications(true)} className="relative w-8 h-8 rounded-full border border-[#232326] flex items-center justify-center">🔔<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span></button><button onClick={()=>setShowProfile(true)} className="w-8 h-8 rounded-full bg-[#A3FF12] text-black font-bold">W</button></div>
      </header>

      <div className="flex flex-1">
        <div className="w-[220px] border-r border-[#1E1E22] p-4 hidden lg:block">
          <div className="mono text-[10px] text-[#5A5A60] mb-3">THIS WEEK</div>
          {['MON 12','TUE 13','WED 14','THU 15','FRI 16','SAT 17','SUN 18'].map(d=><div key={d} className="h-12 rounded-xl bg-[#18181B] border border-[#1E1E22] mb-2 px-3 flex items-center mono text-[11px]">{d}</div>)}
          <div className="mt-6 p-3 rounded-xl bg-[#A3FF12]/10 border border-[#A3FF12]/20"><div className="mono text-[10px]">ONBOARDING {onboarding.filter(Boolean).length}/5</div>{['Set diet & budget','Generate plan','Check pantry','Prep meal','Share list'].map((s,i)=><div key={s} className="flex gap-2 mt-2 text-[11px]"><input type="checkbox" checked={onboarding[i]} onChange={()=>{const n=[...onboarding]; n[i]=!n[i]; setOnboarding(n); triggerToast(s+' done')}}/><span className={onboarding[i]?'line-through opacity-50':''}>{s}</span></div>)}</div>
        </div>

        <div className="flex-1 p-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-6 max-w-[1440px] mx-auto w-full">
          <div>
            <h2 className="text-[20px] font-bold mb-4">{selectedMeal.name}</h2>
            <div className="rounded-[20px] overflow-hidden border border-[#1E1E22] bg-[#121214]">
              <div className="h-48 flex items-center justify-center text-[64px] relative group" style={{background:`linear-gradient(135deg, ${selectedMeal.color}22, ${selectedMeal.color}44)`}}>{selectedMeal.emoji}<button className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 text-[11px] opacity-0 group-hover:opacity-100 transition">Edit image</button></div>
              <div className="p-5">
                <div className="mono text-[11px] text-[#8A8A90]">{selectedMeal.tag} • {selectedMeal.time} • {selectedMeal.kcal} kcal</div>
                <h3 className="mt-4 font-semibold mono text-[12px]">DETAILED PREPARATION</h3>
                <div className="mt-3 space-y-4">{selectedMeal.steps?.map((step:any,i:number)=><div key={i} className="p-3 rounded-xl bg-[#18181B] border border-[#1E1E22]"><div className="flex gap-2"><span className="w-6 h-6 rounded-full bg-[#A3FF12] text-black text-[11px] flex items-center justify-center font-bold">{i+1}</span><div><div className="font-medium text-[13px]">{step.title} • {step.time}</div><div className="mt-1 text-[12px] text-[#9CA3AF] leading-relaxed">{step.detail}</div>{step.tip && <div className="mt-2 p-2 rounded-lg bg-[#A3FF12]/10 border border-[#A3FF12]/20 text-[11px]">💡 Chef&apos;s tip: {step.tip}</div>}</div></div></div>)}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[20px] border border-[#1E1E22] bg-[#121214] p-5"><div className="font-semibold mono text-[12px]">Shopping List</div><div className="mt-3 space-y-2 mono text-[11px] text-[#9CA3AF]">{selectedMeal.ingredients?.map((ing:any)=><div key={ing.name} className="flex justify-between"><span>{ing.name}</span><span>{ing.qty}</span></div>)}</div><button onClick={()=>setShowWhatsApp(true)} className="mt-4 w-full h-11 rounded-full bg-[#25D366] text-black font-semibold flex items-center justify-center gap-2">↗ Send to WhatsApp</button></div>
            <button onClick={()=>setIsLanding(true)} className="w-full mono text-[11px] text-[#6B7280]">← Back to landing</button>
          </div>
        </div>
      </div>

      {showNotifications && <div className="fixed inset-0 z-40"><div className="absolute inset-0 bg-black/40" onClick={()=>setShowNotifications(false)}></div><div className="absolute right-0 top-0 h-full w-[360px] bg-[#121214] border-l border-[#1E1E22] p-6"><div className="flex justify-between"><span className="font-bold">Notifications</span><button onClick={()=>setShowNotifications(false)}>✕</button></div><div className="mt-6 space-y-3 mono text-[12px]"><div className="p-3 rounded-xl bg-[#18181B] border border-[#1E1E22]"><div className="flex gap-2"><span className="w-2 h-2 bg-[#A3FF12] rounded-full mt-1"></span><div>Shopping list ready • 2m ago<br/><span className="text-[#8A8A90]">7 items • ₦14.8k</span></div></div></div><div className="p-3 rounded-xl bg-[#18181B] border border-[#1E1E22]">Ewa Agoyin expires tomorrow</div><div className="p-3 rounded-xl bg-[#18181B] border border-[#1E1E22]">Prep reminder: Jollof at 6pm</div></div><button className="mt-6 mono text-[11px] text-[#8A8A90]">Mark all read</button></div></div>}

      {showProfile && <div className="fixed inset-0 z-40"><div className="absolute inset-0 bg-black/40" onClick={()=>setShowProfile(false)}></div><div className="absolute right-0 top-0 h-full w-[380px] bg-[#121214] border-l border-[#1E1E22] p-6 overflow-auto"><div className="flex justify-between"><span className="font-bold">Profile</span><button onClick={()=>setShowProfile(false)}>✕</button></div><div className="mt-6 flex items-center gap-4"><div className="w-16 h-16 rounded-full bg-[#A3FF12] text-black flex items-center justify-center text-[24px] font-bold">W</div><div><div className="font-bold">Wiseman Stone</div><div className="mono text-[11px] text-[#8A8A90]">wiseman@chopti.com • Pro</div></div></div><div className="mt-8 space-y-4 mono text-[12px]"><div className="p-3 rounded-xl bg-[#18181B] border border-[#1E1E22]">Diet: High Protein<br/>Budget: ₦20k/week<br/>Allergies: None</div><button onClick={()=>{setOnboarding([false,false,false,false,false]); setShowProfile(false); triggerToast('Onboarding reset')}} className="w-full h-10 rounded-full border border-[#232326]">Show onboarding</button><button onClick={()=>{setShowProfile(false); setIsLanding(true); triggerToast('Logged out')}} className="w-full h-11 rounded-full border border-red-500/30 text-red-400">Log out</button></div></div></div>}

      {showWhatsApp && <div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50 p-4"><div className="w-full max-w-[480px] rounded-[20px] bg-[#18181B] border border-[#2A2A2E] p-6"><div className="flex justify-between"><span className="font-bold">Export to WhatsApp</span><button onClick={()=>setShowWhatsApp(false)}>✕</button></div><textarea className="mt-4 w-full h-48 rounded-xl bg-[#0A0A0B] border border-[#232326] p-3 mono text-[11px]" defaultValue={`*Chopti Shopping - Week*
🥩 Proteins:
- Chicken thighs 600g - ₦4,200
- Honey beans 300g - ₦1,200

🥬 Produce:
- Tomato blend 500ml

Total: ₦14,800

Generated via Chopti`}></textarea><button onClick={()=>{const txt=encodeURIComponent(document.querySelector('textarea')?.value || ''); window.open(`https://wa.me/?text=${txt}`,'_blank'); triggerToast('Opening WhatsApp...'); setShowWhatsApp(false)}} className="mt-4 w-full h-11 rounded-full bg-[#25D366] text-black font-semibold">Open WhatsApp</button><button onClick={()=>{navigator.clipboard.writeText(document.querySelector('textarea')?.value || ''); triggerToast('Copied for WhatsApp')}} className="mt-2 w-full h-11 rounded-full bg-white text-black">Copy</button></div></div>}

      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#1C1C1F] border border-[#2A2A2E] text-[13px] z-50">{toast}</div>}
    </div>
  )
}
