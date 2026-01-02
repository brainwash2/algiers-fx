import { ArrowUpRight, CreditCard, Wallet, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

// 1. CONFIGURATION: PASTE YOUR REFERRAL LINKS HERE
const OFFERS = [
  {
    id: "binance",
    name: "Binance P2P",
    description: "The #1 place to buy/sell USDT in Algeria securely.",
    icon: <TrendingUp className="text-[#F3BA2F]" size={32} />, 
    color: "bg-[#F3BA2F]/10 text-[#F3BA2F] border-[#F3BA2F]",
    buttonColor: "bg-[#1E2329] hover:bg-[#2b313a]",
    link: "https://accounts.binance.com/register?ref=YOUR_BINANCE_ID", // <--- PASTE LINK
    cta: "Trade USDT"
  },
  {
    id: "redotpay",
    name: "Redotpay",
    description: "Get a Virtual Visa Card instantly. Works for Netflix, AliExpress & Ads.",
    icon: <CreditCard className="text-[#FF3B30]" size={32} />,
    color: "bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]",
    buttonColor: "bg-[#FF3B30] hover:bg-[#d63026]",
    link: "https://url.redotpay.com/invite?ref=YOUR_REDOTPAY_ID", // <--- PASTE LINK
    cta: "Get $5 Bonus"
  },
  {
    id: "bitget",
    name: "Bitget P2P",
    description: "Lower fees than Binance. Best alternative for DZD trading.",
    icon: <Wallet className="text-[#00F0FF]" size={32} />,
    color: "bg-[#00F0FF]/10 text-[#009199] border-[#00F0FF]",
    buttonColor: "bg-[#00F0FF] text-slate-900 hover:bg-[#00dceb]",
    link: "https://partner.bitget.com/bg/YOUR_BITGET_ID", // <--- PASTE LINK
    cta: "Sign Up"
  }
];

export default function AffiliateGrid() {
  return (
    <section className="py-2">
      <div className="flex items-center gap-2 mb-4">
         <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded">SPONSORED</span>
         <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recommended Tools</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OFFERS.map((offer) => (
          <div key={offer.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            
            {/* Background decoration */}
            <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${offer.color} opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>

            <div className="flex flex-col h-full justify-between relative z-10">
              <div>
                <div className={`w-12 h-12 rounded-lg ${offer.color} flex items-center justify-center mb-3 border`}>
                  {offer.icon}
                </div>
                <h4 className="font-bold text-lg text-slate-900">{offer.name}</h4>
                <p className="text-sm text-slate-500 mt-1 leading-snug">
                  {offer.description}
                </p>
              </div>
              
              <a href={offer.link} target="_blank" rel="noopener noreferrer" className="mt-4 block">
                <Button className={`w-full ${offer.buttonColor} font-bold`}>
                  {offer.cta} <ArrowUpRight size={16} className="ml-1"/>
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}