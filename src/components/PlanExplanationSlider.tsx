import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Users,
  Wallet,
  Play,
  Pause,
  Languages,
  DollarSign,
  Smartphone,
  Award,
} from 'lucide-react';
import { PlanTier } from '../types';
import { sounds, triggerCelebration } from '../utils/audioCelebration';

interface PlanExplanationSliderProps {
  onSelectPlan: (tier: PlanTier) => void;
  onOpenVerify?: () => void;
  onOpenReferralStudio?: () => void;
}

interface SlideData {
  id: number;
  tag: string;
  badgeColor: string;
  borderColor: string;
  bgGradient: string;
  icon: React.ReactNode;
  payoutAmount: string;
  payoutPercent: string;
  titleHi: string;
  titleEn: string;
  forWhomHi: string;
  forWhomEn: string;
  whatYouGetHi: string[];
  whatYouGetEn: string[];
  howItWorksHi: string;
  howItWorksEn: string;
  actionPlan?: PlanTier;
  actionLabelHi: string;
  actionLabelEn: string;
}

export const PlanExplanationSlider: React.FC<PlanExplanationSliderProps> = ({
  onSelectPlan,
  onOpenVerify,
  onOpenReferralStudio,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [languageMode, setLanguageMode] = useState<'both' | 'hi' | 'en'>('both');

  const slides: SlideData[] = [
    {
      id: 1,
      tag: 'SLIDE 1/5 • PLATFORM OVERVIEW',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      borderColor: 'border-emerald-500/80',
      bgGradient: 'from-slate-950 via-[#0B0C10] to-emerald-950/40',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
      payoutAmount: '₹65 - ₹765',
      payoutPercent: 'Upto 76.5%',
      titleHi: 'RainAksh Network क्या है और यह कैसे काम करता है?',
      titleEn: 'What is RainAksh Network & How Does It Work?',
      forWhomHi: 'सभी भारतीय नागरिकों, छात्रों, गृहिणियों और पार्ट-टाइम/फुल-टाइम ऑनलाइन कमाई चाहने वालों के लिए।',
      forWhomEn: 'For all Indian citizens, students, homemakers, and part-time/full-time digital entrepreneurs.',
      whatYouGetHi: [
        'भारत सरकार Consumer Protection (Direct Selling) Rules 2021 के अनुरूप 100% लीगल डिजिटल प्लैटफॉर्म।',
        'एंटी-काउंटरफीट स्मार्ट डिजिटल आईडी कार्ड (क्यूआर कोड, यूनिक आईडी व प्राइवेसी मास्क इंजन सहित)।',
        'हर सीधे रेफरल पर 65% से 76.5% तक का इंस्टेंट डायरेक्ट पेआउट सीधा आपके UPI आईडी पर।',
        'एडमिन विकास कुमार (8877490845@spicepay) द्वारा 10-30 मिनट में सीधा व सुरक्षित बैंक सेटलमेंट।',
      ],
      whatYouGetEn: [
        '100% legal digital identity and reseller system compliant with Govt. Direct Selling Rules 2021.',
        'Anti-counterfeit Smart Digital ID Passport with dynamic QR validation & privacy masking.',
        'Instant 65% to 76.5% direct referral commission paid straight to your bank UPI address.',
        'Zero deduction, 10-30 min transparent verification managed directly by Admin Vikas Kumar.',
      ],
      howItWorksHi: 'आप अपनी पसंद का सिस्टम (₹100, ₹500, या ₹1000) चुनकर जॉइन करते हैं, आपको डिजिटल आईडी पासपोर्ट मिलता है। फिर अपने रेफरल लिंक से दोस्तों को जॉइन करवाते ही निर्धारित कमीशन तुरंत आपके वॉलेट और यूपीआई में आ जाता है।',
      howItWorksEn: 'Choose your desired system (₹100, ₹500, or ₹1000), unlock your verified Digital ID Card, share your personal referral link, and receive instant cash rewards directly into your UPI account without middlemen.',
      actionPlan: 'silver',
      actionLabelHi: 'शुरू करें (Explore ₹100 System)',
      actionLabelEn: 'Get Started (Explore ₹100 System)',
    },
    {
      id: 2,
      tag: 'SLIDE 2/5 • SYSTEM 1 BASIC',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      borderColor: 'border-emerald-400',
      bgGradient: 'from-slate-950 via-[#0B0C10] to-emerald-950/60',
      icon: <Zap className="w-8 h-8 text-emerald-400" />,
      payoutAmount: '₹65 Payout',
      payoutPercent: '65% Direct Commission',
      titleHi: '₹100 नॉर्मल बेसिक सिस्टम (Normal System)',
      titleEn: '₹100 Normal Basic Plan (Entry System)',
      forWhomHi: 'शुरुआती सदस्यों, कॉलेज छात्रों व कम लागत में पहली बार ऑनलाइन कमाई शुरू करने वाले युवाओं के लिए।',
      forWhomEn: 'Ideal for beginners, college students, and anyone starting their digital referral journey with zero risk.',
      whatYouGetHi: [
        'मिनिमलिस्ट नियॉन-बॉर्डर स्मार्ट डिजिटल आईडी कार्ड (फोटो, यूनिक आईडी व स्पॉन्सर वॉटरमार्क सहित)।',
        'हर एक डायरेक्ट रेफरल पर ₹65 (65%) का त्वरित नकद भुगतान सीधा आपके UPI पर।',
        'लाइफटाइम वैलिडिटी मेंबरशिप आईडी कार्ड (RX_2026_S...)।',
        'मोबाइल-फ्रेंडली मेंबर डैशबोर्ड व बेसिक डाउनलाइन ट्रैकिंग लेजर।',
      ],
      whatYouGetEn: [
        'Minimalist Neon-Border Smart Digital ID Card with raw photo & locked unique ID watermark.',
        'Instant ₹65 (65% margin) cash reward on every direct user you invite.',
        'Lifetime validity membership identity credentials (e.g. RX_2026_S...).',
        'Mobile-friendly dashboard with real-time downline tracking ledger.',
      ],
      howItWorksHi: '₹100 देकर जॉइन करें। जैसे ही आपका कोई मित्र आपके रेफरल लिंक से ₹100 का बेसिक प्लान जॉइन करता है, आपको उसी समय ₹65 का कमीशन मिल जाता है। सिर्फ 10 दोस्तों पर ₹650 की सीधी कमाई!',
      howItWorksEn: 'Join for just ₹100. When any friend joins under your referral link, you receive ₹65 instantly. Refer just 10 friends and take home ₹650 direct to your UPI!',
      actionPlan: 'silver',
      actionLabelHi: '₹100 सिस्टम जॉइन करें (Select ₹100 System)',
      actionLabelEn: 'Join ₹100 System (Earn ₹65 Per Invite)',
    },
    {
      id: 3,
      tag: 'SLIDE 3/5 • SYSTEM 2 PLATINUM',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
      borderColor: 'border-cyan-400',
      bgGradient: 'from-slate-950 via-[#0B0C10] to-cyan-950/60',
      icon: <Sparkles className="w-8 h-8 text-cyan-400" />,
      payoutAmount: '₹365 Payout',
      payoutPercent: '73% Massive Commission',
      titleHi: '₹500 प्लैटिनम शील्ड सिस्टम (Platinum Shield)',
      titleEn: '₹500 Platinum Shield Plan (Growth System)',
      forWhomHi: 'गंभीर एफिलिएट मार्केटरों, वर्क-फ्रॉम-होम प्रमोटरों व अच्छी दैनिक आय चाहने वाले पार्ट-टाइम लीडर्स के लिए।',
      forWhomEn: 'Best for growth-oriented networkers, work-from-home freelancers, and active social media promoters.',
      whatYouGetHi: [
        'प्लैटिनम शील्ड होलोग्राम डिजिटल आईडी कार्ड (होलोग्राफिक मैटेलिक शाइन व सिल्वर शील्ड बैज)।',
        'हर एक डायरेक्ट रेफरल पर ₹365 (73%) का भारी मुनाफा सीधा आपके UPI में।',
        'कस्टम एनालिटिकल ग्रोथ चार्ट्स व डाउनलाइन कन्वर्जन ट्रेंड ट्रैकर।',
        'एडवांस्ड डेटा एक्सपोर्ट इंजन (CSV/Excel/PDF रिपोर्ट डाउनलोड करने की सुविधा)।',
        'प्राइवेसी मास्क इंजन (मोबाइल नंबर, ईमेल व कमाई को छुपाने की सुविधा) + 1-ऑन-1 पर्सनल गाइडेंस।',
      ],
      whatYouGetEn: [
        'Platinum Shield Hologram Digital ID Card with metallic shine & brushed chrome badge.',
        'Huge ₹365 (73% margin) cash reward on every direct platinum invite.',
        'Custom Analytical Graphs (earnings growth, downline conversion rates).',
        'Advanced dataset export engine (download CSV / Excel / PDF reports).',
        'Privacy toggle switches (mask phone/email) + Direct 1-to-1 personal guidance tunnel with Admin.',
      ],
      howItWorksHi: '₹500 का प्लैटिनम प्लान जॉइन करें। अपने नेटवर्क में जब भी कोई व्यक्ति ₹500 का प्लान जॉइन करेगा, आपको हर जॉइनिंग पर ₹365 का भारी पेआउट मिलेगा। सिर्फ 10 रेफरल्स पर ₹3,650 की कमाई!',
      howItWorksEn: 'Activate the ₹500 Platinum Plan. Every time a contact joins under you at this system, you earn ₹365 instant commission. Just 10 referrals earn you ₹3,650 clean profit!',
      actionPlan: 'platinum',
      actionLabelHi: '₹500 प्लैटिनम सिस्टम चुनें (Most Popular)',
      actionLabelEn: 'Join ₹500 Platinum System (Earn ₹365 Per Invite)',
    },
    {
      id: 4,
      tag: 'SLIDE 4/5 • SYSTEM 3 ROYAL VIP',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      borderColor: 'border-amber-400',
      bgGradient: 'from-slate-950 via-[#0B0C10] to-amber-950/70',
      icon: <Crown className="w-8 h-8 text-amber-400" />,
      payoutAmount: '₹765 Payout',
      payoutPercent: '76.5% Highest Commission',
      titleHi: '₹1000 रॉयल क्राउन वीआईपी सिस्टम (Royal Crown VIP)',
      titleEn: '₹1000 Royal Crown VIP Plan (Royale VIP System)',
      forWhomHi: 'टॉप टीम लीडर्स, कम्युनिटी फाउंडर्स, डिजिटल इन्फ्लुएंसर्स व अधिकतम दैनिक लाभ कमाने वालों के लिए।',
      forWhomEn: 'Built for top community leaders, influencers, team architects, and high-volume commission earners.',
      whatYouGetHi: [
        '3D लिक्विड गोल्ड डिजिटल आईडी कार्ड (रॉयल क्राउन सील व लाइफटाइम वैलिडिटी सर्टिफिकेट सहित)।',
        'हर एक डायरेक्ट रेफरल पर सबसे बड़ा ₹765 (76.5%) का बंपर पेआउट सीधा आपके UPI पर।',
        'गोल्डन नेमप्लेट प्रोफाइल डिस्प्ले व एक्सक्लूसिव 3D रॉयल क्राउन अवतार फ्रेम।',
        'लाइव अर्निंग टिकर, वीआईपी एनालिटिक्स व सर्वोच्च प्राथमिकता वाली ऑटोमैटिक यूपीआई निकासी।',
        '24/7 वीआईपी डायरेक्ट सपोर्ट व स्पेशल लीडरशिप रिवॉर्ड्स।',
      ],
      whatYouGetEn: [
        '3D Liquid Gold Digital ID Card with Royal Crown Seal & Lifetime Validity Certificate.',
        'Maximum ₹765 (76.5% margin) cash reward on every direct invite.',
        'Golden Nameplate Profile Design & exclusive Royal Crown avatar frame.',
        'Live scrolling earnings ticker, VIP analytics & highest-priority automatic UPI withdrawals.',
        '24/7 VIP priority support tunnel & elite community recognition.',
      ],
      howItWorksHi: '₹1000 का रॉयल वीआईपी प्लान लें। आपके रेफरल द्वारा ₹1000 का प्लान लेते ही ₹765 आपके खाते में आते हैं। सिर्फ 10 रेफरल्स पर ₹7,650 और 50 रेफरल्स पर ₹38,250 की शानदार कमाई!',
      howItWorksEn: 'Unlock the ₹1000 Royal Crown VIP Plan. Earn ₹765 for each direct referral. 10 referrals equal ₹7,650 and 50 referrals equal ₹38,250 straight to your UPI account!',
      actionPlan: 'royal',
      actionLabelHi: '₹1000 रॉयल वीआईपी जॉइन करें (Max Income)',
      actionLabelEn: 'Join ₹1000 Royal VIP (Earn ₹765 Per Invite)',
    },
    {
      id: 5,
      tag: 'SLIDE 5/5 • PAYOUT & VERIFICATION',
      badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40',
      borderColor: 'border-yellow-400',
      bgGradient: 'from-slate-950 via-[#0B0C10] to-yellow-950/50',
      icon: <Wallet className="w-8 h-8 text-yellow-400" />,
      payoutAmount: '10-30 Min',
      payoutPercent: 'Direct to Your UPI',
      titleHi: 'पैसा कब मिलेगा, कैसे मिलेगा और सत्यापन प्रणाली क्या है?',
      titleEn: 'When & How Do You Get Paid? Instant Verification Process',
      forWhomHi: 'पारदर्शी भुगतान, शून्य शुल्क व त्वरित बैंक सुरक्षा की जानकारी चाहने वाले सभी सदस्यों के लिए।',
      forWhomEn: 'For all visitors seeking clarity on zero deductions, instant settlement & bank verification.',
      whatYouGetHi: [
        'अधिकृत यूपीआई: 8877490845@spicepay (विकास कुमार) पर सीधा और सुरक्षित भुगतान।',
        'यूटीआर (UTR) सबमिट करने के 10 से 30 मिनट के अंदर एडमिन द्वारा सत्यापन और डिजिटल आईडी कार्ड सक्रिय।',
        'जैसे ही आपका डाउनलाइन जॉइन करता है, कमीशन स्वतः आपके स्पॉन्सर वॉलेट में क्रेडिट हो जाता है।',
        'वॉलेट बैलेंस से कभी भी विथड्रॉ रिक्वेस्ट लगाएं, विकास कुमार द्वारा सीधा आपके यूपीआई में ट्रांसफर किया जाता है।',
        '0% कटौती • शून्य हिडन चार्ज • 100% पारदर्शी लेजर।',
      ],
      whatYouGetEn: [
        'Official receiver UPI: 8877490845@spicepay (Vikas Kumar) ensuring safe direct transactions.',
        '10 to 30 minutes verification speed after UTR submission, instantly activating your Digital ID.',
        'Instant wallet credit the moment any direct referee joins your network.',
        '1-click UPI withdrawal request processed directly to your personal GooglePay/PhonePe/Paytm UPI.',
        '0% deduction • 0 hidden fees • 100% transparent audit ledger.',
      ],
      howItWorksHi: 'भुगतान करें -> UTR रेफरेंस नंबर डालें -> 10-30 मिनट में सत्यापन -> आईडी कार्ड और रेफरल लिंक एक्टिव -> रेफर करें और तुरंत 65% से 76.5% कमाई अपने यूपीआई में पाएं!',
      howItWorksEn: 'Make Payment -> Enter UTR -> 10-30 min verification -> ID card & link activated -> Refer & collect instant 65% to 76.5% payouts to your bank account!',
      actionPlan: 'platinum',
      actionLabelHi: 'सत्यापन पोर्टल देखें (Verify / Join Now)',
      actionLabelEn: 'Verify Any Member ID Card',
    },
  ];

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const slide = slides[currentSlide];

  const handleNext = () => {
    sounds.playClick();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    sounds.playClick();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-4 select-none">
      {/* Slider Top Controller Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
            5
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
              <span>प्लेटफॉर्म व 3 प्लान्स की पूरी जानकारी</span>
              <span className="text-slate-400 text-xs hidden sm:inline">• Complete 5-Slide Walkthrough</span>
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-400">
              किसके लिए है, क्या मिलेगा, कब मिलेगा और कितना मिलेगा (हिंदी व English में)
            </p>
          </div>
        </div>

        {/* Controls: Language toggle + Autoplay + Refer Studio button */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
            <button
              onClick={() => { sounds.playClick(); setLanguageMode('both'); }}
              className={`px-2 py-0.5 rounded-lg transition ${languageMode === 'both' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
            >
              दोनों (Dual)
            </button>
            <button
              onClick={() => { sounds.playClick(); setLanguageMode('hi'); }}
              className={`px-2 py-0.5 rounded-lg transition ${languageMode === 'hi' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
            >
              हिंदी
            </button>
            <button
              onClick={() => { sounds.playClick(); setLanguageMode('en'); }}
              className={`px-2 py-0.5 rounded-lg transition ${languageMode === 'en' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
            >
              English
            </button>
          </div>

          <button
            onClick={() => { sounds.playClick(); setIsPlaying(!isPlaying); }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 font-bold"
            title={isPlaying ? 'Pause Auto-slide' : 'Play Auto-slide'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="text-[10px] hidden md:inline">{isPlaying ? 'Auto' : 'Play'}</span>
          </button>

          {onOpenReferralStudio && (
            <button
              onClick={() => { sounds.playClick(); onOpenReferralStudio(); }}
              className="btn-3d-amber px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 fill-slate-950" />
              <span>प्रचार केंद्र (Marketing)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Slide Card */}
      <div className={`relative rounded-3xl bg-gradient-to-br ${slide.bgGradient} border-2 ${slide.borderColor} p-5 sm:p-7 shadow-2xl transition-all duration-500 overflow-hidden`}>
        {/* Ambient Glow Aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Slide Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${slide.badgeColor}`}>
              {slide.tag}
            </span>
            <span className="text-slate-400 text-[11px] font-mono">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-slate-950/80 px-3 py-1 rounded-xl text-xs font-black font-mono text-amber-400 border border-amber-400/30 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>{slide.payoutAmount}</span>
              <span className="text-emerald-400 text-[10px]">({slide.payoutPercent})</span>
            </span>
          </div>
        </div>

        {/* Slide Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 items-start">
          {/* Left Column: Titles, Target Audience & Features */}
          <div className="lg:col-span-8 space-y-4">
            {/* Title */}
            <div>
              {(languageMode === 'both' || languageMode === 'hi') && (
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
                  {slide.titleHi}
                </h2>
              )}
              {(languageMode === 'both' || languageMode === 'en') && (
                <p className={`text-base sm:text-lg font-bold text-cyan-300 ${languageMode === 'both' ? 'mt-0.5' : ''}`}>
                  {slide.titleEn}
                </p>
              )}
            </div>

            {/* किसके लिए है? (Target Audience) */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>यह किसके लिए है? (Who is this for?)</span>
              </span>
              {(languageMode === 'both' || languageMode === 'hi') && (
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  {slide.forWhomHi}
                </p>
              )}
              {(languageMode === 'both' || languageMode === 'en') && (
                <p className="text-[11px] sm:text-xs text-slate-400">
                  {slide.forWhomEn}
                </p>
              )}
            </div>

            {/* क्या मिलेगा? (What You Get) */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>इसमें क्या मिलेगा? (What will you receive?)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {slide.whatYouGetHi.map((itemHi, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-0.5">
                    {(languageMode === 'both' || languageMode === 'hi') && (
                      <p className="text-slate-200 font-bold leading-snug flex items-start gap-1.5">
                        <span className="text-emerald-400 text-sm">✓</span>
                        <span>{itemHi}</span>
                      </p>
                    )}
                    {(languageMode === 'both' || languageMode === 'en') && (
                      <p className="text-[10px] text-slate-400 pl-4">
                        {slide.whatYouGetEn[idx]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* कैसे काम करता है? (How It Works) */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>यह कैसे काम करता है? (How does it work?)</span>
              </span>
              {(languageMode === 'both' || languageMode === 'hi') && (
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {slide.howItWorksHi}
                </p>
              )}
              {(languageMode === 'both' || languageMode === 'en') && (
                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  {slide.howItWorksEn}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Key Metric Highlight Box & CTA */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-[#0B0C10] border border-white/10 shadow-xl">
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 mx-auto flex items-center justify-center shadow-lg">
                {slide.icon}
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">
                  DIRECT REFERRAL REWARD
                </span>
                <p className="text-3xl font-black text-amber-400 font-mono mt-0.5">
                  {slide.payoutAmount}
                </p>
                <p className="text-xs text-emerald-400 font-bold mt-0.5">
                  {slide.payoutPercent}
                </p>
              </div>

              {/* Settlement timing box */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>सेटलमेंट स्पीड (Settlement Lag):</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  10-30 मिनट में एडमिन <strong>विकास कुमार</strong> द्वारा सीधा सत्यापन व बैंक UPI ट्रांसफर।
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 text-left">
                <strong>अधिकृत भुगतान UPI:</strong>{' '}
                <span className="font-mono text-white font-bold">8877490845@spicepay</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  triggerCelebration();
                  if (slide.actionPlan) {
                    onSelectPlan(slide.actionPlan);
                  } else if (onOpenVerify) {
                    onOpenVerify();
                  }
                }}
                className="btn-3d-rainbow w-full py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-xl"
              >
                <Zap className="w-4 h-4 fill-white text-white" />
                <span>{languageMode === 'en' ? slide.actionLabelEn : slide.actionLabelHi}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Carousel Controls (Prev, Indicators, Next) */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
          <button
            onClick={handlePrev}
            className="btn-3d-dark px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">पिछला (Prev)</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {slides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => {
                  sounds.playClick();
                  setCurrentSlide(index);
                }}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === index
                    ? 'w-8 h-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 shadow-md'
                    : 'w-2.5 h-2.5 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="btn-3d-dark px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1"
          >
            <span className="hidden sm:inline">अगला (Next)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
