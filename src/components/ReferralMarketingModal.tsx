import React, { useState, useRef } from 'react';
import {
  X,
  Share2,
  Copy,
  CheckCircle2,
  Download,
  Sparkles,
  Users,
  Wallet,
  Crown,
  Zap,
  ShieldCheck,
  TrendingUp,
  Image as ImageIcon,
  Edit3,
  MessageSquare,
  QrCode,
  DollarSign,
  ArrowRight,
  Send,
} from 'lucide-react';
import { UserProfile, PlanTier } from '../types';
import { storage, DEFAULT_PLANS } from '../services/storage';
import { sounds, triggerCelebration } from '../utils/audioCelebration';

interface ReferralMarketingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSelectPlan?: (plan: PlanTier) => void;
}

export const ReferralMarketingModal: React.FC<ReferralMarketingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectPlan,
}) => {
  const [activeTab, setActiveTab] = useState<'share' | 'income' | 'poster' | 'templates'>('share');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTextIndex, setCopiedTextIndex] = useState<number | null>(null);

  // Poster Editor State
  const defaultName = currentUser?.fullName || currentUser?.name || 'Vikas Kumar';
  const defaultUserId = currentUser?.userId || currentUser?.id || 'RX_MAIN_001';
  const defaultPhone = currentUser?.mobile || currentUser?.phone || '8877490845';

  const [posterName, setPosterName] = useState(defaultName);
  const [posterUserId, setPosterUserId] = useState(defaultUserId);
  const [posterPhone, setPosterPhone] = useState(defaultPhone);
  const [posterTheme, setPosterTheme] = useState<'gold' | 'cyan' | 'emerald'>('gold');
  const [posterHeadline, setPosterHeadline] = useState('घर बैठे मोबाइल से रोजाना कमाएं ₹765 से ₹5,000!');
  const [posterTagline, setPosterTagline] = useState('100% भारत सरकार डायरेक्ट सेलिंग नियम 2021 प्रमाणित प्लैटफॉर्म');

  // Income Calculator State
  const [calcTier, setCalcTier] = useState<PlanTier>('platinum');
  const [calcReferrals, setCalcReferrals] = useState(10);

  const posterRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://rainaksh.network';
  const myUserId = currentUser?.userId || currentUser?.id || 'RX_MAIN_001';
  const referralLink = `${origin}?ref=${encodeURIComponent(myUserId)}`;

  // Downlines & earnings
  const downlines = storage.getDownlines(myUserId);
  const totalEarned = currentUser?.totalEarned || currentUser?.earnings?.totalEarned || 0;
  const walletBalance = currentUser?.walletBalance || 0;

  const handleCopyLink = () => {
    sounds.playClick();
    triggerCelebration();
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    sounds.playClick();
    triggerCelebration();
    const text = `🔥 *RainAksh Network - भारत का नंबर 1 डायरेक्ट सेलिंग प्लैटफॉर्म!*\n\n👑 *हर रेफरल पर पाएं 65% से 76.5% इंस्टेंट UPI पेआउट:*\n• ₹100 बेसिक प्लान -> ₹65 तुरंत UPI में\n• ₹500 प्लैटिनम प्लान -> ₹365 तुरंत UPI में\n• ₹1000 रॉयल VIP प्लान -> ₹765 तुरंत UPI में\n\n✅ 100% भारत सरकार Direct Selling 2021 नियमानुसार प्रमाणित\n✅ अद्वितीय स्मार्ट डिजिटल आईडी कार्ड QR कोड सहित\n✅ अधिकृत UPI: 8877490845@spicepay (विकास कुमार)\n\n👉 *मेरे रेफरल लिंक से अभी जॉइन करें:*\n${referralLink}\n\nस्पॉन्सर आईडी: *${myUserId}*`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTelegram = () => {
    sounds.playClick();
    const text = `🔥 RainAksh Network: Earn ₹65, ₹365, or ₹765 instant UPI payout on every referral! Join with my link: ${referralLink} (Sponsor: ${myUserId})`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const templates = [
    {
      id: 1,
      title: 'व्हाट्सएप स्टेटस व ग्रुप मैसेज (Hindi Viral Pitch)',
      content: `🔥 *घर बैठे मोबाइल से रोजाना कमाएं ₹65, ₹365 से ₹765 सीधा अपने बैंक UPI में!*\n\n🎖️ *RainAksh Network की खासियत:*\n1. भारत सरकार के कंज्यूमर डायरेक्ट सेलिंग रूल्स 2021 के तहत 100% लीगल।\n2. ₹100 जॉइनिंग पर ₹65 नकद कमीशन।\n3. ₹500 जॉइनिंग पर ₹365 नकद कमीशन।\n4. ₹1000 जॉइनिंग पर ₹765 बंपर कमीशन।\n5. 10 से 30 मिनट में सीधा UPI ट्रांसफर (विकास कुमार, 8877490845@spicepay).\n\n👉 अभी जॉइन करने के लिए लिंक पर क्लिक करें:\n${referralLink}\n\nस्पॉन्सर कोड: ${myUserId}`,
    },
    {
      id: 2,
      title: 'Professional English Affiliate Pitch (For Social Media)',
      content: `🚀 Join RainAksh Network - The Most Lucrative 3-Tier Affiliate & Digital ID Passport Network in India!\n\n💎 Earn 65% to 76.5% Instant Referral Commissions:\n• Tier 1 (₹100) -> ₹65 Direct Payout\n• Tier 2 (₹500) -> ₹365 Direct Payout\n• Tier 3 (₹1000) -> ₹765 Direct Payout\n\n🛡️ 100% Compliant with Govt. Direct Selling Rules 2021.\n⚡ Instant Settlement direct to your GooglePay/PhonePe UPI.\n\n👉 Join My Verified Network Now:\n${referralLink}\n(Sponsor ID: ${myUserId})`,
    },
    {
      id: 3,
      title: 'शॉर्ट एंड क्रिस्प मैसेज (Short SMS / Instagram Bio)',
      content: `⚡ RainAksh Network: ₹100, ₹500 या ₹1000 प्लान से शुरू करें और हर डायरेक्ट रेफरल पर ₹65, ₹365 या ₹765 इंस्टेंट UPI में कमाएं! लिंक: ${referralLink} (Sponsor: ${myUserId})`,
    },
  ];

  const handleCopyTemplate = (text: string, index: number) => {
    sounds.playClick();
    triggerCelebration();
    navigator.clipboard.writeText(text);
    setCopiedTextIndex(index);
    setTimeout(() => setCopiedTextIndex(null), 2500);
  };

  const handlePrintPoster = () => {
    sounds.playClick();
    triggerCelebration();
    window.print();
  };

  const calcPlan = DEFAULT_PLANS[calcTier];
  const projectedIncome = calcReferrals * calcPlan.referralCommission;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0B0C10] border-2 border-amber-400/80 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.35)] overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 px-5 py-4 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-md">
              <Share2 className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/20 px-2 py-0.5 rounded text-slate-950">
                OFFICIAL MARKETING & PROMOTION STUDIO
              </span>
              <h2 className="text-base sm:text-xl font-black leading-tight">
                रेफरल हब, प्रचार पोस्टर स्टूडियो व इनकम मैट्रिक्स
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 overflow-x-auto no-scrollbar text-xs font-bold px-4 gap-2 pt-2">
          {[
            { id: 'share', label: '1. रेफरल लिंक व शेयर हब', icon: Share2 },
            { id: 'income', label: '2. किस प्लान पर कितनी कमाई?', icon: DollarSign },
            { id: 'poster', label: '3. प्रचार पोस्टर मेकर (Poster)', icon: ImageIcon },
            { id: 'templates', label: '4. रेडीमेड प्रचार संदेश', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 whitespace-nowrap transition ${
                  isActive
                    ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* TAB 1: Share Hub & Referral Dashboard */}
          {activeTab === 'share' && (
            <div className="space-y-6">
              {/* Quick Dashboard Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="network-tile p-3.5 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Direct Downline</span>
                  <p className="text-2xl font-black text-cyan-400 font-mono mt-0.5">{downlines.length} Members</p>
                  <span className="text-[10px] text-emerald-400">Your direct team</span>
                </div>

                <div className="network-tile p-3.5 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Referral Earned</span>
                  <p className="text-2xl font-black text-amber-400 font-mono mt-0.5">₹{totalEarned.toLocaleString('en-IN')}</p>
                  <span className="text-[10px] text-slate-400">Instant payout</span>
                </div>

                <div className="network-tile p-3.5 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Available Wallet</span>
                  <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">₹{walletBalance.toLocaleString('en-IN')}</p>
                  <span className="text-[10px] text-emerald-400">Ready to withdraw</span>
                </div>

                <div className="network-tile p-3.5 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Your Sponsor ID</span>
                  <p className="text-lg font-black text-white font-mono mt-1 truncate">{myUserId}</p>
                  <span className="text-[10px] text-cyan-300">Share this ID</span>
                </div>
              </div>

              {/* Referral Link Box */}
              <div className="p-5 rounded-3xl bg-slate-900 border-2 border-cyan-400/50 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-300 flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>आपका पर्सनल रेफरल लिंक (Personal Referral URL)</span>
                  </span>
                  <span className="text-[10px] bg-slate-950 px-2.5 py-0.5 rounded-full text-emerald-400 font-bold border border-emerald-500/30">
                    Active & Verified
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="w-full sm:flex-1 bg-slate-950 px-3.5 py-2.5 rounded-2xl border border-slate-700 text-xs font-mono text-amber-300 truncate">
                    {referralLink}
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="btn-3d-amber w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shrink-0"
                  >
                    {copiedLink ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* 1-Click Sharing Channels */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>एक क्लिक में प्रचार करें (1-Click Social Sharing):</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={handleShareWhatsApp}
                    className="btn-3d-emerald p-4 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-black shadow-lg"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>व्हाट्सएप पर शेयर करें (WhatsApp)</span>
                  </button>

                  <button
                    onClick={handleShareTelegram}
                    className="btn-3d-cyan p-4 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-black shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span>टेलीग्राम पर शेयर करें (Telegram)</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      triggerCelebration();
                      setActiveTab('poster');
                    }}
                    className="btn-3d-amber p-4 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-black shadow-lg"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>प्रचार पोस्टर बनाएं (Poster Maker)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Income Breakdown Per Plan */}
          {activeTab === 'income' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  <span>किस प्लान को रेफर करने पर आपको कितना इनकम मिलेगा?</span>
                </h3>
                <p className="text-xs text-slate-400">
                  हर सीधे रेफरल पर 65% से 76.5% तक का तुरंत नकद कमीशन बिना किसी कटौती के आपके खाते में क्रेडिट होता है।
                </p>
              </div>

              {/* 3 Plans Income Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* ₹100 Normal Plan */}
                <div className="p-5 rounded-3xl bg-slate-950 border-2 border-emerald-500/80 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-400/50">
                      TIER 1 • NORMAL
                    </span>
                    <span className="text-lg font-black text-white font-mono">₹100 Plan</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">आपकी सीधी कमाई (Your Income)</span>
                    <p className="text-3xl font-black text-emerald-400 font-mono mt-0.5">₹65</p>
                    <span className="text-xs text-emerald-300 font-bold">65% Instant Direct Payout</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-slate-300 space-y-1">
                    <p>• 1 दोस्त को जॉइन करवाएं: <strong>₹65</strong></p>
                    <p>• 10 दोस्तों पर: <strong>₹650 सीधी कमाई</strong></p>
                    <p>• 50 दोस्तों पर: <strong>₹3,250 सीधी कमाई</strong></p>
                  </div>
                </div>

                {/* ₹500 Platinum Plan */}
                <div className="p-5 rounded-3xl bg-slate-950 border-2 border-cyan-400 space-y-3 shadow-xl relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-[9px] font-black uppercase px-3 py-0.5 rounded-full shadow">
                    🔥 MOST POPULAR
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black border border-cyan-400/50">
                      TIER 2 • PLATINUM
                    </span>
                    <span className="text-lg font-black text-cyan-300 font-mono">₹500 Plan</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">आपकी सीधी कमाई (Your Income)</span>
                    <p className="text-3xl font-black text-cyan-300 font-mono mt-0.5">₹365</p>
                    <span className="text-xs text-cyan-200 font-bold">73% Massive Direct Payout</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-slate-200 space-y-1">
                    <p>• 1 दोस्त को जॉइन करवाएं: <strong>₹365</strong></p>
                    <p>• 10 दोस्तों पर: <strong>₹3,650 भारी मुनाफा</strong></p>
                    <p>• 50 दोस्तों पर: <strong>₹18,250 बंपर कमाई</strong></p>
                  </div>
                </div>

                {/* ₹1000 Royal Crown VIP Plan */}
                <div className="p-5 rounded-3xl bg-slate-950 border-2 border-amber-400 space-y-3 shadow-xl relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[9px] font-black uppercase px-3 py-0.5 rounded-full shadow">
                    👑 VIP CROWN MATRIX
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-400/50">
                      TIER 3 • VIP CROWN
                    </span>
                    <span className="text-lg font-black text-amber-400 font-mono">₹1000 Plan</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">आपकी सीधी कमाई (Your Income)</span>
                    <p className="text-3xl font-black text-amber-400 font-mono mt-0.5">₹765</p>
                    <span className="text-xs text-amber-300 font-bold">76.5% Highest Commission!</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-slate-200 space-y-1">
                    <p>• 1 दोस्त को जॉइन करवाएं: <strong>₹765</strong></p>
                    <p>• 10 दोस्तों पर: <strong>₹7,650 बंपर कमाई</strong></p>
                    <p>• 50 दोस्तों पर: <strong>₹38,250 धमाकेदार इनकम!</strong></p>
                  </div>
                </div>
              </div>

              {/* Interactive Earnings Calculator */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white flex items-center gap-1.5 uppercase">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span>लाइव कमाई कैलकुलेटर (Live Earnings Calculator)</span>
                  </span>
                  <span className="text-xs font-mono font-black text-emerald-400">
                    अनुमानित आय: ₹{projectedIncome.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-300 font-bold block">प्लान चुनें (Select Plan to Refer):</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['silver', 'platinum', 'royal'] as PlanTier[]).map((tier) => (
                        <button
                          key={tier}
                          onClick={() => { sounds.playClick(); setCalcTier(tier); }}
                          className={`py-2 px-2 rounded-xl text-xs font-black transition ${
                            calcTier === tier
                              ? 'bg-amber-500 text-slate-950 shadow-md'
                              : 'bg-slate-950 text-slate-300 border border-slate-800'
                          }`}
                        >
                          {tier === 'silver' ? '₹100 (₹65)' : tier === 'platinum' ? '₹500 (₹365)' : '₹1000 (₹765)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-300 font-bold">
                      <span>रेफरल संख्या (Referral Count):</span>
                      <span className="font-mono text-cyan-300 text-sm font-black">{calcReferrals} लोग (Users)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {[5, 10, 25, 50, 100].map((num) => (
                        <button
                          key={num}
                          onClick={() => { sounds.playClick(); setCalcReferrals(num); }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                            calcReferrals === num
                              ? 'bg-cyan-500 text-slate-950 font-black'
                              : 'bg-slate-950 text-slate-300 border border-slate-800'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <p className="text-xs text-slate-300">
                    यदि आप <strong className="text-amber-400">{calcReferrals} लोगों</strong> को{' '}
                    <strong className="text-cyan-300">{calcPlan.name}</strong> में जॉइन करवाते हैं, तो आपकी सीधी कमाई होगी:{' '}
                    <span className="text-xl font-black text-emerald-400 font-mono">₹{projectedIncome.toLocaleString('en-IN')}</span>!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Promotional Poster Studio & Editor */}
          {activeTab === 'poster' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                  <span>प्रचार पोस्टर मेकर व संपादक (Promotional Poster Studio)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  अपने नाम, स्पॉन्सर आईडी और मोबाइल नंबर के साथ पेशेवर मार्केटिंग पोस्टर कस्टमाइज़ और डाउनलोड करें।
                </p>
              </div>

              {/* Controls & Inputs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">पोस्टर थीम (Theme):</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => { sounds.playClick(); setPosterTheme('gold'); }}
                        className={`py-2 rounded-xl text-xs font-black transition ${posterTheme === 'gold' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-amber-300 border border-amber-500/30'}`}
                      >
                        👑 Royal Gold
                      </button>
                      <button
                        onClick={() => { sounds.playClick(); setPosterTheme('cyan'); }}
                        className={`py-2 rounded-xl text-xs font-black transition ${posterTheme === 'cyan' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-cyan-300 border border-cyan-500/30'}`}
                      >
                        💎 Platinum Shield
                      </button>
                      <button
                        onClick={() => { sounds.playClick(); setPosterTheme('emerald'); }}
                        className={`py-2 rounded-xl text-xs font-black transition ${posterTheme === 'emerald' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-emerald-300 border border-emerald-500/30'}`}
                      >
                        ⚡ Cyber Neon
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">आपका नाम (Member Name):</label>
                    <input
                      type="text"
                      value={posterName}
                      onChange={(e) => setPosterName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">स्पॉन्सर आईडी (Sponsor ID):</label>
                      <input
                        type="text"
                        value={posterUserId}
                        onChange={(e) => setPosterUserId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">व्हाट्सएप/फोन (Phone):</label>
                      <input
                        type="text"
                        value={posterPhone}
                        onChange={(e) => setPosterPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">पोस्टर हेडलाइन (Headline):</label>
                    <input
                      type="text"
                      value={posterHeadline}
                      onChange={(e) => setPosterHeadline(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handlePrintPoster}
                      className="btn-3d-amber flex-1 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>प्रिंट / डाउनलोड पोस्टर (Download Poster)</span>
                    </button>
                  </div>
                </div>

                {/* Live Poster Preview */}
                <div className="lg:col-span-6 flex flex-col items-center">
                  <div
                    ref={posterRef}
                    className={`w-full max-w-sm aspect-[4/5] rounded-3xl p-5 flex flex-col justify-between text-white relative overflow-hidden shadow-2xl border-2 ${
                      posterTheme === 'gold'
                        ? 'bg-gradient-to-br from-amber-950 via-[#0B0C10] to-yellow-950 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.35)]'
                        : posterTheme === 'cyan'
                        ? 'bg-gradient-to-br from-slate-950 via-[#0B0C10] to-cyan-950 border-cyan-400 shadow-[0_0_35px_rgba(56,189,248,0.3)]'
                        : 'bg-gradient-to-br from-slate-950 via-[#0B0C10] to-emerald-950 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.3)]'
                    }`}
                  >
                    {/* Watermark in poster background */}
                    <div className="absolute inset-0 security-watermark-grid opacity-25 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
                      <span className="text-[54px] font-black tracking-[0.2em] text-white/[0.05] select-none font-sans uppercase -rotate-12 transform scale-110">
                        RAINAKSH
                      </span>
                    </div>

                    {/* Top Poster Ribbon */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 z-10">
                      <div>
                        <div className="flex items-center gap-1.5 leading-none">
                          <span className="font-black tracking-tight text-xs bg-gradient-to-r from-white via-cyan-200 to-amber-300 bg-clip-text text-transparent font-sans">
                            RainAksh
                          </span>
                          <span className="text-[8px] font-black uppercase px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-mono tracking-wider">
                            NETWORK
                          </span>
                        </div>
                        <p className="text-[9px] text-cyan-300 font-mono mt-0.5">Govt. Direct Selling 2021 Compliant</p>
                      </div>
                      <span className="text-[9px] bg-slate-950/80 px-2 py-0.5 rounded text-emerald-400 font-bold border border-emerald-500/30">
                        100% VERIFIED
                      </span>
                    </div>

                    {/* Poster Center Headline */}
                    <div className="space-y-2 text-center my-auto z-10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-400/40 inline-block">
                        ⚡ INSTANT UPI COMMISSION
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow">
                        {posterHeadline}
                      </h3>
                      <p className="text-[10px] text-slate-300">
                        {posterTagline}
                      </p>

                      {/* 3 Tier Margin Matrix on Poster */}
                      <div className="grid grid-cols-3 gap-1.5 pt-2 text-[10px] font-mono">
                        <div className="p-2 rounded-xl bg-slate-950/80 border border-emerald-500/40">
                          <span className="text-slate-400 text-[8px] block">₹100 PLAN</span>
                          <span className="text-emerald-400 font-black">₹65 REWARD</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950/80 border border-cyan-400/40">
                          <span className="text-slate-400 text-[8px] block">₹500 PLAN</span>
                          <span className="text-cyan-300 font-black">₹365 REWARD</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950/80 border border-amber-400/40">
                          <span className="text-slate-400 text-[8px] block">₹1000 PLAN</span>
                          <span className="text-amber-400 font-black">₹765 REWARD</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Member Signature Box on Poster */}
                    <div className="p-3 rounded-2xl bg-slate-950/90 border border-white/10 z-10 flex items-center justify-between">
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase block font-bold">VERIFIED SPONSOR</span>
                        <p className="text-xs font-black text-white">{posterName}</p>
                        <p className="text-[10px] text-amber-400 font-mono font-bold">ID: {posterUserId}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-slate-400 uppercase block font-bold">WHATSAPP / CALL</span>
                        <p className="text-xs font-black text-cyan-300 font-mono">{posterPhone}</p>
                        <p className="text-[8px] text-emerald-400 font-bold">UPI: 8877490845@spicepay</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Readymade Marketing Message Templates */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  <span>रेडीमेड प्रचार संदेश (Ready-to-Use Viral Promotion Messages)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  नीचे दिए गए संदेशों को 1 क्लिक में कॉपी करके अपने व्हाट्सएप स्टेटस, फेसबुक या इंस्टाग्राम पर पोस्ट करें।
                </p>
              </div>

              <div className="space-y-4">
                {templates.map((tpl) => (
                  <div key={tpl.id} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-amber-300 uppercase tracking-wide">
                        {tpl.title}
                      </h4>
                      <button
                        onClick={() => handleCopyTemplate(tpl.content, tpl.id)}
                        className="btn-3d-dark px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5"
                      >
                        {copiedTextIndex === tpl.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">कॉपी हो गया!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Message</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] sm:text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                      {tpl.content}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400 text-center sm:text-left">
            अधिकृत भुगतान UPI: <strong className="text-amber-400 font-mono">8877490845@spicepay</strong> (विकास कुमार)
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleShareWhatsApp}
              className="btn-3d-emerald flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="btn-3d-dark flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300"
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
