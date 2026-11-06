import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { storage } from '../services/storage';
import { BrandLogo } from './BrandLogo';
import { sounds } from '../utils/audioCelebration';

interface FooterProps {
  setActiveView: (view: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView, onOpenAdmin }) => {
  const config = storage.getConfig();

  return (
    <footer className="bg-[#0B0C10] border-t border-slate-800 text-slate-400 text-xs pb-24 lg:pb-8 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-1">
          <BrandLogo size="md" />
          <p className="text-slate-400 text-[11px] leading-relaxed">
            India's most trusted enterprise multi-tier affiliate & verified digital identity card club. Instant 76.5% referral payouts direct to UPI.
          </p>
          <div className="pt-1 flex items-center gap-2 text-[10px] text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Govt. Direct Selling Guidelines (2021) Adherence</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <h4 className="font-black text-white text-xs uppercase tracking-wider">3-System Reseller Margins</h4>
          <ul className="space-y-2 text-[11px]">
            <li className="flex items-center justify-between">
              <span>Basic Normal System (₹100)</span>
              <span className="text-emerald-400 font-bold font-mono">Earn ₹65 Instant</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Platinum Shield System (₹500)</span>
              <span className="text-cyan-400 font-bold font-mono">Earn ₹365 Instant</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Royal Crown VIP System (₹1000)</span>
              <span className="text-amber-400 font-bold font-mono">Earn ₹765 Instant</span>
            </li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <h4 className="font-black text-white text-xs uppercase tracking-wider">Pages & Legal Policy</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <button
                onClick={() => { sounds.playClick(); setActiveView('guide'); }}
                className="hover:text-amber-400 transition"
              >
                Website Earning Guide
              </button>
            </li>
            <li>
              <button
                onClick={() => { sounds.playClick(); setActiveView('faq'); }}
                className="hover:text-amber-400 transition"
              >
                Aksar Puche Jane Wale Sawal (FAQ)
              </button>
            </li>
            <li>
              <button
                onClick={() => { sounds.playClick(); setActiveView('legal'); }}
                className="hover:text-amber-400 transition"
              >
                Privacy Policy & Govt. Rules
              </button>
            </li>
            <li>
              <button
                onClick={() => { sounds.playClick(); setActiveView('contact'); }}
                className="hover:text-amber-400 transition"
              >
                Contact & Support Center
              </button>
            </li>
            <li>
              <button
                onClick={() => { sounds.playClick(); onOpenAdmin(); }}
                className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1 font-bold"
              >
                Control Panel
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-2.5 bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
          <h4 className="font-black text-amber-300 text-xs uppercase tracking-wide">Official UPI Payee Desk</h4>
          <div className="text-[11px] space-y-1.5">
            <p className="text-slate-300">
              <strong className="text-white">Admin / Receiver:</strong> {config.receiverName}
            </p>
            <p className="font-mono text-amber-400 font-black bg-slate-950 p-2 rounded-xl border border-slate-800 text-center">
              UPI: {config.upiId}
            </p>
            <p className="text-slate-400 text-[10px]">
              Direct settlements via GPay, PhonePe, Paytm, BHIM and Stripe.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 mt-8 border-t border-slate-900 text-center text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026 RainAksh Network. All rights reserved. Enterprise Affiliate Matrix.</p>
        <p className="flex items-center gap-1">
          Developed with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Android Mobile by Vikas Kumar
        </p>
      </div>
    </footer>
  );
};
