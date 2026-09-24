
export function payWithPaystack({email, amount, plan, onSuccess}:{email:string, amount:number, plan:string, onSuccess:()=>void}){
  // @ts-ignore
  const handler = (window as any).PaystackPop?.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
    email,
    amount: amount*100, // kobo
    currency: 'NGN',
    metadata: { plan },
    callback: function(response:any){ onSuccess(); console.log(response) },
    onClose: function(){ console.log('closed') }
  })
  handler?.openIframe()
}
