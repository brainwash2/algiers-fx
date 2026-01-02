import { supabase } from "@/app/lib/supabase";
import { RefreshCw, Facebook, Twitter, Linkedin, MessageCircle } from "lucide-react";
import CurrencyCarousel from "@/components/currency-carousel"; // Ensure this file 
import AffiliateGrid from "@/components/affiliate-grid";
import AuthModal from "@/components/auth-modal"; // Import the new modal
import { DiscussionEmbed } from 'disqus-react'; // Make sure disqus-react is installed


export const revalidate = 0;

export default async function Home() {
  // 1. FETCH DATA (Backend Logic)
  const { data: rates } = await supabase
    .from('currency_rates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  // Fallback if DB is empty
  const lastUpdate = rates && rates[0] ? new Date(rates[0].created_at).toLocaleString() : 'Just Now';

  // 2. DISQUS CONFIG (Client Logic)
  // IMPORTANT: You must register your site at disqus.com to get a "shortname"
  // For now, we use a demo shortname or you can leave it to test.
  const disqusShortname = "algiers-fx-demo"; 
  const disqusConfig = {
    url: "https://algiers-fx.vercel.app", // Your future URL
    identifier: "home-page",
    title: "Algiers FX Rates"
  };

  return (
    <main className="min-h-screen bg-[#F0F2F5] font-sans text-slate-900">
      
      {/* --- HEADER BAR --- */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        
        {/* Top Strip */}
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

        {/* Main Nav */}
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
          
          {/* THE LOGIN BUTTON */}
          <AuthModal />
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
        
        {/* 1. AD SPACE (Responsive) */}
        <div className="w-full h-[100px] bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-300 text-xs">
           <span className="font-bold tracking-widest">ADVERTISEMENT</span>
           <span>Google AdSense 728x90</span>
        </div>

        {/* 2. CURRENCY CAROUSEL */}
        <section>
           <CurrencyCarousel rates={rates || []} />
        </section>

          {/* --- NEW AFFILIATE SECTION --- */}
          <AffiliateGrid />
        

        {/* 3. INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <RefreshCw size={18} className="text-blue-500"/> Why is it changing?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The Euro has surged due to high demand from vehicle importers. The spread between official and parallel rates is currently at an all-time high.
              </p>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <MessageCircle size={18} className="text-green-500"/> Community Intel
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Traders at Square Port Said report low supply of USD. Expect volatility in the coming 48 hours. Login to share your local rates.
              </p>
           </div>
        </div>

        {/* 4. DISQUS COMMENTS */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-4">
               <h3 className="font-bold text-slate-800">Market Discussion</h3>
            </div>
            <div className="p-6">
                {/* 
                    NOTE: This is the real Disqus component. 
                    It might show errors on localhost if 'shortname' is invalid.
                    Once deployed with a real shortname, it works perfectly.
                */}
                <div className="min-h-[300px]">
                   <p className="text-center text-slate-400 text-sm mb-4">
                     ▼ Comments load below (requires internet) ▼
                   </p>
                   {/* 
                      To make this work:
                      1. Go to disqus.com/admin/create/
                      2. Create a site called "algiers-fx-YOURNAME"
                      3. Replace "algiers-fx-demo" above with your new name.
                   */}
                   {/* <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} /> */}
                   
                   {/* Placeholder for now to prevent React errors until you set up Disqus */}
                   <div className="text-center py-10 bg-slate-50 rounded-lg border-2 border-dashed">
                      <p className="font-bold text-slate-600">Disqus Widget</p>
                      <p className="text-sm text-slate-400">Enable in code by uncommenting line 105</p>
                   </div>
                </div>
            </div>
        </section>

      </div>
    </main>
  );
}