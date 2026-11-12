import React, { useState } from 'react';
import {
  X,
  Crown,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Star,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { PlanTier, UserProfile } from '../types';
import { DEFAULT_PLANS } from '../services/storage';
import { sounds, triggerCelebration, triggerMegaCelebration } from '../utils/audioCelebration';

interface ThreeSystemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: PlanTier) => void;
  onOpenDetailedMatrix?: () => void;
  currentUser?: UserProfile | null;
}

export const ThreeSystemsModal: React.FC<ThreeSystemsModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  onOpenDetailedMatrix,
  currentUser,
}) => {
  const [selectedPlanTab, setSelectedPlanTab] = useState<PlanTier>('royal');
  const [calcReferrals, setCalcReferrals] = useState<number>(10);

  if (!isOpen) return null;

  const handleJoin = (plan: PlanTier) => {
    sounds.playClick();
    if (plan === 'royal') {
      triggerMegaCelebration();
    } else {
      triggerCelebration();
    }
    onClose();
    onSelectPlan(plan);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sounds.playClick();
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#0B0C10] border-2 border-amber-400/90 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.35)] overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border-b border-amber-500/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>RainAksh 3-सिस्टम सदस्यता प्लान्स एवं विकल्प</span>
                <span className="text-[9px] sm:text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  3 Systems
                </span>
              </h3>
              <p className="text-[10px] text-slate-300 font-mono mt-0.5">
                Government Direct Selling 2021 Compliant • 65% to 76.5% Instant UPI Payout
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition min-h-[40px] min-w-[40px] flex items-center justify-center shadow"
            aria-label="Close Pop-up"
          >
            <X className="w-5 h-5 text-amber-400" />
          </button>
        </div>

        {/* 3-System Selector Pills */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2 bg-slate-950 border-b border-slate-800 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedPlanTab('silver');
            }}
            className={`py-2 px-1 rounded-xl sm:rounded-2xl text-xs font-bold transition flex flex-col items-center justify-center min-h-[46px] ${
              selectedPlanTab === 'silver'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <span className="text-[9px] uppercase font-mono font-bold">System 1</span>
            <span className="text-xs font-black">₹100 नॉर्मल</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setSelectedPlanTab('platinum');
            }}
            className={`py-2 px-1 rounded-xl sm:rounded-2xl text-xs font-bold transition flex flex-col items-center justify-center min-h-[46px] ${
              selectedPlanTab === 'platinum'
                ? 'bg-cyan-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <span className="text-[9px] uppercase font-mono font-bold">System 2</span>
            <span className="text-xs font-black">₹500 प्लैटिनम</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setSelectedPlanTab('royal');
            }}
            className={`py-2 px-1 rounded-xl sm:rounded-2xl text-xs font-bold transition flex flex-col items-center justify-center min-h-[46px] ${
              selectedPlanTab === 'royal'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'text-amber-300 hover:text-white hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <span className="text-[9px] uppercase font-mono font-black flex items-center gap-0.5">
              👑 Best VIP
            </span>
            <span className="text-xs font-black">₹1000 रॉयल</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs text-slate-300 leading-relaxed">
          
          {/* SYSTEM 1 (₹100) */}
          {selectedPlanTab === 'silver' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border-2 border-emerald-500/80 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                      Entry Level System
                    </span>
                    <h4 className="text-lg sm:text-xl font-black text-white">
                      {DEFAULT_PLANS.silver.name}
                    </h4>
                    <p className="text-slate-400 text-[11px]">{DEFAULT_PLANS.silver.hindiName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-emerald-400 font-mono">₹100</span>
                    <span className="block text-[10px] text-slate-400">One-Time Fee</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between font-bold text-emerald-300">
                  <span>रेफरल कैश मार्जिन (Per Invite):</span>
                  <span className="text-lg text-emerald-400 font-black font-mono">₹65 (65% Payout)</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-bold text-white">🎁 इस प्लान में आपको क्या मिलेगा:</p>
                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    {DEFAULT_PLANS.silver.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleJoin('silver')}
                  className="btn-3d-rainbow w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl mt-3 min-h-[46px]"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>{currentUser ? 'View System 1 (₹100)' : 'Join System 1 (₹100)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Earnings Quick Calc */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <p className="text-[11px] text-slate-400">
                  10 रेफरल करने पर कुल कमाई: <strong className="text-emerald-400 font-mono text-sm">₹650 नकद</strong> सीधा UPI पर।
                </p>
              </div>
            </div>
          )}

          {/* SYSTEM 2 (₹500) */}
          {selectedPlanTab === 'platinum' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border-2 border-cyan-400 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">
                      🔥 Most Popular Choice
                    </span>
                    <h4 className="text-lg sm:text-xl font-black text-white">
                      {DEFAULT_PLANS.platinum.name}
                    </h4>
                    <p className="text-slate-300 text-[11px]">{DEFAULT_PLANS.platinum.hindiName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-cyan-300 font-mono">₹500</span>
                    <span className="block text-[10px] text-slate-400">One-Time Fee</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between font-bold text-cyan-200">
                  <span>रेफरल कैश मार्जिन (Per Invite):</span>
                  <span className="text-lg text-cyan-300 font-black font-mono">₹365 (73% Payout)</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-bold text-white">🎁 इस प्लान में आपको क्या मिलेगा:</p>
                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    {DEFAULT_PLANS.platinum.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleJoin('platinum')}
                  className="btn-3d-rainbow w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl mt-3 min-h-[46px]"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>{currentUser ? 'View System 2 (₹500)' : 'Join System 2 (₹500)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Earnings Quick Calc */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <p className="text-[11px] text-slate-400">
                  10 रेफरल करने पर कुल कमाई: <strong className="text-cyan-300 font-mono text-sm">₹3,650 नकद</strong> सीधा UPI पर।
                </p>
              </div>
            </div>
          )}

          {/* SYSTEM 3 (₹1000 - Winner VIP) */}
          {selectedPlanTab === 'royal' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-amber-950/50 via-slate-900 to-[#0B0C10] border-2 border-amber-400 space-y-3 shadow-[0_0_35px_rgba(245,158,11,0.25)] relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-amber-300 font-bold uppercase flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      👑 #1 Best Recommended Plan (76.5% Max Payout)
                    </span>
                    <h4 className="text-lg sm:text-xl font-black text-amber-300">
                      {DEFAULT_PLANS.royal.name}
                    </h4>
                    <p className="text-slate-300 text-[11px]">{DEFAULT_PLANS.royal.hindiName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">₹1000</span>
                    <span className="block text-[10px] text-slate-400">VIP Lifetime</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between font-bold text-amber-200">
                  <span>रेफरल कैश मार्जिन (Per Invite):</span>
                  <span className="text-lg sm:text-xl text-amber-400 font-black font-mono">₹765 (76.5% Max Payout)</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-400/30 text-[11px] text-amber-200">
                  💡 <strong>सर्वश्रेष्ठ क्यों है:</strong> मेहनत वही, लेकिन ₹100 प्लान में केवल ₹65 मिलते हैं जबकि यहाँ <strong>₹765 सीधा आपके बैंक खाते (UPI) में ट्रांसफर</strong> होता है (11.7 गुना ज्यादा कमाई)! मात्र 2 इनवाइट्स पर आपके ₹1,530 बन जाते हैं।
                </div>

                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-bold text-white">🎁 इस प्लान में आपको क्या मिलेगा:</p>
                  <ul className="space-y-1.5 text-[11px] text-slate-200">
                    {DEFAULT_PLANS.royal.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleJoin('royal')}
                  className="btn-3d-rainbow w-full py-4 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-xl mt-3 min-h-[48px]"
                >
                  <Crown className="w-4 h-4 fill-white text-white" />
                  <span>{currentUser ? '👑 View System 3 (₹1000 VIP)' : '👑 Join System 3 (₹1000 VIP)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Earnings Quick Calc */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <p className="text-[11px] text-slate-400">
                  10 रेफरल करने पर कुल कमाई: <strong className="text-amber-400 font-mono text-base font-black">₹7,650 नकद</strong> (+₹7,000 ज्यादा ₹100 प्लान की तुलना में!)
                </p>
              </div>
            </div>
          )}

          {/* Quick Summary Comparison Matrix Table */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>तीनों प्लान्स की त्वरित तुलना (Quick Comparison)</span>
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-1.5">पैरामीटर</th>
                    <th className="py-1.5 text-center text-emerald-400">₹100</th>
                    <th className="py-1.5 text-center text-cyan-300">₹500</th>
                    <th className="py-1.5 text-center text-amber-400 font-bold">₹1000 (VIP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  <tr>
                    <td className="py-1.5 font-sans">कमीशन / इनवाइट</td>
                    <td className="py-1.5 text-center text-emerald-400">₹65 (65%)</td>
                    <td className="py-1.5 text-center text-cyan-300">₹365 (73%)</td>
                    <td className="py-1.5 text-center text-amber-400 font-bold">₹765 (76.5%)</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-sans">10 रेफरल कमाई</td>
                    <td className="py-1.5 text-center">₹650</td>
                    <td className="py-1.5 text-center">₹3,650</td>
                    <td className="py-1.5 text-center text-amber-300 font-bold">₹7,650</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-sans">कार्ड टाइप</td>
                    <td className="py-1.5 text-center font-sans text-[10px]">Neon Card</td>
                    <td className="py-1.5 text-center font-sans text-[10px]">Hologram 3D</td>
                    <td className="py-1.5 text-center font-sans text-[10px] text-amber-300 font-bold">Liquid Gold 3D</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-sans">UPI स्पीड</td>
                    <td className="py-1.5 text-center font-sans text-[10px]">1-2 घंटे</td>
                    <td className="py-1.5 text-center font-sans text-[10px]">30-45 मिनट</td>
                    <td className="py-1.5 text-center font-sans text-[10px] text-emerald-400 font-bold">10-30 मिनट VIP</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Strip */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] shrink-0">
          <span className="text-slate-400">
            Selected: <strong className="text-amber-400 uppercase font-mono">{selectedPlanTab} System</strong>
          </span>
          <button
            onClick={() => handleJoin(selectedPlanTab)}
            className="btn-3d-rainbow px-4 py-2 rounded-xl text-xs font-black shadow"
          >
            {currentUser ? 'View in Dashboard →' : 'Join Now →'}
          </button>
        </div>
      </div>
    </div>
  );
};
