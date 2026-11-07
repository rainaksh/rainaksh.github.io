import React from 'react';
import { BookOpen, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { PlanTier } from '../types';
import { sounds, triggerCelebration } from '../utils/audioCelebration';

interface GuideViewProps {
  onSelectPlan: (plan: PlanTier) => void;
}

export const GuideView: React.FC<GuideViewProps> = ({ onSelectPlan }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3.5 py-1 rounded-full border border-cyan-400/30">
          User Earning & Membership Walkthrough
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          Website Ke Bare Me Pura Guide (Kaise Kaam Karein?)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Step-by-step janiye kaise registration karna hai, UPI se pay karna hai aur har referral par ₹65 se ₹765 tak direct commission kaise lena hai.
        </p>
      </div>

      <div className="space-y-5">
        <div className="p-6 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full btn-3d-amber text-slate-950 font-black text-sm flex items-center justify-center">
              1
            </span>
            <h3 className="text-lg font-black text-white">Step 1: Apna Membership Plan Chuniye</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-11">
            Platform par 3 systems uplabdh hain:
          </p>
          <ul className="pl-11 space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Basic Normal System (₹100):</strong> Minimalist neon-border Digital ID Card. Refer karne par ₹65 instant payout.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Platinum System (₹500):</strong> Platinum Shield holographic card, custom analytics graphs aur CSV export. Refer karne par ₹365 instant payout.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Royal Crown VIP System (₹1000):</strong> Liquid Gold 3D card, golden nameplate profile, crown avatar badge. Refer karne par ₹765 instant payout.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full btn-3d-cyan text-slate-950 font-black text-sm flex items-center justify-center">
              2
            </span>
            <h3 className="text-lg font-black text-white">Step 2: UPI ya Stripe Se Bhugtan Karein</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-11">
            Official UPI ID <code className="text-amber-300 font-mono font-bold">8877490845@spicepay</code> (Vikas Kumar) par pay karein. Payment hone ke baad 12-digit UTR Ref number aur screenshot upload karein.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full btn-3d-emerald text-slate-950 font-black text-sm flex items-center justify-center">
              3
            </span>
            <h3 className="text-lg font-black text-white">Step 3: Unique User ID & Digital ID Card Paayein</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-11">
            Admin verification ke baad aapka account active hoga. Aapko unique format ID (jaise <code className="text-cyan-300 font-mono">RX_2026_XXXXX</code>) aur customized Digital ID Card milega jise aap download kar sakte hain.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full btn-3d-amber text-slate-950 font-black text-sm flex items-center justify-center">
              4
            </span>
            <h3 className="text-lg font-black text-white">Step 4: Dosto Ko Refer Karein & Direct UPI Withdrawal Le</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-11">
            Apna referral link share karein. Har join par instant commission aapke wallet me add hoga jise aap direct apne UPI par withdraw kar sakte hain!
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => {
            sounds.playClick();
            triggerCelebration();
            onSelectPlan('platinum');
          }}
          className="btn-3d-amber px-8 py-3.5 rounded-2xl text-xs font-black inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Abhi Join Karein (Start Now)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
