import { supabase } from "@/app/lib/supabase";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import CurrencyCarousel from "@/components/currency-carousel";
import AuthModal from "@/components/auth-modal";
import AffiliateGrid from "@/components/affiliate-grid";
import RealComments from "@/components/real-comments";
import Script from 'next/script'; // <--- Import this

export const revalidate = 0;

export default async function Home() {
  // 1. FETCH DATA
  const { data: rates } = await supabase
    .from('currency_rates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  const lastUpdate = rates && rates[0] ? new Date(rates[0].created_at).toLocaleString() : 'Just Now';

  return (
    <main className="min-h-screen bg-[#F0F2F5] font-sans text-slate-900">
      
      {/* --- GOOGLE ANALYTICS INTEGRATION --- */}
      <Script 
        src="https://www.googletagmanager.com/gtag/js?id=G-CYGPG4SS02" 
        strategy="afterInteractive" 
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CYGPG4SS02');
        `}
      </Script>
      {/* ------------------------------------ */}

      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="bg-slate-900 text-slate-300 text-[11px] font-bold py-2 px-4 flex justify-between items-center">
           <div className="flex gap-4 items-center">
              <span className="text-yellow-400">LIVE MARKET DATA</span>
              <span className="hidden md:inline text-slate-500">|</span>
              <span className="hidden md:inline">Last Update: {lastUpdate}</span>
           </div>
           <div className="flex gap-3">
              <Facebook size={14} className="hover:text-white cursor-pointer transition"/>
              <Twitter size={14} className="hover:text-white cursor-pointer transition"/>
              <Linkedin size={14} className="hover:text-white cursor-pointer transition"/>
           </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="bg-yellow-400 w-10 h-10 flex items-center justify-center rounded-lg shadow-md">
                <span className="text-2xl font-black text-white">🇩🇿</span>
             </div>
             <div className="leading-tight">
               <h1 className="text-2xl font-black tracking-tighter text-slate-900">ALGIERS<span className="text-yellow-500">FX</span></h1>
               <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Square Port Said</p>
             </div>
          </div>
          <AuthModal />
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
        
        {/* ADVERTISEMENT PLACEHOLDER */}
        <div className="w-full h-[100px] bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-300 text-xs">
           <span className="font-bold tracking-widest">ADVERTISEMENT</span>
           <span>Google AdSense 728x90</span>
        </div>

        {/* 1. CURRENCY CAROUSEL */}
        <section>
           <CurrencyCarousel rates={rates || []} />
        </section>

        {/* 2. AFFILIATES (Binance/Redotpay) */}
        <AffiliateGrid />

        {/* 3. REAL COMMENTS SYSTEM (Replaces Disqus) */}
        <RealComments />

      </div>
    </main>
  );
}