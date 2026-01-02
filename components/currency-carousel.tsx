"use client"; // This makes it interactive

import { useState } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Color mapping for each currency
const CURRENCY_CONFIG: any = {
  EUR: { color: "bg-[#FBC02D]", border: "border-[#FBC02D]", name: "EURO", flag: "🇪🇺" },
  USD: { color: "bg-green-600", border: "border-green-600", name: "US DOLLAR", flag: "🇺🇸" },
  GBP: { color: "bg-blue-600", border: "border-blue-600", name: "POUND", flag: "🇬🇧" },
  CAD: { color: "bg-red-600", border: "border-red-600", name: "CA DOLLAR", flag: "🇨🇦" }
};

export default function CurrencyCarousel({ rates }: { rates: any[] }) {
  // We filter only the 4 main currencies
  const supported = ["EUR", "USD", "GBP", "CAD"];
  const data = supported.map(code => {
    const rate = rates.find(r => r.currency_pair === `${code}_DZD`) || { parallel_buy: 0, parallel_sell: 0 };
    return { code, ...rate };
  });

  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % data.length);
  const prev = () => setIndex((prev) => (prev - 1 + data.length) % data.length);

  const current = data[index];
  const config = CURRENCY_CONFIG[current.code];

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      
      {/* LEFT ARROW */}
      <button 
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-2 text-slate-400 hover:text-slate-800 transition"
      >
        <ChevronLeft size={48} />
      </button>

      {/* RIGHT ARROW */}
      <button 
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-2 text-slate-400 hover:text-slate-800 transition"
      >
        <ChevronRight size={48} />
      </button>

      {/* THE MAIN CARD */}
      <div className={`bg-white rounded-xl shadow-2xl overflow-hidden border-t-8 ${config.border} transform transition-all duration-300`}>
        
        {/* Header */}
        <div className={`${config.color} p-4 text-center relative`}>
          <h2 className="text-2xl font-black text-white flex items-center justify-center gap-3 uppercase tracking-wider">
             <span className="text-3xl">{config.flag}</span> 1 {config.name}
          </h2>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className={`${config.color} w-4 h-4 rotate-45`}></div>
          </div>
        </div>

        {/* Prices */}
        <div className="p-8 pt-12 grid grid-cols-2 gap-8 text-center divide-x divide-slate-100">
          
          {/* BUY */}
          <div className="bg-[#FBC02D] text-white py-6 px-2 rounded-lg" style={{ backgroundColor: current.code === 'EUR' ? '#FBC02D' : '#f8fafc' }}>
            <div className={current.code === 'EUR' ? 'text-white' : 'text-slate-800'}>
                <p className="text-5xl font-black tracking-tighter">{current.parallel_buy}</p>
                <p className="text-xs font-bold uppercase mt-2 opacity-80">DZD - Buying Rate</p>
            </div>
          </div>

          {/* SELL */}
          <div className="bg-[#666] text-white py-6 px-2 rounded-lg" style={{ backgroundColor: current.code === 'EUR' ? '#666' : '#f8fafc' }}>
             <div className={current.code === 'EUR' ? 'text-white' : 'text-slate-800'}>
                <p className="text-5xl font-black tracking-tighter">{current.parallel_sell}</p>
                <p className="text-xs font-bold uppercase mt-2 opacity-80">DZD - Selling Rate</p>
             </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100 text-slate-400 text-sm">
           Official Bank Rate: <span className="font-semibold text-slate-600">{current.official_buy} DZD</span>
        </div>
      </div>

    </div>
  );
}