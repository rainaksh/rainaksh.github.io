import React, { useState } from 'react';
import {
  ShieldCheck,
  Heart,
  X,
  BookOpen,
  HelpCircle,
  FileText,
  PhoneCall,
  Lock,
  QrCode,
  Copy,
  CheckCircle2,
  Crown,
  Sparkles,
  ArrowRight,
  Zap,
  SendHorizontal,
  Mail,
  Phone,
  MapPin,
  Scale,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Send,
  ExternalLink,
} from 'lucide-react';
import { storage, DEFAULT_PLANS } from '../services/storage';
import { BrandLogo } from './BrandLogo';
import { PlanTier } from '../types';
import { sounds, triggerCelebration } from '../utils/audioCelebration';

interface FooterProps {
  setActiveView: (view: string) => void;
  onOpenAdmin: () => void;
  onOpenJoinModal?: (plan?: PlanTier) => void;
  onOpenVerify?: (userId?: string) => void;
  onOpenReferralStudio?: () => void;
}

type FooterPopupTab = 'guide' | 'faq' | 'legal' | 'contact' | 'plans' | 'payee' | 'compliance';

export const Footer: React.FC<FooterProps> = ({
  setActiveView,
  onOpenAdmin,
  onOpenJoinModal,
  onOpenVerify,
  onOpenReferralStudio,
}) => {
  const config = storage.getConfig();

  // Pop-up window modal state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FooterPopupTab>('guide');
  const [selectedPlanTab, setSelectedPlanTab] = useState<PlanTier>('platinum');
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Inquiry Form state inside Contact pop-up
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const openPopup = (tab: FooterPopupTab, plan: PlanTier = 'platinum') => {
    sounds.playClick();
    setActiveTab(tab);
    if (tab === 'plans') {
      setSelectedPlanTab(plan);
    }
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    sounds.playClick();
    setIsPopupOpen(false);
  };

  const handleCopyUpi = () => {
    sounds.playClick();
    triggerCelebration();
    navigator.clipboard.writeText(config.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    triggerCelebration();

    storage.addInquiry({
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setMessage('');
    }, 4000);
  };

  const handleTelegram = () => {
    sounds.playClick();
    window.open('https://t.me/rainaksh', '_blank');
  };

  const handleEmail = () => {
    sounds.playClick();
    window.open('mailto:accaiwork@gmail.com?subject=RainAksh%20Network%20Support%20Inquiry', '_blank');
  };

  const handleJoinFromPopup = (plan: PlanTier) => {
    sounds.playClick();
    triggerCelebration();
    setIsPopupOpen(false);
    if (onOpenJoinModal) {
      onOpenJoinModal(plan);
    } else {
      setActiveView('plans');
    }
  };

  const upiQrUri = `upi://pay?pa=${encodeURIComponent(config.upiId)}&pn=${encodeURIComponent(
    config.receiverName
  )}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    upiQrUri
  )}&color=0b0c10&bgcolor=ffffff`;

  const faqs = [
    {
      q: 'Plan share karne par kitna commission milta hai?',
      a: 'RainAksh Network par referral margin:\n• ₹100 Normal System share karne par ₹65 instant payout (65%).\n• ₹500 Platinum System share karne par ₹365 instant payout (73%).\n• ₹1000 Crown VIP System share karne par ₹765 instant payout (76.5%).',
    },
    {
      q: 'Payout kaise aur kitni der me milega?',
      a: 'Commission approve hote hi wallet me reflect hota hai. Withdrawal request lagane ke baad Admin Vikas Kumar aapke diye gaye UPI ID (GPay, PhonePe, Paytm, BHIM) par 10 se 30 minute ke andar direct transfer karte hain.',
    },
    {
      q: 'Digital ID Card me privacy kaise secure rehti hai?',
      a: 'By default har sadasya ka mobile number masked rehta hai (+91 ••••••845). Aap dashboard me jakar card ko public ya private switch kar sakte hain.',
    },
    {
      q: 'Kya mai kisi bhi plan se kisi bhi plan ko refer kar sakta hu?',
      a: 'Ji haan! Aap kisi bhi plan ke sadasya ho, aap sabhi 3 systems (₹100, ₹500, ₹1000) ko refer kar sakte hain aur unka pura instant referral commission prapt kar sakte hain.',
    },
    {
      q: 'Control Panel kiske paas hai aur iska access kaise milta hai?',
      a: 'Master Control Panel sirf Founder Vikas Kumar ke paas surakshit hai aur master passcode se protected hai jisse pure website ka transparent control system chalta hai.',
    },
    {
      q: 'Kya ye platform Government Direct Selling Rules ko follow karta hai?',
      a: '100% compliant. Consumer Protection (Direct Selling) Rules, 2021 ke mutabik har member ko genuine digital utilities (Verified ID Card, Analytical software, reselling tools) milti hain.',
    },
  ];

  return (
    <footer className="bg-[#0B0C10] border-t border-slate-800 text-slate-400 text-xs pb-24 lg:pb-8 pt-10 select-none">
      
      {/* 1. Quick Interactive Pop-up Launcher Action Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 mb-8">
        <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-white font-black text-xs">
              ⚡ फुटर त्वरित सहायता एवं सूचना केंद्र (Click Any To Open In Pop-Up Window):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => openPopup('guide')}
              className={`flex items-center gap-1.5 rounded-xl transition-all duration-300 ease-out cursor-pointer ${
                isPopupOpen && activeTab === 'guide'
                  ? 'btn-3d-amber px-4 py-2 text-xs font-black scale-110 -translate-y-1 shadow-[0_8px_20px_rgba(245,158,11,0.55)] border-2 border-amber-300 z-10'
                  : 'btn-3d-dark px-3 py-1.5 text-[11px] font-bold text-slate-200 scale-100 opacity-85 hover:opacity-100 shadow-sm'
              }`}
            >
              <BookOpen className={`transition-all ${isPopupOpen && activeTab === 'guide' ? 'w-4 h-4 text-slate-950' : 'w-3.5 h-3.5 text-cyan-400'}`} />
              <span>कमाई गाइड</span>
            </button>

            <button
              onClick={() => openPopup('faq')}
              className={`flex items-center gap-1.5 rounded-xl transition-all duration-300 ease-out cursor-pointer ${
                isPopupOpen && activeTab === 'faq'
                  ? 'btn-3d-amber px-4 py-2 text-xs font-black scale-110 -translate-y-1 shadow-[0_8px_20px_rgba(245,158,11,0.55)] border-2 border-amber-300 z-10'
                  : 'btn-3d-dark px-3 py-1.5 text-[11px] font-bold text-slate-200 scale-100 opacity-85 hover:opacity-100 shadow-sm'
              }`}
            >
              <HelpCircle className={`transition-all ${isPopupOpen && activeTab === 'faq' ? 'w-4 h-4 text-slate-950' : 'w-3.5 h-3.5 text-amber-400'}`} />
              <span>FAQ सवाल-जवाब</span>
            </button>

            <button
              onClick={() => openPopup('legal')}
              className={`flex items-center gap-1.5 rounded-xl transition-all duration-300 ease-out cursor-pointer ${
                isPopupOpen && activeTab === 'legal'
                  ? 'btn-3d-amber px-4 py-2 text-xs font-black scale-110 -translate-y-1 shadow-[0_8px_20px_rgba(245,158,11,0.55)] border-2 border-amber-300 z-10'
                  : 'btn-3d-dark px-3 py-1.5 text-[11px] font-bold text-slate-200 scale-100 opacity-85 hover:opacity-100 shadow-sm'
              }`}
            >
              <Scale className={`transition-all ${isPopupOpen && activeTab === 'legal' ? 'w-4 h-4 text-slate-950' : 'w-3.5 h-3.5 text-emerald-400'}`} />
              <span>सरकारी नियम 2021</span>
            </button>

            <button
              onClick={() => openPopup('contact')}
              className={`flex items-center gap-1.5 rounded-xl transition-all duration-300 ease-out cursor-pointer ${
                isPopupOpen && activeTab === 'contact'
                  ? 'btn-3d-telegram px-4 py-2 text-xs font-black scale-110 -translate-y-1 shadow-[0_8px_20px_rgba(56,189,248,0.55)] border-2 border-sky-300 z-10'
                  : 'btn-3d-telegram px-3 py-1.5 text-[11px] font-black text-white scale-100 opacity-85 hover:opacity-100 shadow-sm'
              }`}
            >
              <SendHorizontal className="w-3.5 h-3.5" />
              <span>हेल्प डेस्क @rainaksh</span>
            </button>

            <button
              onClick={() => openPopup('plans', 'royal')}
              className={`flex items-center gap-1.5 rounded-xl transition-all duration-300 ease-out cursor-pointer ${
                isPopupOpen && activeTab === 'plans'
                  ? 'btn-3d-rainbow px-4 py-2 text-xs font-black scale-110 -translate-y-1 shadow-[0_8px_20px_rgba(236,72,153,0.55)] border-2 border-pink-300 z-10'
                  : 'btn-3d-rainbow px-3 py-1.5 text-[11px] font-black text-white scale-100 opacity-85 hover:opacity-100 shadow-sm'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>3-सिस्टम प्लान्स</span>
            </button>

            <button
              onClick={() => openPopup('payee')}
              className={`flex items-center gap-1.5 rounded-xl transition-all duration-300 ease-out cursor-pointer ${
                isPopupOpen && activeTab === 'payee'
                  ? 'btn-3d-amber px-4 py-2 text-xs font-black scale-110 -translate-y-1 shadow-[0_8px_20px_rgba(245,158,11,0.55)] border-2 border-amber-300 z-10'
                  : 'btn-3d-amber px-3 py-1.5 text-[11px] font-black text-slate-950 scale-100 opacity-85 hover:opacity-100 shadow-sm'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>UPI पेई QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main 4-Column Footer Grid with Interactive Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Brand & Compliance */}
        <div className="space-y-3 md:col-span-1">
          <div
            onClick={() => openPopup('guide')}
            className="cursor-pointer inline-block"
            title="Open RainAksh Overview in Pop-Up Window"
          >
            <BrandLogo size="md" />
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed break-words">
            भारत का सबसे विश्वसनीय 3-सिस्टम एफिलिएट व डिजिटल आइडेंटिटी नेटवर्क। हर डायरेक्ट इनवाइट पर सीधा UPI में 76.5% तक त्वरित कमीशन।
          </p>
          <button
            onClick={() => openPopup('legal')}
            className="pt-1 flex items-center gap-2 text-[10px] text-emerald-400 font-bold hover:text-emerald-300 transition text-left"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Govt. Direct Selling Guidelines (2021) Compliant • विवरण देखें ↗</span>
          </button>
        </div>

        {/* Col 2: 3-System Reseller Margins (Clickable Pop-ups) */}
        <div className="space-y-2.5">
          <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>3-System Reseller Margins</span>
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <button
                onClick={() => openPopup('plans', 'silver')}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/50 transition group text-left"
                title="Open ₹100 Normal System in Pop-up Window"
              >
                <span className="group-hover:text-white transition">Basic Normal System (₹100)</span>
                <span className="text-emerald-400 font-bold font-mono">Earn ₹65 ↗</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => openPopup('plans', 'platinum')}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-400/50 transition group text-left"
                title="Open ₹500 Platinum System in Pop-up Window"
              >
                <span className="group-hover:text-white transition">Platinum Shield System (₹500)</span>
                <span className="text-cyan-400 font-bold font-mono">Earn ₹365 ↗</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => openPopup('plans', 'royal')}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-amber-950/30 to-slate-900/60 hover:bg-slate-900 border border-amber-500/30 hover:border-amber-400 transition group text-left"
                title="Open ₹1000 Royal VIP System in Pop-up Window"
              >
                <span className="text-amber-300 font-bold group-hover:text-white transition">Royal Crown VIP (₹1000)</span>
                <span className="text-amber-400 font-bold font-mono">Earn ₹765 ↗</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Pages & Legal Policy (Clickable Pop-ups) */}
        <div className="space-y-2.5">
          <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pages & Legal Policy</span>
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <button
                onClick={() => openPopup('guide')}
                className="hover:text-amber-400 transition flex items-center gap-1.5 py-1 text-left w-full"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Website Earning Guide (पॉप-अप विंडो)</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => openPopup('faq')}
                className="hover:text-amber-400 transition flex items-center gap-1.5 py-1 text-left w-full"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Aksar Puche Jane Wale Sawal (FAQ)</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => openPopup('legal')}
                className="hover:text-amber-400 transition flex items-center gap-1.5 py-1 text-left w-full"
              >
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                <span>Privacy Policy & Govt. Rules 2021</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => openPopup('contact')}
                className="hover:text-amber-400 transition flex items-center gap-1.5 py-1 text-left w-full"
              >
                <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                <span>Contact & Support Center (@rainaksh)</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => { sounds.playClick(); onOpenAdmin(); }}
                className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1.5 py-1 font-bold text-left w-full"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Control Panel (सुरक्षित व्यवस्थापक)</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Official Payee Desk (Clickable Pop-up) */}
        <div
          onClick={() => openPopup('payee')}
          className="space-y-2.5 bg-slate-900/60 hover:bg-slate-900/90 p-4 rounded-3xl border border-slate-800 hover:border-amber-400/60 transition cursor-pointer shadow-lg group"
          title="Click to view full UPI QR & payment details in Pop-Up Window"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-black text-amber-300 text-xs uppercase tracking-wide">Official UPI Payee Desk</h4>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <QrCode className="w-3 h-3" />
              <span>पॉप-अप QR</span>
            </span>
          </div>
          <div className="text-[11px] space-y-1.5">
            <p className="text-slate-300">
              <strong className="text-white">Admin / Receiver:</strong> {config.receiverName}
            </p>
            <p className="font-mono text-amber-400 font-black bg-slate-950 p-2 rounded-xl border border-slate-800 text-center tracking-wider group-hover:border-amber-400/50 transition">
              UPI: {config.upiId}
            </p>
            <p className="text-slate-400 text-[10px]">
              Direct settlements via GPay, PhonePe, Paytm, BHIM and Stripe. क्लिक करके क्यूआर कोड देखें ↗
            </p>
          </div>
        </div>
      </div>

      {/* 3. Bottom Credits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 mt-8 border-t border-slate-900 text-center text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026 RainAksh Network. All rights reserved. Enterprise Affiliate Matrix.</p>
        <p className="flex items-center gap-1">
          Developed with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Android Mobile by Vikas Kumar
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 4. Complete Footer Pop-Up Window Modal (Floating Center Dialog)          */}
      {/* ========================================================================= */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closePopup();
            }
          }}
        >
          <div className="relative w-full max-w-2xl bg-[#0B0C10] border-2 border-amber-400/90 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.35)] overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in zoom-in-95 duration-200">
            
            {/* Modal Header Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border-b border-amber-500/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                  {activeTab === 'guide' && <BookOpen className="w-5 h-5 text-amber-300" />}
                  {activeTab === 'faq' && <HelpCircle className="w-5 h-5 text-cyan-300" />}
                  {activeTab === 'legal' && <Scale className="w-5 h-5 text-emerald-400" />}
                  {activeTab === 'contact' && <PhoneCall className="w-5 h-5 text-sky-400" />}
                  {activeTab === 'plans' && <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />}
                  {activeTab === 'payee' && <QrCode className="w-5 h-5 text-amber-300" />}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    {activeTab === 'guide' && 'कमाई गाइड एवं सम्पूर्ण विवरण (Earning Guide)'}
                    {activeTab === 'faq' && 'अक्सर पूछे जाने वाले सवाल (Frequently Asked Questions)'}
                    {activeTab === 'legal' && 'सरकारी नियम व शर्ते (Govt Direct Selling Rules 2021)'}
                    {activeTab === 'contact' && 'सहायता केंद्र व हेल्पलाइन (Help Desk @rainaksh)'}
                    {activeTab === 'plans' && '3-सिस्टम सदस्यता प्लान्स एवं मार्जिन'}
                    {activeTab === 'payee' && 'आधिकारिक UPI पेई डेस्क (Official QR Code)'}
                  </h3>
                  <p className="text-[10px] text-amber-300/90 font-mono mt-0.5">
                    RainAksh Network Official Pop-Up Window Portal
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={closePopup}
                className="p-2 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition min-h-[40px] min-w-[40px] flex items-center justify-center shadow"
                aria-label="Close Pop-up Window"
              >
                <X className="w-5 h-5 text-amber-400" />
              </button>
            </div>

            {/* Modal Internal Navigation Tabs */}
            <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto scrollbar-none shrink-0 text-xs font-bold">
              {[
                { id: 'guide', label: '📖 कमाई गाइड' },
                { id: 'faq', label: '❓ FAQ सवाल' },
                { id: 'legal', label: '⚖️ सरकारी नियम 2021' },
                { id: 'contact', label: '📞 सहायता (@rainaksh)' },
                { id: 'plans', label: '💳 3 प्लान्स' },
                { id: 'payee', label: '🏦 पेई QR' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { sounds.playClick(); setActiveTab(tab.id as any); }}
                  className={`rounded-xl whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg scale-110 px-4 py-2 text-xs border border-amber-300 z-10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 scale-100 px-3 py-1.5 text-[11px]'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs text-slate-300 leading-relaxed">
              
              {/* TAB 1: GUIDE */}
              {activeTab === 'guide' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                    <p className="font-bold text-xs sm:text-sm">
                      💡 RainAksh Network पर 4 आसान चरणों में कमाई शुरू करें:
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-white font-black text-xs sm:text-sm">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono">1</span>
                        <span>सदस्यता प्लान चुनें (₹100, ₹500 या ₹1000)</span>
                      </div>
                      <p className="text-slate-400 pl-8">
                        अपने बजट के अनुसार प्लान चुनें। हर प्लान में आपको वेरिफाइड डिजिटल आईडी कार्ड और हर इनवाइट पर ₹65, ₹365 या ₹765 का नकद कमीशन मिलता है।
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-white font-black text-xs sm:text-sm">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono">2</span>
                        <span>UPI द्वारा 8877490845@spicepay (विकास कुमार) पर भुगतान करें</span>
                      </div>
                      <p className="text-slate-400 pl-8">
                        GPay, PhonePe, Paytm या BHIM से सीधा पेमेंट करें और 12-अंकों का UTR नंबर फॉर्म में दर्ज करें।
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-white font-black text-xs sm:text-sm">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono">3</span>
                        <span>यूनिक फिक्स्ड यूजर आईडी (जैसे RNX1000RN01) प्राप्त करें</span>
                      </div>
                      <p className="text-slate-400 pl-8">
                        आपका डिजिटल आईडी कार्ड तुरंत जनरेट हो जाएगा जिसे आप 1-क्लिक में डाउनलोड, प्रिंट या शेयर कर सकते हैं।
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-2 text-white font-black text-xs sm:text-sm">
                        <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center font-mono">4</span>
                        <span>दोस्तों को रेफर करें और डायरेक्ट UPI विथड्रॉल लें</span>
                      </div>
                      <p className="text-slate-400 pl-8">
                        रेफरल लिंक शेयर करें। हर इनवाइट पर 65% से 76.5% तक का कमीशन 10-30 मिनट में आपके बैंक खाते में पहुंचेगा।
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleJoinFromPopup('platinum')}
                      className="btn-3d-rainbow w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Join Now (Starts ₹100)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: FAQ */}
              {activeTab === 'faq' && (
                <div className="space-y-3">
                  {faqs.map((faq, index) => {
                    const isOpen = faqOpenIndex === index;
                    return (
                      <div
                        key={index}
                        className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden transition"
                      >
                        <button
                          onClick={() => {
                            sounds.playClick();
                            setFaqOpenIndex(isOpen ? null : index);
                          }}
                          className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 font-bold text-white hover:text-amber-300 transition"
                        >
                          <span className="flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span>{faq.q}</span>
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 text-slate-300 border-t border-slate-800/80 pt-2.5 whitespace-pre-line leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: LEGAL & GOVT RULES */}
              {activeTab === 'legal' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                      <Scale className="w-5 h-5 shrink-0" />
                      <span>Consumer Protection (Direct Selling) Rules, 2021 Compliance</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      RainAksh Network भारत सरकार के उपभोक्ता मामले मंत्रालय द्वारा जारी डायरेक्ट सेलिंग नियमावली 2021 का 100% अनुपालन करता है।
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <h4 className="font-bold text-white">1. प्रमाणिक डिजिटल उपयोगिता (No Ponzi / No Money Circulation)</h4>
                      <p className="text-slate-400 text-[11px]">
                        प्रत्येक भुगतान करने वाले सदस्य को कानूनी रूप से मान्य डिजिटल आईडी कार्ड, प्रोफाइल फ्रेमिंग किट, डाउनलाइन एनालिटिक्स सॉफ्टवेयर और प्रचार टूलकिट दी जाती है।
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <h4 className="font-bold text-white">2. डायरेक्ट रेफरल बिक्री कमीशन (76.5% Max)</h4>
                      <p className="text-slate-400 text-[11px]">
                        कमीशन केवल वैध प्रत्यक्ष सदस्यता बिक्री पर दिया जाता है। ₹100 पर ₹65, ₹500 पर ₹365 और ₹1000 पर ₹765 बिना किसी हिडन कटौती के सीधा UPI पर ट्रांसफर होता है।
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <h4 className="font-bold text-white">3. प्राइवेसी और डेटा मास्किंग सुरक्षा</h4>
                      <p className="text-slate-400 text-[11px]">
                        IT एक्ट के तहत सभी सदस्यों का मोबाइल नंबर डिफॉल्ट रूप से मास्क (+91 ••••••845) रहता है। यूजर अपने डैशबोर्ड से कार्ड को पब्लिक या प्राइवेट मोड में बदल सकते हैं।
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CONTACT & SUPPORT */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-white font-bold">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span>Director & Founder Desk</span>
                      </div>
                      <p className="text-slate-300 font-bold">{config.receiverName}</p>
                      <p className="text-slate-400 text-[11px] font-mono">UPI: {config.upiId}</p>
                      <p className="text-slate-400 text-[11px]">स्थान: पटना, बिहार, भारत</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">आधिकारिक चैनल</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">सक्रिय 24/7</span>
                      </div>
                      <p className="text-cyan-300 font-mono text-[11px]">📧 accaiwork@gmail.com</p>
                      <p className="text-sky-300 font-mono text-[11px]">✈️ Telegram: @rainaksh</p>
                      <p className="text-slate-300 font-mono text-[11px]">📱 फोन: +91 8877490845</p>
                    </div>
                  </div>

                  {/* Glowing 3D Telegram & Email Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={handleTelegram}
                      className="btn-3d-telegram py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg"
                    >
                      <SendHorizontal className="w-4 h-4" />
                      <span>Join Telegram (@rainaksh)</span>
                    </button>

                    <button
                      onClick={handleEmail}
                      className="btn-3d-email py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email (accaiwork@gmail.com)</span>
                    </button>
                  </div>

                  {/* Direct Message Inquiry Form */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 mt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs">सीधा संदेश भेजें (Direct Inquiry)</h4>
                      <span className="text-[10px] text-amber-400 font-mono">Control Panel Sync</span>
                    </div>

                    {submitted && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>संदेश सफलतापूर्वक दर्ज हो गया है! विकास कुमार द्वारा शीघ्र संपर्क किया जाएगा।</span>
                      </div>
                    )}

                    <form onSubmit={handleFormSubmit} className="space-y-2.5 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="आपका नाम (Full Name)"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
                        />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="10-अंकों का मोबाइल नंबर"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400 text-xs"
                        />
                      </div>
                      <textarea
                        required
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="आपका सवाल या संदेश..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs"
                      />
                      <button
                        type="submit"
                        className="btn-3d-amber w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>संदेश सबमिट करें</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 5: 3-SYSTEM PLANS */}
              {activeTab === 'plans' && (
                <div className="space-y-4">
                  {/* Plan Switcher Pills */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                    <button
                      onClick={() => { sounds.playClick(); setSelectedPlanTab('silver'); }}
                      className={`rounded-xl text-xs transition-all duration-300 text-center cursor-pointer ${
                        selectedPlanTab === 'silver'
                          ? 'bg-emerald-500 text-slate-950 font-black scale-105 -translate-y-0.5 py-2.5 px-1 shadow-md z-10 border border-emerald-300'
                          : 'text-slate-400 hover:text-white py-2 px-1 scale-100 font-bold'
                      }`}
                    >
                      ₹100 नॉर्मल
                    </button>
                    <button
                      onClick={() => { sounds.playClick(); setSelectedPlanTab('platinum'); }}
                      className={`rounded-xl text-xs transition-all duration-300 text-center cursor-pointer ${
                        selectedPlanTab === 'platinum'
                          ? 'bg-cyan-400 text-slate-950 font-black scale-105 -translate-y-0.5 py-2.5 px-1 shadow-md z-10 border border-cyan-300'
                          : 'text-slate-400 hover:text-white py-2 px-1 scale-100 font-bold'
                      }`}
                    >
                      ₹500 प्लैटिनम
                    </button>
                    <button
                      onClick={() => { sounds.playClick(); setSelectedPlanTab('royal'); }}
                      className={`rounded-xl text-xs transition-all duration-300 text-center cursor-pointer ${
                        selectedPlanTab === 'royal'
                          ? 'bg-amber-400 text-slate-950 font-black scale-105 -translate-y-0.5 py-2.5 px-1 shadow-md z-10 border border-amber-300'
                          : 'text-slate-400 hover:text-white py-2 px-1 scale-100 font-bold'
                      }`}
                    >
                      👑 ₹1000 रॉयल VIP
                    </button>
                  </div>

                  {/* Plan Detail Card */}
                  {selectedPlanTab === 'silver' && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border-2 border-emerald-500/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-black text-white">{DEFAULT_PLANS.silver.name}</h4>
                          <p className="text-slate-400 text-[11px]">{DEFAULT_PLANS.silver.hindiName}</p>
                        </div>
                        <span className="text-2xl font-black text-emerald-400 font-mono">₹100</span>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex justify-between font-bold text-emerald-300">
                        <span>रेफरल मार्जिन:</span>
                        <span className="text-emerald-400 font-mono font-black">₹65 (65%) Payout</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300">
                        {DEFAULT_PLANS.silver.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleJoinFromPopup('silver')}
                        className="btn-3d-rainbow w-full py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow"
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        <span>Join System 1 (₹100)</span>
                      </button>
                    </div>
                  )}

                  {selectedPlanTab === 'platinum' && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border-2 border-cyan-400 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-black text-white">{DEFAULT_PLANS.platinum.name}</h4>
                          <p className="text-slate-300 text-[11px]">{DEFAULT_PLANS.platinum.hindiName}</p>
                        </div>
                        <span className="text-2xl font-black text-cyan-300 font-mono">₹500</span>
                      </div>
                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex justify-between font-bold text-cyan-200">
                        <span>रेफरल मार्जिन:</span>
                        <span className="text-cyan-300 font-mono font-black">₹365 (73%) Payout</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300">
                        {DEFAULT_PLANS.platinum.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleJoinFromPopup('platinum')}
                        className="btn-3d-rainbow w-full py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow"
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        <span>Upgrade to Platinum (₹500)</span>
                      </button>
                    </div>
                  )}

                  {selectedPlanTab === 'royal' && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-900 border-2 border-amber-400 space-y-3 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-black text-amber-300">{DEFAULT_PLANS.royal.name}</h4>
                          <p className="text-slate-300 text-[11px]">{DEFAULT_PLANS.royal.hindiName}</p>
                        </div>
                        <span className="text-2xl font-black text-amber-400 font-mono">₹1000</span>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 flex justify-between font-bold text-amber-200">
                        <span>अधिकतम मार्जिन:</span>
                        <span className="text-amber-400 font-mono font-black">₹765 (76.5%) Max Payout</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-200">
                        {DEFAULT_PLANS.royal.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleJoinFromPopup('royal')}
                        className="btn-3d-rainbow w-full py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow"
                      >
                        <Crown className="w-4 h-4 fill-white text-white" />
                        <span>👑 Join Royal Crown VIP (₹1000)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: PAYEE DESK QR */}
              {activeTab === 'payee' && (
                <div className="space-y-4 text-center">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 max-w-sm mx-auto">
                    <div className="inline-block bg-white p-2.5 rounded-2xl shadow-xl">
                      <img
                        src={qrCodeUrl}
                        alt="RainAksh Official UPI QR"
                        className="w-48 h-48 mx-auto object-contain"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Official Target Receiver</p>
                      <h4 className="text-sm font-black text-white">{config.receiverName}</h4>
                      <div className="mt-2 p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2 font-mono text-amber-300 font-black text-xs">
                        <span className="truncate">{config.upiId}</span>
                        <button
                          onClick={handleCopyUpi}
                          className="btn-3d-amber px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-950 shrink-0"
                        >
                          {copiedUpi ? 'Copied!' : 'Copy UPI'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-400 text-[11px]">
                    Supported by all Indian UPI apps: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer Strip */}
            <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] shrink-0">
              <span className="text-slate-400 hidden sm:inline">
                RainAksh Network • Govt Direct Selling 2021
              </span>
              <button
                onClick={closePopup}
                className="btn-3d-dark w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold text-slate-200"
              >
                विंडो बंद करें (Close Pop-up)
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
