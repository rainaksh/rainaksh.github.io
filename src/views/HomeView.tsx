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
    <div className="space-y-10 pb-14">
      {/* Prominent Official Announcement Showcase Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-950/70 via-[#0B0C10] to-cyan-950/70 border-2 border-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.25)] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-400/40">
                <Sparkles className="w-3.5 h-3.5 fill-amber-300 animate-pulse" />
                <span>📢 महत्वपूर्ण सूचना • OFFICIAL PLATFORM ANNOUNCEMENT</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
                वेबसाइट की खासियत & किस प्लान में जॉइन करने पर क्या मिलेगा?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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
                className="btn-3d-amber px-6 py-3.5 rounded-2xl text-xs font-black flex items-center gap-2 whitespace-nowrap shrink-0 shadow-lg"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>पूरा विवरण देखें (Full Guide)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 3 Quick Reward Highlights in Announcement */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5 pt-5 border-t border-slate-800/80">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-emerald-400">₹100 नॉर्मल प्लान</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">₹65 Payout</span>
              </div>
              <p className="text-[11px] text-slate-300">
                🎁 <strong>क्या मिलेगा:</strong> Minimalist Neon Digital ID Card + <strong>65% डायरेक्ट पेआउट</strong> हर इनवाइट पर!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-400/50 space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-cyan-300">₹500 प्लैटिनम प्लान</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 font-mono">₹365 Payout</span>
              </div>
              <p className="text-[11px] text-slate-300">
                🎁 <strong>क्या मिलेगा:</strong> Platinum Hologram ID Card + कस्टम एनालिटिकल चार्ट्स, CSV एक्सपोर्ट व <strong>73% पेआउट</strong>!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-400/50 space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-amber-400">₹1000 रॉयल क्राउन VIP</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 font-mono">₹765 Payout</span>
              </div>
              <p className="text-[11px] text-slate-300">
                🎁 <strong>क्या मिलेगा:</strong> 3D Liquid Gold Card, गोल्डन नेमप्लेट, क्राउन अवतार बैज व <strong>76.5% भारी पेआउट</strong>!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-4 pb-10 sm:pt-8 sm:pb-14 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Ambient neon & gold aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-5">
          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-950/80 via-slate-900 to-amber-950/70 border border-amber-400/50 text-amber-300 text-xs font-black shadow-[0_0_25px_rgba(245,158,11,0.3)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wider">RAINAKSH NETWORK • ENTERPRISE AFFILIATE MATRIX</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto font-sans">
            Apna Unique <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-400 bg-clip-text text-transparent">Digital ID Card</span> Paayein & Upto <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">76.5% Instant Payout</span> Kamayein!
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Government Direct Selling Rules 2021 ke mutabik verified network. 3 Plans (₹100, ₹500, ₹1000) me se chuniye aur har direct referral par{' '}
            <strong className="text-amber-300 font-black">₹65, ₹365 ya ₹765 instant UPI transfer</strong> paayein!
          </p>

          {/* 3D Tactile CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                sounds.playClick();
                triggerCelebration();
                onSelectPlan('platinum');
              }}
              className="btn-3d-amber w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 tracking-wide"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Explore Subscription Plans (₹100)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onOpenVerify();
              }}
              className="btn-3d-dark w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Verify Any Member ID Card</span>
            </button>
          </div>

          {/* Quick Metric Tile Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6">
            <div className="network-tile p-3.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Instant Reward</span>
              <p className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-0.5">₹65 - ₹765</p>
              <span className="text-[10px] text-emerald-400 font-semibold">Per Referral Invite</span>
            </div>

            <div className="network-tile p-3.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">UPI Speed</span>
              <p className="text-xl sm:text-2xl font-black text-cyan-400 font-mono mt-0.5">10-30 Min</p>
              <span className="text-[10px] text-slate-300 font-semibold">By Vikas Kumar</span>
            </div>

            <div className="network-tile p-3.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Govt Compliant</span>
              <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-0.5">100%</p>
              <span className="text-[10px] text-emerald-400 font-semibold">Consumer Act 2021</span>
            </div>

            <div className="network-tile p-3.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Digital ID</span>
              <p className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">3 Systems</p>
              <span className="text-[10px] text-slate-300 font-semibold">Custom Smart Cards</span>
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
      <section id="plans" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-3xl font-black text-white">
                RainAksh 3-System Membership Plans & Referral Margins
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Jaisa system aap share karenge, utna massive margin instant UPI payout ke roop me aapke account me aayega.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            ✓ 0% Deduction • 100% Transparent
          </span>
        </div>

        {/* 3 Horizontal Slider/Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* System 1: ₹100 Normal System */}
          <div className="rounded-3xl bg-[#0B0C10] border-2 border-emerald-500/80 p-6 flex flex-col justify-between shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:border-emerald-400 transition-all">
            <div className="space-y-4">
              {/* Flashing badge */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/50 flex items-center gap-1 animate-pulse">
                  <Zap className="w-3.5 h-3.5" />
                  <span>💥 ₹65 INSTANT CASH REWARD</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">SYSTEM 1</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">{DEFAULT_PLANS.silver.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{DEFAULT_PLANS.silver.hindiName}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white font-mono">₹100</span>
                <span className="text-xs text-slate-400">One Time / Lifetime ID</span>
              </div>

              {/* Reseller Margin Breakdown */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                  <span>Aapka Direct Referral Margin:</span>
                  <span className="text-lg text-emerald-400 font-black font-mono">₹65 (65%)</span>
                </div>
                <p className="text-[10px] text-emerald-300/80">
                  10 dosto ko join karayein aur sidhe ₹650 apne UPI par payein.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-300 pt-1">
                {DEFAULT_PLANS.silver.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
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
              className="btn-3d-rainbow mt-6 w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Join System 1 (₹100)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* System 2: ₹500 Platinum System */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#0B0C10] border-2 border-cyan-400 p-6 flex flex-col justify-between shadow-[0_15px_35px_rgba(56,189,248,0.3)] ring-2 ring-cyan-400/30 transform md:-translate-y-2">
            {/* Shopsy style Best Seller Ribbon */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-lg">
              🔥 MOST POPULAR CHOICE
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between pt-1">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black border border-cyan-400/50 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>💥 ₹365 INSTANT REWARD</span>
                </span>
                <span className="text-[11px] text-cyan-400 font-mono font-bold">SYSTEM 2</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">{DEFAULT_PLANS.platinum.name}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{DEFAULT_PLANS.platinum.hindiName}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-cyan-300 font-mono">₹500</span>
                <span className="text-xs text-slate-400">One Time / Lifetime ID</span>
              </div>

              {/* Reseller Margin Breakdown */}
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-200">
                  <span>Aapka Direct Referral Margin:</span>
                  <span className="text-lg text-cyan-300 font-black font-mono">₹365 (73%)</span>
                </div>
                <p className="text-[10px] text-cyan-300/80">
                  Sirf 10 referrals par ₹3,650 aapke UPI par transfer!
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-200 pt-1">
                {DEFAULT_PLANS.platinum.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
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
              className="btn-3d-rainbow mt-6 w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xl"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Upgrade to Platinum System (₹500)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* System 3: ₹1000 Royal Crown VIP System */}
          <div className="rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-[#0B0C10] border-2 border-amber-400 p-6 flex flex-col justify-between shadow-[0_15px_40px_rgba(245,158,11,0.35)] hover:border-yellow-300 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-400/50 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>👑 ₹765 MASSIVE REWARD</span>
                </span>
                <span className="text-[11px] text-amber-400 font-mono font-bold">SYSTEM 3 (VIP)</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">{DEFAULT_PLANS.royal.name}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{DEFAULT_PLANS.royal.hindiName}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-amber-400 font-mono">₹1000</span>
                <span className="text-xs text-slate-400">One Time / VIP Access</span>
              </div>

              {/* Reseller Margin Breakdown */}
              <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                  <span>Aapka Direct Referral Margin:</span>
                  <span className="text-lg text-amber-400 font-black font-mono">₹765 (76.5%)</span>
                </div>
                <p className="text-[10px] text-amber-300/80">
                  Sabse bada payout: 10 referrals par ₹7,650 instant cash reward!
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-200 pt-1">
                {DEFAULT_PLANS.royal.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
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
              className="btn-3d-rainbow mt-6 w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xl"
            >
              <Crown className="w-4 h-4 fill-white text-white" />
              <span>Join Royal Crown VIP System (₹1000)</span>
              <ArrowRight className="w-4 h-4" />
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
                className="btn-3d-amber px-6 py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl whitespace-nowrap"
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
              <span>Reseller Margin Estimator</span>
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white">
              Aap Kitna Kama Sakte Hain?
            </h3>
            <p className="text-xs text-slate-400">
              Slider move karein aur dekhein direct UPI settlement se aapki kitni kamai hogi:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Plan Chuniye Jise Share Karenge:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['silver', 'platinum', 'royal'] as PlanTier[]).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => {
                        sounds.playClick();
                        setCalcPlan(tier);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition ${
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
                  <span>Kitne Logo Ko Join Karayenge:</span>
                  <span className="text-amber-400 font-mono text-sm">{calcReferrals} Members</span>
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
                  <span>1 Member</span>
                  <span>25 Members</span>
                  <span>50 Members</span>
                </div>
              </div>
            </div>

            {/* Total Earning Box with 3D button */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-amber-500/30 text-center space-y-3 shadow-inner">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                Aapki Anumanit Direct Kamai:
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono drop-shadow">
                ₹{totalEarnings.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-300">
                ({calcReferrals} referrals × ₹{selectedCalcPlan.referralCommission} = ₹{totalEarnings})
              </p>
              <button
                onClick={() => {
                  sounds.playClick();
                  triggerCelebration();
                  onSelectPlan(calcPlan);
                }}
                className="btn-3d-rainbow w-full py-3.5 rounded-2xl text-xs font-black shadow-lg"
              >
                Join This System Now
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
            <h3 className="text-base font-bold text-white">Official UPI Gateway & Verification Workflow</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Payment target: <strong className="text-amber-300 font-mono">8877490845@spicepay</strong> (Vikas Kumar). Bhugtan karne ke baad raw payment screenshot aur 12-digit UTR ref no. upload karein. Admin verification ke baad turant Digital ID Card activate ho jayega aur sponsor ko commission release ho jayega.
          </p>
        </div>
      </section>
    </div>
  );
};
