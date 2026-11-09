import React, { useState } from 'react';
import {
  Crown,
  Shield,
  Zap,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Award,
  Star,
  Check,
  Flame,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { PlanTier } from '../types';
import { DEFAULT_PLANS } from '../services/storage';
import { sounds, triggerCelebration, triggerMegaCelebration } from '../utils/audioCelebration';

interface PlanComparisonChartProps {
  onSelectPlan: (plan: PlanTier) => void;
  className?: string;
}

interface ComparisonRow {
  category: string;
  feature: string;
  tooltip?: string;
  silver: string | boolean;
  platinum: string | boolean;
  royal: string | boolean;
  highlightRoyal?: boolean;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    category: 'Economics & Rewards',
    feature: 'एकमुश्त सदस्यता शुल्क (One-Time Fee)',
    silver: '₹100',
    platinum: '₹500',
    royal: '₹1000',
  },
  {
    category: 'Economics & Rewards',
    feature: 'डायरेक्ट इनवाइट कमीशन (Per Invite Payout)',
    tooltip: 'हर एक डायरेक्ट रेफरल जॉइनिंग पर सीधा आपके UPI पर मिलने वाला नकद कमीशन',
    silver: '₹65',
    platinum: '₹365',
    royal: '₹765 (Highest)',
    highlightRoyal: true,
  },
  {
    category: 'Economics & Rewards',
    feature: 'कमीशन मार्जिन प्रतिशत (Payout Margin %)',
    silver: '65.0%',
    platinum: '73.0%',
    royal: '76.5% (Max Margin)',
    highlightRoyal: true,
  },
  {
    category: 'Economics & Rewards',
    feature: '10 रेफरल करने पर कुल कमाई (10 Invites Earning)',
    silver: '₹650',
    platinum: '₹3,650',
    royal: '₹7,650 (11.7x of ₹100)',
    highlightRoyal: true,
  },
  {
    category: 'Economics & Rewards',
    feature: '20 रेफरल करने पर कुल कमाई (20 Invites Earning)',
    silver: '₹1,300',
    platinum: '₹7,300',
    royal: '₹15,300 (Massive Profit)',
    highlightRoyal: true,
  },
  {
    category: 'Economics & Rewards',
    feature: 'लागत वसूली (Break-Even Speed)',
    tooltip: 'अपनी मूल फीस वापस पाने के लिए जरूरी रेफरल',
    silver: '2 रेफरल (₹130)',
    platinum: '2 रेफरल (₹730)',
    royal: '2 रेफरल (₹1,530 - 153% ROI)',
    highlightRoyal: true,
  },
  {
    category: 'Digital Identity & Cards',
    feature: 'डिजिटल आईडी कार्ड प्रकार (Digital ID Card)',
    silver: 'Neon Minimalist Card',
    platinum: '3D Platinum Hologram Card',
    royal: '3D Liquid Gold Sovereign Crown Card',
    highlightRoyal: true,
  },
  {
    category: 'Digital Identity & Cards',
    feature: 'प्रोफाइल अवतार फ्रेम व बैज (Profile Badge)',
    silver: 'Silver Ring Badge',
    platinum: 'Platinum Shield Frame',
    royal: 'Imperial Golden Crown + Golden Nameplate',
    highlightRoyal: true,
  },
  {
    category: 'Digital Identity & Cards',
    feature: 'क्यूआर कोड सत्यापन व प्राइवेसी इंजन (QR Verification)',
    silver: true,
    platinum: true,
    royal: true,
  },
  {
    category: 'Platform & Technology',
    feature: 'कमीशन भुगतान गति (UPI Payout Priority)',
    silver: '1-2 घंटे में सत्यापन',
    platinum: '30-45 मिनट में सत्यापन',
    royal: '10-30 मिनट में VIP टॉप प्रायोरिटी',
    highlightRoyal: true,
  },
  {
    category: 'Platform & Technology',
    feature: 'विजुअल डाउनलाइन ट्री व एनालिटिक्स (Network Tree)',
    silver: 'बेसिक टेबल लेजर',
    platinum: 'इंटरैक्टिव ट्री + CSV एक्सपोर्ट',
    royal: '3D फुल ट्री + 30-डे रीचार्ट्स एनालिटिक्स',
    highlightRoyal: true,
  },
  {
    category: 'Platform & Technology',
    feature: 'प्रचार केंद्र व वायरल पोस्टर मेकर (Marketing Studio)',
    silver: 'स्टैंडर्ड लिंक',
    platinum: 'कस्टम पोस्टर्स व क्यूआर',
    royal: 'अनलिमिटेड एचडी पोस्टर्स + वीआईपी स्टेटस',
    highlightRoyal: true,
  },
  {
    category: 'Platform & Technology',
    feature: '1-ऑन-1 पर्सनल सपोर्ट (Founder Support)',
    silver: 'स्टैंडर्ड ईमेल सपोर्ट',
    platinum: 'प्रायोरिटी सपोर्ट',
    royal: '24/7 डायरेक्ट WhatsApp एक्सेस (विकास कुमार)',
    highlightRoyal: true,
  },
  {
    category: 'Platform & Technology',
    feature: 'भारत सरकार डायरेक्ट सेलिंग रूल्स 2021 मान्यता',
    silver: true,
    platinum: true,
    royal: true,
  },
];

