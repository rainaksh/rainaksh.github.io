import React, { useState } from 'react';
import {
  Crown,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap,
  Users,
  Wallet,
  Smartphone,
  CreditCard,
  QrCode,
  DollarSign,
  ChevronRight,
  ShieldAlert,
  Flame,
  ShoppingBag,
} from 'lucide-react';
import { PlanTier, PlanConfig } from '../types';
import { DEFAULT_PLANS, storage } from '../services/storage';
import { PlanExplanationSlider } from '../components/PlanExplanationSlider';
import { PlanComparisonChart } from '../components/PlanComparisonChart';
import { sounds, triggerCelebration } from '../utils/audioCelebration';

interface HomeViewProps {
  onSelectPlan: (plan: PlanTier) => void;
  onOpenVerify: () => void;
  setActiveView: (view: string) => void;
  onOpenAnnouncementModal?: () => void;
  onOpenReferralStudio?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectPlan,
  onOpenVerify,
  setActiveView,
  onOpenAnnouncementModal,
  onOpenReferralStudio,
}) => {
  const config = storage.getConfig();
  const [calcReferrals, setCalcReferrals] = useState<number>(10);
  const [calcPlan, setCalcPlan] = useState<PlanTier>('platinum');

  const selectedCalcPlan = DEFAULT_PLANS[calcPlan];
  const totalEarnings = calcReferrals * selectedCalcPlan.referralCommission;

  return (
    <div className="space-y-8 sm:space-y-10 pb-14">
      {/* 0. NEW USER COMPREHENSIVE WELCOME BANNER (स्वागत संदेश & प्लेटफ़ॉर्म परिचय) */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-6">
        <div className="p-4 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-950/70 via-[#0B0F19] to-cyan-950/70 border-2 border-amber-400/90 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.2)] space-y-4 relative overflow-hidden">
          
          {/* Top Tag & Main Welcome Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-amber-500/30 pb-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/25 to-yellow-500/20 text-amber-300 border border-amber-400/50 text-[10px] sm:text-xs font-black shadow-sm">
                <Crown className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
                <span>स्वागतम • WELCOME TO RAINAKSH NETWORK</span>
              </div>
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-black text-white leading-tight">
                नमस्ते! <span className="text-amber-300">रेनाक्ष नेटवर्क</span> में आपका हार्दिक स्वागत है
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-xl border border-emerald-400/40 font-mono">
                ✓ 100% लीगल व सुरक्षित
              </span>
            </div>
          </div>

          {/* Core Introduction: यहाँ क्या है और आपको क्या मिलेगा? */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            
            {/* Box 1: यहाँ क्या है? (What is this platform?) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-2">
              <h3 className="text-xs sm:text-sm font-black text-cyan-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>यहाँ क्या है? (यह प्लेटफ़ॉर्म क्या है?)</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed">
                रेनाक्ष नेटवर्क भारत का पहला पारदर्शी <strong>3-सिस्टम डिजिटल पहचान पत्र (Digital ID Passport) व डायरेक्ट एफिलिएट रिवॉर्ड नेटवर्क</strong> है। यह भारत सरकार के <strong>उपभोक्ता संरक्षण (डायरेक्ट सेलिंग) नियम 2021</strong> के सभी दिशा-निर्देशों के तहत पूरी तरह वैधानिक रूप से संचालित है।
              </p>
              <ul className="text-[10px] sm:text-[11px] text-slate-300 space-y-1 pt-1 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>कोई धोखाधड़ी या फर्जी वादे नहीं — सीधा बैंक/UPI लेन-देन।</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>हर सदस्य को गैर-संशोधन योग्य स्थायी यूजर आईडी (जैसे RNX1000VK01)।</span>
                </li>
              </ul>
            </div>

            {/* Box 2: यहाँ आपको क्या मिलेगा? (What will you get?) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-2">
              <h3 className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>यहाँ आपको क्या मिलेगा? (आपके लाभ)</span>
              </h3>
              <ul className="text-[10.5px] sm:text-xs text-slate-200 space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold shrink-0">1.</span>
                  <span><strong>प्रमाणित डिजिटल आईडी कार्ड:</strong> सरकारी सुरक्षा मास्किंग युक्त आजीवन वैध डिजिटल कार्ड जिसे आप कहीं भी शेयर या डाउनलोड कर सकते हैं।</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold shrink-0">2.</span>
                  <span><strong>76.5% तक सीधा यूपीआई कमीशन:</strong> अपने इनवाइट लिंक से किसी को जोड़ने पर हर बार <strong>₹65, ₹365 या ₹765</strong> सीधा आपके खाते में!</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold shrink-0">3.</span>
                  <span><strong>मल्टी-डिवाइस लॉगिन व डैशबोर्ड:</strong> अपने मोबाइल और कंप्यूटर पर रियल-टाइम वॉलेट, नॉमिनी सुरक्षा और टीम नेटवर्क ट्रैकिंग।</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3 Easy Steps to Start (शुरुआत कैसे करें?) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800">
            <h4 className="text-[11px] sm:text-xs font-black text-slate-200 mb-2.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>प्लेटफ़ॉर्म शुरू करने के 3 आसान चरण (How to Get Started):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-black text-xs flex items-center justify-center shrink-0">1</span>
                <span className="text-[10.5px] sm:text-xs text-slate-300 font-bold">अपना पसंदीदा प्लान चुनें (₹100, ₹500 या ₹1000)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-mono font-black text-xs flex items-center justify-center shrink-0">2</span>
                <span className="text-[10.5px] sm:text-xs text-slate-300 font-bold">स्पॉन्सर आईडी दर्ज करें (या संस्थापक आईडी से जुड़ें)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-black text-xs flex items-center justify-center shrink-0">3</span>
                <span className="text-[10.5px] sm:text-xs text-slate-300 font-bold">यूपीआई भुगतान पूरा कर डिजिटल आईडी पाएं व तुरंत कमाई शुरू करें!</span>
              </div>
            </div>
          </div>

          {/* Action CTAs in Welcome Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
            <p className="text-[10px] sm:text-[11px] text-slate-400">
              💡 किसी भी सहायता के लिए हमारे आधिकारिक टेलीग्राम <strong className="text-cyan-300 font-mono">@rainaksh</strong> या ईमेल <strong className="text-amber-300 font-mono">accaiwork@gmail.com</strong> पर संपर्क करें।
            </p>
            <button
              onClick={() => {
                sounds.playClick();
                onSelectPlan('platinum');
              }}
              className="btn-3d-rainbow w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 shrink-0 shadow-lg"
            >
              <Zap className="w-4 h-4 fill-white shrink-0" />
              <span>अभी अपनी सदस्यता चुनें (Join Now)</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </section>

      {/* Prominent Official Announcement Showcase Card */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-6">
        <div className="p-4 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-950/70 via-[#0B0C10] to-cyan-950/70 border-2 border-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.25)] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl min-w-0">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs font-black border border-amber-400/40">
                <Sparkles className="w-3.5 h-3.5 fill-amber-300 animate-pulse shrink-0" />
                <span className="break-words leading-tight">📢 महत्वपूर्ण सूचना • आधिकारिक प्लेटफ़ॉर्म घोषणा</span>
              </div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-white leading-snug break-words">
                वेबसाइट की खासियत & किस प्लान में जॉइन करने पर क्या मिलेगा?
              </h2>
              <p className="text-[11px] sm:text-sm text-slate-300 leading-relaxed break-words">
                RainAksh Network 100% Government Direct Selling Rules 2021 के अनुरूप प्रमाणित है। यहाँ किसी बिचौलिए के बिना सीधा{' '}
                <strong className="text-amber-300 font-bold">8877490845@spicepay (विकास कुमार)</strong> पर भुगतान और हर रेफरल पर त्वरित UPI कमीशन मिलता है।
              </p>
            </div>

            {onOpenAnnouncementModal && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenAnnouncementModal();
                }}
                className="btn-3d-amber w-full lg:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shrink-0 shadow-lg min-h-[44px]"
              >
                <Zap className="w-4 h-4 fill-slate-950 shrink-0" />
                <span>पूरा विवरण देखें (Full Guide)</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            )}
          </div>

          {/* 3 Quick Reward Highlights in Announcement */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-800/80">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-emerald-400">₹100 नॉर्मल प्लान</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] sm:text-xs">₹65 Payout</span>
              </div>
              <p className="text-[10.5px] sm:text-[11px] text-slate-300 break-words">
                🎁 <strong>क्या मिलेगा:</strong> मिनिमलिस्ट नियॉन डिजिटल कार्ड + <strong>65% डायरेक्ट पेआउट</strong> हर इनवाइट पर!
              </p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-400/50 space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-cyan-300">₹500 प्लैटिनम प्लान</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 font-mono text-[10px] sm:text-xs">₹365 Payout</span>
              </div>
              <p className="text-[10.5px] sm:text-[11px] text-slate-300 break-words">
                🎁 <strong>क्या मिलेगा:</strong> होलोग्राफिक डिजिटल कार्ड + कस्टम एनालिटिक्स व <strong>73% भारी पेआउट</strong>!
              </p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-amber-400/50 space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-amber-400">₹1000 रॉयल क्राउन VIP</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 font-mono text-[10px] sm:text-xs">₹765 Payout</span>
              </div>
              <p className="text-[10.5px] sm:text-[11px] text-slate-300 break-words">
                🎁 <strong>क्या मिलेगा:</strong> 3डी लिक्विड गोल्ड कार्ड, गोल्डन क्राउन अवतार बैज व <strong>76.5% उच्चतम पेआउट</strong>!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-2 pb-6 sm:pt-8 sm:pb-14 max-w-7xl mx-auto px-2 sm:px-6">
        {/* Ambient neon & gold aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-3.5 sm:space-y-5">
          {/* Animated badge - NO TRUNCATE, complete text on all mobile screens */}
          <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-950/90 via-slate-900 to-amber-950/80 border border-amber-400/50 text-amber-300 text-[10px] sm:text-xs font-black shadow-[0_0_25px_rgba(245,158,11,0.3)] max-w-full text-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="tracking-wide break-words text-center leading-snug">
              रेनाक्ष नेटवर्क • 3-सिस्टम डिजिटल पहचान व एफिलिएट मैट्रिक्स
            </span>
          </div>

          {/* Main Headline in Devanagari Hindi - Perfectly Scaled for Mobile */}
          <h1 className="text-xl xs:text-2xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight leading-snug sm:leading-tight max-w-4xl mx-auto font-sans break-words px-1">
            अपना स्थायी <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-400 bg-clip-text text-transparent">डिजिटल आईडी कार्ड</span> प्राप्त करें और <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">76.5% तक त्वरित यूपीआई भुगतान</span> पाएं!
          </h1>

          <p className="text-[11px] xs:text-xs sm:text-sm lg:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed break-words px-2">
            भारत सरकार डायरेक्ट सेलिंग नियम 2021 प्रमाणित सुरक्षित नेटवर्क। 3 आसान सिस्टम (₹100, ₹500, ₹1000) में से चुनें और हर सीधी जॉइनिंग पर तुरंत{' '}
            <strong className="text-amber-300 font-black">₹65, ₹365 या ₹765 का सीधा यूपीआई भुगतान</strong> प्राप्त करें!
          </p>

          {/* 3D Tactile CTA Buttons - Auto-Adjusting & Tactile */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 pt-1 sm:pt-2 w-full max-w-lg mx-auto px-1 sm:px-0">
            <button
              onClick={() => {
                sounds.playClick();
                triggerCelebration();
                onSelectPlan('platinum');
              }}
              className="btn-3d-amber w-full sm:w-auto px-5 sm:px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 tracking-wide min-h-[46px] shadow-lg leading-tight text-center"
            >
              <Zap className="w-4 h-4 fill-slate-950 shrink-0" />
              <span className="break-words text-center">सदस्यता प्लान देखें व जुड़ें (Starts ₹100)</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onOpenVerify();
              }}
              className="btn-3d-dark w-full sm:w-auto px-4 sm:px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 min-h-[46px] leading-tight text-center"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="break-words text-center">किसी भी सदस्य का डिजिटल कार्ड सत्यापित करें</span>
            </button>
          </div>

          {/* Quick Metric Tile Boxes - Complete, Clear Text with ZERO Truncation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-4xl mx-auto pt-3 sm:pt-6 px-1 sm:px-0">
            <div className="network-tile p-2.5 sm:p-3.5 text-center flex flex-col justify-between min-h-[92px] sm:min-h-[105px]">
              <span className="text-[9px] xs:text-[10px] uppercase font-bold text-slate-400 block leading-tight break-words">
                त्वरित रिवॉर्ड (REWARD)
              </span>
              <p className="text-base xs:text-lg sm:text-2xl font-black text-amber-400 font-mono my-0.5 leading-tight">
                ₹65 - ₹765
              </p>
              <span className="text-[9px] xs:text-[10px] text-emerald-400 font-bold block leading-tight break-words">
                प्रति इनवाइट नकद UPI
              </span>
            </div>

            <div className="network-tile p-2.5 sm:p-3.5 text-center flex flex-col justify-between min-h-[92px] sm:min-h-[105px]">
              <span className="text-[9px] xs:text-[10px] uppercase font-bold text-slate-400 block leading-tight break-words">
                यूपीआई स्पीड (SPEED)
              </span>
              <p className="text-base xs:text-lg sm:text-2xl font-black text-cyan-400 font-mono my-0.5 leading-tight">
                10-30 मिनट
              </p>
              <span className="text-[9px] xs:text-[10px] text-slate-300 font-bold block leading-tight break-words">
                विकास कुमार (फाउंडर)
              </span>
            </div>

            <div className="network-tile p-2.5 sm:p-3.5 text-center flex flex-col justify-between min-h-[92px] sm:min-h-[105px]">
              <span className="text-[9px] xs:text-[10px] uppercase font-bold text-slate-400 block leading-tight break-words">
                सरकारी मान्यता
              </span>
              <p className="text-base xs:text-lg sm:text-2xl font-black text-emerald-400 font-mono my-0.5 leading-tight">
                100% लीगल
              </p>
              <span className="text-[9px] xs:text-[10px] text-emerald-400 font-bold block leading-tight break-words">
                डायरेक्ट सेलिंग नियम 2021
              </span>
            </div>

            <div className="network-tile p-2.5 sm:p-3.5 text-center flex flex-col justify-between min-h-[92px] sm:min-h-[105px]">
              <span className="text-[9px] xs:text-[10px] uppercase font-bold text-slate-400 block leading-tight break-words">
                डिजिटल पहचान पत्र
              </span>
              <p className="text-base xs:text-lg sm:text-2xl font-black text-white font-mono my-0.5 leading-tight">
                3 सिस्टम
              </p>
              <span className="text-[9px] xs:text-[10px] text-amber-300 font-bold block leading-tight break-words">
                आजीवन स्मार्ट कार्ड
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Slide Walkthrough Slider: What is it, What you get, When & How much (Hindi & English) */}
      <PlanExplanationSlider
        onSelectPlan={onSelectPlan}
        onOpenVerify={onOpenVerify}
        onOpenReferralStudio={onOpenReferralStudio}
      />

      {/* 3-System Pricing Grid */}
      <section id="plans" className="max-w-7xl mx-auto px-3 sm:px-6 space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2.5 sm:gap-3 border-b border-slate-800 pb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400 shrink-0" />
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-white leading-tight break-words">
                रेनाक्ष 3-सिस्टम सदस्यता प्लान्स एवं रेफरल मार्जिन
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 break-words">
              जैसा प्लान आप शेयर करेंगे, उतना बड़ा नकद कमीशन तुरंत आपके बैंक (UPI) खाते में क्रेडिट होगा।
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs font-bold border border-emerald-500/30 shrink-0">
            ✓ 0% कटौती • 100% पारदर्शी
          </span>
        </div>

        {/* 3 Horizontal Slider/Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {/* System 1: ₹100 Normal System */}
          <div className="rounded-3xl bg-[#0B0C10] border-2 border-emerald-500/80 p-4 sm:p-6 flex flex-col justify-between shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:border-emerald-400 transition-all">
            <div className="space-y-3.5 sm:space-y-4">
              {/* Flashing badge */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-black border border-emerald-400/50 flex items-center gap-1 animate-pulse">
                  <Zap className="w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0" />
                  <span>💥 ₹65 त्वरित इनाम</span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">SYSTEM 1</span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">{DEFAULT_PLANS.silver.name}</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{DEFAULT_PLANS.silver.hindiName}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">₹100</span>
                <span className="text-[11px] sm:text-xs text-slate-400">एकमुश्त / आजीवन आईडी</span>
              </div>

              {/* Reseller Margin Breakdown */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-emerald-300">
                  <span>आपका रेफरल मार्जिन:</span>
                  <span className="text-base sm:text-lg text-emerald-400 font-black font-mono">₹65 (65%)</span>
                </div>
                <p className="text-[10px] text-emerald-300/80 break-words">
                  10 दोस्तों को जॉइन कराने पर सीधे ₹650 आपके UPI पर।
                </p>
              </div>

              <ul className="space-y-2 text-[11px] sm:text-xs text-slate-300 pt-1">
                {DEFAULT_PLANS.silver.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="break-words">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                triggerCelebration();
                onSelectPlan('silver');
              }}
              className="btn-3d-rainbow mt-5 sm:mt-6 w-full py-3.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-lg min-h-[44px]"
            >
              <Zap className="w-4 h-4 fill-white shrink-0" />
              <span>सिस्टम 1 (₹100 नॉर्मल) जॉइन करें</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>

          {/* System 2: ₹500 Platinum System */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#0B0C10] border-2 border-cyan-400 p-4 sm:p-6 flex flex-col justify-between shadow-[0_15px_35px_rgba(56,189,248,0.3)] ring-2 ring-cyan-400/30 transform md:-translate-y-2">
            {/* Shopsy style Best Seller Ribbon */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 font-black text-[9px] sm:text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-lg whitespace-nowrap">
              🔥 सबसे लोकप्रिय पसंद
            </div>

            <div className="space-y-3.5 sm:space-y-4">
              <div className="flex items-center justify-between pt-1">
                <span className="px-2.5 sm:px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] sm:text-xs font-black border border-cyan-400/50 flex items-center gap-1">
                  <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0" />
                  <span>💥 ₹365 त्वरित इनाम</span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-cyan-400 font-mono font-bold">SYSTEM 2</span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">{DEFAULT_PLANS.platinum.name}</h3>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">{DEFAULT_PLANS.platinum.hindiName}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-cyan-300 font-mono">₹500</span>
                <span className="text-[11px] sm:text-xs text-slate-400">एकमुश्त / आजीवन आईडी</span>
              </div>

              {/* Reseller Margin Breakdown */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-1">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-cyan-200">
                  <span>आपका रेफरल मार्जिन:</span>
                  <span className="text-base sm:text-lg text-cyan-300 font-black font-mono">₹365 (73%)</span>
                </div>
                <p className="text-[10px] text-cyan-300/80 break-words">
                  सिर्फ 10 रेफरल पर ₹3,650 सीधे आपके UPI खाते में!
                </p>
              </div>

              <ul className="space-y-2 text-[11px] sm:text-xs text-slate-200 pt-1">
                {DEFAULT_PLANS.platinum.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="break-words">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                triggerCelebration();
                onSelectPlan('platinum');
              }}
              className="btn-3d-rainbow mt-5 sm:mt-6 w-full py-3.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xl min-h-[44px]"
            >
              <Zap className="w-4 h-4 fill-white shrink-0" />
              <span>सिस्टम 2 (₹500 प्लैटिनम) जॉइन करें</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>

          {/* System 3: ₹1000 Royal Crown VIP System */}
          <div className="rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-[#0B0C10] border-2 border-amber-400 p-4 sm:p-6 flex flex-col justify-between shadow-[0_15px_40px_rgba(245,158,11,0.35)] hover:border-yellow-300 transition-all">
            <div className="space-y-3.5 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 sm:px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs font-black border border-amber-400/50 flex items-center gap-1">
                  <Crown className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                  <span>👑 ₹765 भारी इनाम</span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-amber-400 font-mono font-bold">SYSTEM 3 (VIP)</span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">{DEFAULT_PLANS.royal.name}</h3>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">{DEFAULT_PLANS.royal.hindiName}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">₹1000</span>
                <span className="text-[11px] sm:text-xs text-slate-400">एकमुश्त / वीआईपी आजीवन</span>
              </div>

              {/* Reseller Margin Breakdown */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 space-y-1">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-amber-200">
                  <span>आपका रेफरल मार्जिन:</span>
                  <span className="text-base sm:text-lg text-amber-400 font-black font-mono">₹765 (76.5%)</span>
                </div>
                <p className="text-[10px] text-amber-300/80 break-words">
                  सबसे बड़ा पेआउट: 10 रेफरल पर ₹7,650 का त्वरित नकद इनाम!
                </p>
              </div>

              <ul className="space-y-2 text-[11px] sm:text-xs text-slate-200 pt-1">
                {DEFAULT_PLANS.royal.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="break-words">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                triggerCelebration();
                onSelectPlan('royal');
              }}
              className="btn-3d-rainbow mt-5 sm:mt-6 w-full py-3.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xl min-h-[44px]"
            >
              <Crown className="w-4 h-4 fill-white text-white shrink-0" />
              <span>👑 सिस्टम 3 (₹1000 VIP) जॉइन करें</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </section>

      {/* Comprehensive 100 vs 500 vs 1000 Plan Comparison Chart & Best Plan Verdict */}
      <PlanComparisonChart onSelectPlan={onSelectPlan} />

      {/* Promotional Poster Studio & Referral Hub Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/50 border-2 border-amber-400/70 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-400/40">
              <Sparkles className="w-3.5 h-3.5 fill-amber-300 animate-pulse" />
              <span>प्रचार केंद्र • VIRAL REFERRAL & POSTER STUDIO</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              WhatsApp व सोशल मीडिया पर प्रचार करने का सम्पूर्ण टूलकिट
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              अपने नाम व स्पॉन्सर आईडी के साथ लाइव प्रमोशनल पोस्टर बनाएं, 1-क्लिक में डाउनलोड करें और रेडीमेड हिंदी/English मैसेज कॉपी करके दोस्तों को भेजें। हर जॉइनिंग पर तुरंत ₹65, ₹365 या ₹765 कमाएं!
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {onOpenReferralStudio && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenReferralStudio();
                }}
                className="btn-3d-amber px-6 py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl whitespace-nowrap min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>प्रचार केंद्र व पोस्टर मेकर खोलें</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Referral Earnings Estimator */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-[#0B0C10] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>कमाई अनुमान कैलकुलेटर</span>
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white">
              आप यहाँ कितनी कमाई कर सकते हैं?
            </h3>
            <p className="text-xs text-slate-400">
              स्लाइडर को आगे बढ़ाएं और देखें कि सीधे UPI भुगतान से आपकी कुल कमाई कितनी होगी:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  प्लान चुनें जिसे आप शेयर करेंगे:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['silver', 'platinum', 'royal'] as PlanTier[]).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => {
                        sounds.playClick();
                        setCalcPlan(tier);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition min-h-[44px] flex items-center justify-center text-center ${
                        calcPlan === tier
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400 ring-1 ring-amber-400'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {tier === 'silver' ? '₹100 (₹65)' : tier === 'platinum' ? '₹500 (₹365)' : '₹1000 (₹765)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                  <span>कितने लोगों को आमंत्रित करेंगे:</span>
                  <span className="text-amber-400 font-mono text-sm">{calcReferrals} सदस्य</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={calcReferrals}
                  onChange={(e) => {
                    setCalcReferrals(Number(e.target.value));
                    sounds.playClick();
                  }}
                  className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>1 सदस्य</span>
                  <span>25 सदस्य</span>
                  <span>50 सदस्य</span>
                </div>
              </div>
            </div>

            {/* Total Earning Box with 3D button */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-amber-500/30 text-center space-y-3 shadow-inner">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                आपकी अनुमानित डायरेक्ट कमाई:
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono drop-shadow">
                ₹{totalEarnings.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-300">
                ({calcReferrals} रेफरल × ₹{selectedCalcPlan.referralCommission} = ₹{totalEarnings})
              </p>
              <button
                onClick={() => {
                  sounds.playClick();
                  triggerCelebration();
                  onSelectPlan(calcPlan);
                }}
                className="btn-3d-rainbow w-full py-3.5 rounded-2xl text-xs font-black shadow-lg min-h-[44px]"
              >
                यह सिस्टम अभी जॉइन करें →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Direct UPI Intent & Verification Instructions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">आधिकारिक यूपीआई गेटवे व सत्यापन प्रक्रिया</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            भुगतान खाता: <strong className="text-amber-300 font-mono">8877490845@spicepay</strong> (विकास कुमार)। भुगतान करने के बाद स्क्रीनशॉट और 12-अंकों का UTR रेफरेंस नंबर दर्ज करें। व्यवस्थापक द्वारा सत्यापन होते ही आपका डिजिटल आईडी कार्ड सक्रिय हो जाएगा और स्पॉन्सर को कमीशन जारी कर दिया जाएगा।
          </p>
        </div>
      </section>
    </div>
  );
};
