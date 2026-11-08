import React from 'react';
import {
  X,
  Volume2,
  ShieldCheck,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Share2,
  Smartphone,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { DEFAULT_PLANS } from '../services/storage';
import { PlanTier } from '../types';
import { sounds } from '../utils/audioCelebration';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (tier: PlanTier) => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0B0C10] border-2 border-amber-400/80 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.35)] overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 px-5 py-4 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shadow">
              <Volume2 className="w-5 h-5 fill-amber-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/20 px-2 py-0.5 rounded text-slate-950">
                OFFICIAL PLATFORM ANNOUNCEMENT
              </span>
              <h2 className="text-base sm:text-xl font-black leading-tight">
                वेबसाइट की खासियत & किस प्लान में क्या मिलेगा
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-950/20 hover:bg-slate-950/40 flex items-center justify-center text-slate-950 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Platform Highlights / खासियत */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-black text-sm sm:text-base border-b border-slate-800 pb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>1. RainAksh Network की मुख्य खासियत (Key Highlights)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Govt. 2021 Compliant</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Consumer Protection (Direct Selling) Rules 2021 के तहत 100% लीगल, पारदर्शी और शून्य हिडन चार्ज वाला सिस्टम।
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                  <Zap className="w-4 h-4" />
                  <span>Instant Direct UPI Payouts</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  हर रेफरल पर 65% से 76.5% तक का इंस्टेंट कमीशन सीधा आपके UPI ID पर ट्रांसफर किया जाता है।
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <Crown className="w-4 h-4" />
                  <span>3-Tier Smart Digital ID Card</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  हर सदस्य को QR कोड, एंटी-कॉउंटरफीट सील और प्राइवेसी प्रोटेक्शन के साथ डिजिटल आईडी कार्ड मिलता है।
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold">
                  <Smartphone className="w-4 h-4" />
                  <span>Multi-Device Cloud Access</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  मोबाइल, टैबलेट और लैपटॉप पर एक ही आईडी से लॉग-इन करें और अपना लाइव नेटवर्क और कमाई ट्रैक करें।
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
                  <MessageSquare className="w-4 h-4" />
                  <span>1-on-1 Guidance with Admin</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  फाउंडर विकास कुमार के साथ प्राइवेट 1-टू-1 चैट और गाइडेंस सपोर्ट ताकि आपकी अर्निंग लगातार बढ़े।
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                  <Lock className="w-4 h-4" />
                  <span>Official UPI Verification</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  अधिकृत UPI: <strong className="text-amber-400 font-mono">8877490845@spicepay</strong> (विकास कुमार) पर सीधा और सुरक्षित भुगतान।
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: किसमें ज्वाइन करने पर क्या मिलेगा (Plan Breakdown) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-black text-sm sm:text-base border-b border-slate-800 pb-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>2. किस प्लान में ज्वाइन करने पर क्या मिलेगा? (Detailed Rewards Breakdown)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ₹100 Normal Plan */}
              <div className="p-5 rounded-3xl bg-slate-950 border-2 border-emerald-500/80 flex flex-col justify-between shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/40">
                      TIER 1 • NORMAL
                    </span>
                    <span className="text-xl font-black text-white font-mono">₹100</span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white">नॉर्मल बेसिक प्लान</h3>
                    <p className="text-[11px] text-emerald-400 font-bold">₹65 इंस्टेंट डायरेक्ट पेआउट</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <p className="text-xs font-black text-emerald-300">
                      🎁 ज्वाइन करने पर क्या मिलता है:
                    </p>
                    <ul className="mt-2 space-y-1.5 text-[11px] text-slate-300">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Minimalist Neon-Border Digital ID Card</strong> (फोटो व यूनिक आईडी)</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>हर रेफरल पर ₹65 (65%)</strong> सीधा आपके UPI में</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>बेसिक रेफरल ट्रैकर और डाउनलाइन लेजर</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>लाइफटाइम परमानेंट मेंबरशिप आईडी (RNX100...)</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onSelectPlan('silver');
                    onClose();
                  }}
                  className="btn-3d-emerald mt-4 w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5"
                >
                  <span>Join ₹100 Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* ₹500 Platinum Plan */}
              <div className="p-5 rounded-3xl bg-slate-950 border-2 border-cyan-400 flex flex-col justify-between shadow-[0_0_25px_rgba(56,189,248,0.25)] relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-[9px] font-black uppercase px-3 py-0.5 rounded-full shadow">
                  🔥 MOST POPULAR
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black border border-cyan-400/40">
                      TIER 2 • PLATINUM
                    </span>
                    <span className="text-xl font-black text-cyan-300 font-mono">₹500</span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white">प्लैटिनम शील्ड प्लान</h3>
                    <p className="text-[11px] text-cyan-300 font-bold">₹365 इंस्टेंट डायरेक्ट पेआउट</p>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    <p className="text-xs font-black text-cyan-200">
                      🎁 ज्वाइन करने पर क्या मिलता है:
                    </p>
                    <ul className="mt-2 space-y-1.5 text-[11px] text-slate-200">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span><strong>Platinum Shield Hologram ID Card</strong> (होलोग्राफिक शाइन)</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span><strong>हर रेफरल पर ₹365 (73%)</strong> भारी मुनाफा</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span><strong>कस्टम एनालिटिकल चार्ट्स व CSV/PDF रिपोर्ट</strong> एक्सपोर्ट</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>प्राइवेसी टॉगल्स (मोबाइल/कमाई हाइड) व 1-ऑन-1 पर्सनल गाइडेंस टनल</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onSelectPlan('platinum');
                    onClose();
                  }}
                  className="btn-3d-cyan mt-4 w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5"
                >
                  <span>Join ₹500 Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* ₹1000 Royal Crown VIP Plan */}
              <div className="p-5 rounded-3xl bg-slate-950 border-2 border-amber-400 flex flex-col justify-between shadow-[0_0_30px_rgba(245,158,11,0.3)] relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[9px] font-black uppercase px-3 py-0.5 rounded-full shadow">
                  👑 VIP CROWN MATRIX
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-400/40">
                      TIER 3 • VIP CROWN
                    </span>
                    <span className="text-xl font-black text-amber-400 font-mono">₹1000</span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white">रॉयल क्राउन गोल्ड प्लान</h3>
                    <p className="text-[11px] text-amber-300 font-bold">₹765 इंस्टेंट डायरेक्ट पेआउट</p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs font-black text-amber-300">
                      🎁 ज्वाइन करने पर क्या मिलता है:
                    </p>
                    <ul className="mt-2 space-y-1.5 text-[11px] text-slate-200">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>Liquid Gold 3D Digital ID Card</strong> (रॉयल क्राउन सील)</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>हर रेफरल पर ₹765 (76.5%)</strong> सबसे बड़ा कमीशन!</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>Golden Nameplate Profile</strong> और क्राउन अवतार फ्रेम</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>VIP एनालिटिक्स, लाइव अर्निंग टिकर व 24/7 वीआईपी डायरेक्ट सपोर्ट</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onSelectPlan('royal');
                    onClose();
                  }}
                  className="btn-3d-amber mt-4 w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5"
                >
                  <span>Join ₹1000 Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Direct Pay Instruction Box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">सीधा भुगतान प्राप्तकर्ता विवरण (Official Receiver):</p>
                <p className="text-[11px] text-slate-300">
                  UPI ID: <span className="font-mono text-amber-400 font-black">8877490845@spicepay</span> • नाम:{' '}
                  <span className="font-bold text-white">विकास कुमार</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-400 font-bold whitespace-nowrap">
              ✓ 10-30 मिनट में सत्यापन व आईडी सक्रिय
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Government Consumer Protection (Direct Selling) Rules 2021 Compliant
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="btn-3d-dark w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold"
          >
            समझ गया / Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