export const PlanComparisonChart: React.FC<PlanComparisonChartProps> = ({
  onSelectPlan,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'verdict' | 'table' | 'calculator'>('verdict');
  const [calcCount, setCalcCount] = useState<number>(10);

  const handleSelect = (plan: PlanTier) => {
    sounds.playClick();
    if (plan === 'royal') {
      triggerMegaCelebration();
    } else {
      triggerCelebration();
    }
    onSelectPlan(plan);
  };

  return (
    <section id="plan-comparison" className={`space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0B0C10] border-2 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-400/40 mb-2">
            <Sparkles className="w-3.5 h-3.5 fill-amber-300 animate-pulse" />
            <span>₹100 vs ₹500 vs ₹1000 संपूर्ण प्लान तुलना व निष्पक्ष विश्लेषण</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
            प्लान कंपैरिजन चार्ट & कौन सा प्लान सबसे बेस्ट है?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            तीनों प्लान्स की हर एक खासियत, कमाई के आंकड़े, और आरओआई (ROI) का पारदर्शी विश्लेषण ताकि आप सही निर्णय ले सकें।
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 w-full md:w-auto">
          <button
            onClick={() => { sounds.playClick(); setActiveTab('verdict'); }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'verdict'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>👑 बेस्ट प्लान क्या है?</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveTab('table'); }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'table'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>📊 तुलना चार्ट (Matrix)</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveTab('calculator'); }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>💰 कमाई कैलकुलेटर</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: BEST PLAN VERDICT (कौन सा प्लान सबसे बेस्ट है?) ================= */}
      {activeTab === 'verdict' && (
        <div className="space-y-6">
          {/* Main Crown Winner Showcase Box */}
          <div className="relative rounded-3xl bg-gradient-to-b from-amber-950/60 via-slate-900 to-[#0A0D14] border-2 border-amber-400 p-4 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-hidden">
            {/* Top Winner Ribbon */}
            <div className="inline-flex sm:absolute sm:top-0 sm:right-0 bg-gradient-to-l from-amber-400 to-yellow-500 text-slate-950 text-[10px] sm:text-xs font-black uppercase px-4 sm:px-6 py-1 sm:py-1.5 rounded-full sm:rounded-none sm:rounded-bl-2xl shadow-lg items-center gap-1.5 mb-3 sm:mb-0">
              <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>#1 HIGHEST RECOMMENDED PLAN</span>
            </div>

            <div className="max-w-3xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
                  <Crown className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-3xl font-black text-white flex flex-wrap items-center gap-2">
                    <span>सर्वश्रेष्ठ प्लान: ₹1000 रॉयल VIP क्राउन</span>
                    <span className="text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-mono">
                      76.5% Direct Payout
                    </span>
                  </h3>
                  <p className="text-xs text-amber-300 font-semibold mt-0.5 break-words">
                    कम मेहनत में सबसे ज्यादा कमाई देने वाला भारत का सबसे भरोसेमंद एफिलिएट टियर
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200 leading-relaxed">
                <strong className="text-amber-300 text-sm block mb-1">
                  💡 ₹1000 प्लान ही क्यों सबसे बेस्ट है? (Why It Is The Best):
                </strong>
                जब आप किसी को भी अपने रेफरल लिंक से जॉइन कराते हैं, तो मेहनत वही लगती है। लेकिन ₹100 के प्लान में केवल <strong>₹65</strong> मिलते हैं, जबकि ₹1000 के प्लान में <strong>₹765 सीधा आपके बैंक खाते (UPI) में तुरंत ट्रांसफर</strong> होता है। यानी <strong>11.7 गुना ज्यादा कमाई</strong>! सिर्फ 2 इनवाइट्स पर ही आपके ₹1,530 बन जाते हैं।
              </div>

              {/* 4 Pillars of Excellence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-400/30 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <Zap className="w-5 h-5 fill-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">1. सबसे बड़ा ₹765 नकद रिवॉर्ड</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      10 रेफरल = <strong>₹7,650 नकद</strong>। 50 रेफरल = <strong>₹38,250 सीधा UPI पर</strong>।
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-400/30 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">2. सुपरफास्ट लागत वसूली (153% ROI)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      मात्र <strong>2 रेफरल</strong> करते ही पूरी ₹1000 फीस वापस + ₹530 शुद्ध मुनाफा हाथ में।
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-400/30 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">3. Liquid Gold 3D स्मार्ट कार्ड</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      शाही क्राउन सील, गोल्डन नेमप्लेट व VIP अवतार फ्रेम जिससे लोग तुरंत आकर्षित होकर जुड़ते हैं।
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-400/30 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">4. फाउंडर VIP प्राथमिकता व 1-on-1 सपोर्ट</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      विकास कुमार (फाउंडर) द्वारा 10-30 मिनट में टॉप प्रायोरिटी पेआउट और 24/7 WhatsApp मार्गदर्शन।
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => handleSelect('royal')}
                  className="btn-3d-rainbow w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-xl"
                >
                  <Crown className="w-4 h-4 fill-white text-white" />
                  <span>👑 सर्वश्रेष्ठ सिस्टम जॉइन करें (₹1000 रॉयल VIP)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleSelect('platinum')}
                  className="btn-3d-rainbow w-full sm:w-auto px-6 py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md"
                >
                  <span>बजट चॉइस: ₹500 प्लैटिनम</span>
                </button>

                <button
                  onClick={() => handleSelect('silver')}
                  className="btn-3d-rainbow w-full sm:w-auto px-6 py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md"
                >
                  <span>शुरुआती: ₹100 बेसिक</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Summary Cards Comparing All 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 font-mono">ENTRY SYSTEM</span>
                <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded">65% Margin</span>
              </div>
              <h4 className="text-lg font-black text-white">₹100 नॉर्मल सिल्वर</h4>
              <p className="text-xs text-slate-400">
                कॉलेज छात्रों और नए बिगिनर्स के लिए सिर्फ सिस्टम को टेस्ट करने के लिए उपयुक्त।
              </p>
              <div className="pt-2 border-t border-slate-800 text-xs flex justify-between font-bold">
                <span className="text-slate-400">कमीशन:</span>
                <span className="text-emerald-400 font-mono">₹65 / इनवाइट</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#0B0C10] border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 font-mono">MID-SYSTEM</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold">73% Margin</span>
              </div>
              <h4 className="text-lg font-black text-white">₹500 प्लैटिनम शील्ड</h4>
              <p className="text-xs text-slate-300">
                मध्यम बजट में बेहतरीन रिटर्न। अच्छा कार्ड और ₹365 प्रति इनवाइट का सम्मानजनक पेआउट।
              </p>
              <div className="pt-2 border-t border-slate-800 text-xs flex justify-between font-bold">
                <span className="text-slate-400">कमीशन:</span>
                <span className="text-cyan-300 font-mono">₹365 / इनवाइट</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-b from-amber-950/40 to-slate-900 border-2 border-amber-400 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 font-mono">👑 BEST WINNER</span>
                <span className="text-[10px] bg-amber-500/30 text-amber-200 px-2.5 py-0.5 rounded-full font-black">76.5% Max</span>
              </div>
              <h4 className="text-lg font-black text-amber-300">₹1000 रॉयल VIP क्राउन</h4>
              <p className="text-xs text-slate-200 font-medium">
                सबसे ज्यादा कमाई, सबसे तेज पेआउट, 3D गोल्ड कार्ड और अधिकतम ₹765 प्रति इनवाइट।
              </p>
              <div className="pt-2 border-t border-amber-500/30 text-xs flex justify-between font-bold">
                <span className="text-slate-300">कमीशन:</span>
                <span className="text-amber-400 font-mono font-black text-sm">₹765 / इनवाइट</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: FULL COMPARISON MATRIX TABLE ================= */}
      {activeTab === 'table' && (
        <div className="overflow-x-auto rounded-3xl border-2 border-slate-800 bg-[#0B0C10] shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800">
                <th className="p-4 sm:p-5 text-slate-400 font-bold uppercase text-[11px] w-2/5">
                  प्लान विशेषताएँ (Feature Parameters)
                </th>
                <th className="p-4 sm:p-5 text-center border-l border-slate-800/80 w-1/5">
                  <span className="block text-emerald-400 font-mono text-xs font-bold">SYSTEM 1</span>
                  <span className="text-base sm:text-lg font-black text-white">₹100</span>
                  <span className="block text-[10px] text-slate-400">नॉर्मल सिल्वर</span>
                </th>
                <th className="p-4 sm:p-5 text-center border-l border-slate-800/80 bg-cyan-950/20 w-1/5">
                  <span className="block text-cyan-400 font-mono text-xs font-bold">SYSTEM 2</span>
                  <span className="text-base sm:text-lg font-black text-cyan-300">₹500</span>
                  <span className="block text-[10px] text-slate-400">प्लैटिनम शील्ड</span>
                </th>
                <th className="p-4 sm:p-5 text-center border-l border-amber-500/60 bg-amber-500/10 w-1/5 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                    👑 BEST
                  </div>
                  <span className="block text-amber-400 font-mono text-xs font-bold">SYSTEM 3 (VIP)</span>
                  <span className="text-base sm:text-lg font-black text-amber-300">₹1000</span>
                  <span className="block text-[10px] text-amber-200">रॉयल क्राउन</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {COMPARISON_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50 transition">
                  <td className="p-3.5 sm:p-4 text-slate-200 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span>{row.feature}</span>
                    </div>
                    {row.tooltip && (
                      <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                        {row.tooltip}
                      </span>
                    )}
                  </td>

                  {/* Silver */}
                  <td className="p-3.5 sm:p-4 text-center border-l border-slate-800/80 font-mono">
                    {typeof row.silver === 'boolean' ? (
                      row.silver ? (
                        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-slate-300 font-bold">{row.silver}</span>
                    )}
                  </td>

                  {/* Platinum */}
                  <td className="p-3.5 sm:p-4 text-center border-l border-slate-800/80 bg-cyan-950/10 font-mono">
                    {typeof row.platinum === 'boolean' ? (
                      row.platinum ? (
                        <Check className="w-4 h-4 text-cyan-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-cyan-200 font-bold">{row.platinum}</span>
                    )}
                  </td>

                  {/* Royal (Best Highlighted) */}
                  <td
                    className={`p-3.5 sm:p-4 text-center border-l border-amber-500/40 font-mono font-black ${
                      row.highlightRoyal
                        ? 'bg-amber-500/15 text-amber-300 font-bold'
                        : 'bg-amber-500/5 text-amber-200'
                    }`}
                  >
                    {typeof row.royal === 'boolean' ? (
                      row.royal ? (
                        <Check className="w-4 h-4 text-amber-400 mx-auto font-black" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                      )
                    ) : (
                      <span className="text-amber-300 font-black">{row.royal}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Bottom Action Footer */}
            <tfoot className="bg-slate-950 border-t-2 border-slate-800">
              <tr>
                <td className="p-4 sm:p-5 font-black text-white text-xs">
                  <span>तुरंत जॉइन करें:</span>
                </td>
                <td className="p-4 text-center border-l border-slate-800/80">
                  <button
                    onClick={() => handleSelect('silver')}
                    className="btn-3d-rainbow px-3 py-2.5 rounded-xl text-xs font-black w-full shadow"
                  >
                    जॉइन ₹100
                  </button>
                </td>
                <td className="p-4 text-center border-l border-slate-800/80 bg-cyan-950/20">
                  <button
                    onClick={() => handleSelect('platinum')}
                    className="btn-3d-rainbow px-3 py-2.5 rounded-xl text-xs font-black w-full shadow"
                  >
                    जॉइन ₹500
                  </button>
                </td>
                <td className="p-4 text-center border-l border-amber-500/60 bg-amber-500/15">
                  <button
                    onClick={() => handleSelect('royal')}
                    className="btn-3d-rainbow px-3 py-2.5 rounded-xl text-xs font-black w-full shadow-lg"
                  >
                    👑 जॉइन ₹1000 VIP
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* ================= TAB 3: EARNINGS MULTIPLIER CALCULATOR ================= */}
      {activeTab === 'calculator' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0C10] border-2 border-amber-400/80 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                रेफरल अर्निंग कंपैरिजन कैलकुलेटर
              </h3>
              <p className="text-xs text-slate-400">
                चुनें कि आप कितने रेफरल कर सकते हैं और देखें तीनों प्लान्स की कमाई में कितना बड़ा अंतर आता है!
              </p>
            </div>

            {/* Count Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              {[5, 10, 25, 50].map((num) => (
                <button
                  key={num}
                  onClick={() => { sounds.playClick(); setCalcCount(num); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                    calcCount === num
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {num} Invites
                </button>
              ))}
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Silver Output */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase">₹100 नॉर्मल प्लान</span>
              <p className="text-3xl font-black text-slate-300 font-mono">
                ₹{(calcCount * 65).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                {calcCount} x ₹65 (65% Payout)
              </p>
            </div>

            {/* Platinum Output */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-2 text-center">
              <span className="text-[10px] text-cyan-300 font-bold uppercase">₹500 प्लैटिनम प्लान</span>
              <p className="text-3xl font-black text-cyan-300 font-mono">
                ₹{(calcCount * 365).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-cyan-300 font-mono">
                {calcCount} x ₹365 (73% Payout)
              </p>
            </div>

            {/* Royal Output (Winner) */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/60 to-slate-950 border-2 border-amber-400 space-y-2 text-center relative overflow-hidden shadow-xl">
              <div className="absolute top-2 right-2 bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                👑 MAX EARNING
              </div>
              <span className="text-[10px] text-amber-300 font-bold uppercase">₹1000 रॉयल VIP प्लान</span>
              <p className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                ₹{(calcCount * 765).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-amber-200 font-mono font-bold">
                {calcCount} x ₹765 (76.5% Payout)
              </p>
              <p className="text-[10px] text-emerald-400 font-bold pt-1">
                +₹{((calcCount * 765) - (calcCount * 65)).toLocaleString('en-IN')} अतिरिक्त कमाई ₹100 प्लान की तुलना में!
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
