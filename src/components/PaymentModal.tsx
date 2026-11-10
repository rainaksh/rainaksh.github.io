import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  Copy,
  Upload,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Smartphone,
  Lock,
  User,
  Users,
  Wallet,
  Crown,
  Zap,
  Check,
  Eye,
  EyeOff,
  Building,
  ExternalLink,
} from 'lucide-react';
import { PlanTier, PlanConfig, UserProfile, Transaction, PlanAmount } from '../types';
import { storage, DEFAULT_PLANS, generateTxnId } from '../services/storage';
import { generateTierFormattedId, generateRainAkshUserId } from '../utils/idGenerator';
import { sounds, triggerMegaCelebration } from '../utils/audioCelebration';

interface PaymentModalProps {
  initialPlan?: PlanTier;
  initialSponsorId?: string;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (user: UserProfile, txn: Transaction) => void;
  onOpenFullSponsorCard?: (sponsorId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  initialPlan = 'platinum',
  initialSponsorId = '',
  isOpen,
  onClose,
  onPaymentSuccess,
  onOpenFullSponsorCard,
}) => {
  const config = storage.getConfig();

  // 5 Step State (1: Plan, 2: Personal Info, 3: Nominee & UPI, 4: QR Payment, 5: UTR Verification)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Plan & Sponsor
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(initialPlan);
  const [sponsorId, setSponsorId] = useState(initialSponsorId || '');

  // Sync if initialSponsorId changes
  React.useEffect(() => {
    if (initialSponsorId) {
      setSponsorId(initialSponsorId);
    }
  }, [initialSponsorId]);

  // Step 2: Personal Details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Step 3: Nominee & Payout UPI
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeRelation, setNomineeRelation] = useState('माता / पिता');
  const [receivingUpi, setReceivingUpi] = useState('');
  const [maskMobile, setMaskMobile] = useState(true);
  const [maskEmail, setMaskEmail] = useState(true);

  // Step 4: Payment Mode & Status
  const [paymentTab, setPaymentTab] = useState<'upi' | 'stripe'>('upi');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Step 5: Verification & Proof
  const [utrNumber, setUtrNumber] = useState('');
  const [proofImage, setProofImage] = useState<string>('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Stripe Demo Simulation
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [stripeProcessing, setStripeProcessing] = useState(false);

  if (!isOpen) return null;

  const currentPlan: PlanConfig = DEFAULT_PLANS[selectedPlan];
  const upiId = config.upiId || '8877490845@spicepay';
  const receiverName = config.receiverName || 'Vikas Kumar';

  // Construct official UPI Deep link
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    receiverName
  )}&am=${currentPlan.price}&cu=INR&tn=${encodeURIComponent(
    `RainAksh_${currentPlan.name}_${phone || 'Member'}`
  )}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    upiUri
  )}&color=0b0c10&bgcolor=ffffff`;

  const handleCopyUpi = () => {
    sounds.playClick();
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    sounds.playClick();
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 1 -> 2 Validation
  const handleNextToStep2 = () => {
    sounds.playClick();
    setErrorMessage('');
    if (!sponsorId.trim()) {
      setErrorMessage('कृपया आगे बढ़ने के लिए स्पॉन्सर आईडी दर्ज करें, अथवा संस्थापक आईडी (RNX1000VK01) चुनें।');
      return;
    }
    setCurrentStep(2);
  };

  // Step 2 -> 3 Validation
  const handleNextToStep3 = () => {
    sounds.playClick();
    setErrorMessage('');
    if (!name.trim()) {
      setErrorMessage('कृपया अपना पूरा नाम भरें।');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('कृपया मान्य 10-अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMessage('कृपया कम से कम 4 अक्षरों का सुरक्षित पासवर्ड बनाएं।');
      return;
    }
    // Auto-fill default receiving UPI if blank
    if (!receivingUpi.trim()) {
      setReceivingUpi(`${cleanPhone}@upi`);
    }
    setCurrentStep(3);
  };

  // Step 3 -> 4 Validation
  const handleNextToStep4 = () => {
    sounds.playClick();
    setErrorMessage('');
    if (!nomineeName.trim()) {
      setErrorMessage('सरकारी नियमों के अनुसार नॉमिनी का नाम भरना अनिवार्य है।');
      return;
    }
    if (!receivingUpi.trim()) {
      setErrorMessage('कृपया अपना बैंक UPI ID भरें ताकि रेफरल कमीशन सीधा आपको मिल सके।');
      return;
    }
    setCurrentStep(4);
  };

  // Step 4 -> 5 Validation
  const handleNextToStep5 = () => {
    sounds.playClick();
    setErrorMessage('');
    setCurrentStep(5);
  };

  // Final Submission on Step 5
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setErrorMessage('');

    if (paymentTab === 'upi') {
      const cleanUtr = utrNumber.replace(/\D/g, '');
      if (cleanUtr.length < 10) {
        setErrorMessage('कृपया भुगतान के बाद बैंक से प्राप्त 12-अंकों का UTR रेफरेंस नंबर दर्ज करें।');
        return;
      }
    }

    if (!agreedTerms) {
      setErrorMessage('कृपया भारत सरकार डायरेक्ट सेलिंग नियम 2021 की शर्तों को स्वीकार करें।');
      return;
    }

    setIsSubmitting(true);

    try {
      const existingUsers = storage.getUsers();
      let user = existingUsers.find(
        (u) =>
          u.mobile === phone.trim() ||
          u.phone === phone.trim() ||
          (email && u.email.toLowerCase() === email.toLowerCase())
      );

      const generatedId = generateRainAkshUserId(selectedPlan, name.trim(), existingUsers);
      const newUserId = user ? (user.userId || user.id) : generatedId;
      const planAmountKey: PlanAmount = currentPlan.price.toString() as PlanAmount;

      const updatedUser: UserProfile = {
        userId: newUserId,
        id: newUserId,
        sponsorId: sponsorId.trim() || 'RX_MAIN_001',
        fullName: name.trim(),
        name: name.trim(),
        email: email.trim() || `${phone.trim()}@member.rainaksh.network`,
        mobile: phone.trim(),
        phone: phone.trim(),
        profilePic:
          user?.profilePic ||
          user?.avatarUrl ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        avatarUrl:
          user?.avatarUrl ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        avatarFrame: selectedPlan === 'royal' ? 'golden_crown' : selectedPlan === 'platinum' ? 'platinum' : 'silver',
        currentPlan: planAmountKey,
        plan: selectedPlan,
        joinDate: new Date().toISOString().split('T')[0],
        verificationStatus: paymentTab === 'stripe' ? 'verified' : 'pending',
        planStatus: paymentTab === 'stripe' ? 'active' : 'pending',
        privacySettings: {
          isCardPublic: true,
          maskMobile: maskMobile,
          maskEmail: maskEmail,
          maskEarnings: false,
        },
        privacy: {
          isCardPublic: true,
          maskPhone: maskMobile,
          maskEmail: maskEmail,
          maskAddress: false,
        },
        earnings: user?.earnings || {
          totalEarned: 0,
          pendingPayout: 0,
          withdrawn: 0,
        },
        walletBalance: user?.walletBalance || 0,
        totalEarned: user?.totalEarned || 0,
        totalWithdrawn: user?.totalWithdrawn || 0,
        upiId: receivingUpi.trim() || `${phone.trim()}@upi`,
        city: city.trim() || 'Patna',
        state: state.trim() || 'Bihar',
        nomineeName: nomineeName.trim() || 'Family Member',
        nomineeRelation: nomineeRelation.trim() || 'Nominee',
        bio: user?.bio || `${currentPlan.name} verified active member.`,
        password: password.trim() || 'member123',
      };

      storage.saveUser(updatedUser);
      storage.setCurrentUser(updatedUser);

      // Create Transaction record
      const txn: Transaction = {
        transactionId: generateTxnId(),
        id: generateTxnId(),
        userId: updatedUser.userId,
        userName: updatedUser.fullName,
        userPhone: updatedUser.mobile,
        sponsorId: updatedUser.sponsorId,
        planAmount: currentPlan.price,
        amount: currentPlan.price,
        plan: selectedPlan,
        paymentMethod: paymentTab === 'stripe' ? 'STRIPE' : 'UPI',
        upiTxnRef: paymentTab === 'stripe' ? `STRIPE-${Date.now().toString().slice(-6)}` : utrNumber.trim(),
        utrNumber: paymentTab === 'stripe' ? `STRIPE-${Date.now().toString().slice(-6)}` : utrNumber.trim(),
        proofImage: proofImage || undefined,
        proofImageUrl: proofImage || undefined,
        status: paymentTab === 'stripe' ? 'approved' : 'pending',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };

      storage.addTransaction(txn);

      if (paymentTab === 'stripe') {
        storage.approveTransaction(txn.id, 'Stripe Gateway Instant');
      }

      setIsSubmitting(false);
      triggerMegaCelebration();
      onPaymentSuccess(updatedUser, txn);
    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false);
      setErrorMessage('सबमिशन त्रुटि! कृपया पुनः प्रयास करें।');
    }
  };

  const handleSimulateStripe = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setStripeProcessing(true);
    setTimeout(() => {
      setStripeProcessing(false);
      handleFinalSubmit(e);
    }, 1200);
  };

  const stepTitles = [
    { num: 1, label: 'प्लान', title: 'सदस्यता प्लान' },
    { num: 2, label: 'विवरण', title: 'व्यक्तिगत जानकारी' },
    { num: 3, label: 'नॉमिनी', title: 'नॉमिनी व पेआउट UPI' },
    { num: 4, label: 'भुगतान', title: 'QR कोड भुगतान' },
    { num: 5, label: 'सत्यापन', title: 'UTR सत्यापन' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0B0C10] border-2 border-amber-400/80 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Top Header Strip with 5-Step Progress */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-black text-xs shrink-0">
                {currentStep}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white leading-tight flex items-center gap-1.5">
                  <span>5-स्टेप रजिस्ट्रेशन विंडो</span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                    Step {currentStep} of 5
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {stepTitles[currentStep - 1].title}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition"
              title="बंद करें"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 5-Step Progress Bar Dots */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {stepTitles.map((s) => {
              const isPassed = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div key={s.num} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isPassed
                        ? 'bg-emerald-400'
                        : isCurrent
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                        : 'bg-slate-800'
                    }`}
                  />
                  <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-bold">
                    <span className={`truncate ${isCurrent ? 'text-amber-300 font-black' : isPassed ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {s.num}. {s.label}
                    </span>
                    {isPassed && <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Error Banner if any */}
        {errorMessage && (
          <div className="m-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ================= STEP 1: PLAN & SPONSOR ================= */}
        {currentStep === 1 && (
          <div className="p-4 sm:p-6 space-y-4 text-xs">
            {/* 1. Sponsor ID Entry & Live Sponsor Card Preview (पहले sponcer id enter kre) */}
            {(() => {
              const cleanSponsor = sponsorId.trim().toUpperCase();
              const sponsorProfile = cleanSponsor
                ? (storage.getUserById(cleanSponsor) || (cleanSponsor.includes('VK') ? storage.getUserById('RNX1000VK01') : null))
                : null;
              const hasValidSponsor = !!sponsorProfile;
              const sponsorName = sponsorProfile?.fullName || sponsorProfile?.name || cleanSponsor;
              const sponsorIdDisplay = sponsorProfile?.userId || cleanSponsor;
              const sponsorPlan = sponsorProfile?.plan || 'royal';

              return (
                <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 p-3.5 sm:p-4 rounded-2xl border-2 border-amber-400/60 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-100 font-black text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>1. स्पॉन्सर आईडी दर्ज करें (Enter Sponsor ID) *</span>
                    </label>
                    {hasValidSponsor ? (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        ✓ SPONSOR VERIFIED
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                        आवश्यक (REQUIRED)
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      value={sponsorId}
                      onChange={(e) => setSponsorId(e.target.value.toUpperCase())}
                      placeholder="स्पॉन्सर आईडी दर्ज करें (उदा. RNX1000...)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-black text-xs tracking-wider focus:outline-none focus:border-amber-400"
                    />

                    {/* Quick helper for users without a sponsor */}
                    {!sponsorId.trim() && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10.5px]">
                        <span className="text-slate-400">क्या आपके पास स्पॉन्सर नहीं है?</span>
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setSponsorId('RNX1000VK01');
                          }}
                          className="btn-3d-dark px-2.5 py-1 rounded-lg text-amber-300 hover:text-white font-bold border border-amber-500/40 text-[10px] shrink-0"
                        >
                          संस्थापक आईडी (RNX1000VK01) से जुड़ें
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Verified Sponsor Masked Card Showcase Strip (Only shown when valid sponsor exists) */}
                  {hasValidSponsor && (
                    <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-500/30 flex items-center justify-between gap-2.5 animate-in fade-in">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <img
                          src={sponsorProfile?.profilePic || sponsorProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                          alt={sponsorName}
                          className="w-10 h-10 rounded-xl object-cover border-2 border-amber-400/70 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-black text-white truncate">{sponsorName}</p>
                            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          </div>
                          <p className="text-[10px] text-amber-400 font-mono font-bold mt-0.5">
                            ID: {sponsorIdDisplay} • <span className="text-emerald-400 font-semibold">+91 ••••••845</span>
                          </p>
                          <p className="text-[9px] text-slate-400 font-medium">
                            सिस्टम: <span className="text-cyan-300 uppercase font-bold">{sponsorPlan} VIP System</span>
                          </p>
                        </div>
                      </div>

                      {onOpenFullSponsorCard && (
                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            onOpenFullSponsorCard(sponsorIdDisplay);
                          }}
                          className="btn-3d-dark px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-amber-300 whitespace-nowrap shrink-0 flex items-center gap-1 border border-amber-400/40"
                          title="पूरा 3D स्पॉन्सर कार्ड देखें"
                        >
                          <Eye className="w-3 h-3 text-amber-400" />
                          <span>कार्ड देखें</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 2. Select Membership System */}
            <div>
              <label className="block text-slate-200 font-bold mb-2">
                2. सदस्यता प्लान चुनें (Select Membership System) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(['silver', 'platinum', 'royal'] as PlanTier[]).map((tier) => {
                  const p = DEFAULT_PLANS[tier];
                  const isSelected = selectedPlan === tier;
                  return (
                    <div
                      key={tier}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedPlan(tier);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? tier === 'royal'
                            ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
                            : tier === 'platinum'
                            ? 'bg-cyan-500/15 border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg'
                            : 'bg-emerald-500/15 border-emerald-400 ring-2 ring-emerald-400/50 shadow-lg'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">
                            {tier === 'silver' ? '₹100 SYSTEM' : tier === 'platinum' ? '₹500 SYSTEM' : '₹1000 SYSTEM'}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                        </div>
                        <p className="text-sm font-black text-white">{p.name}</p>
                        <p className="text-xl font-black font-mono text-amber-300">₹{p.price}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] block font-bold text-emerald-400">
                          पेआउट: ₹{p.referralCommission} / Invite
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {tier === 'silver' ? 'Neon Smart ID' : tier === 'platinum' ? 'Platinum Shield' : 'Liquid Gold VIP'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Plan Reward Summary Note */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                चुने गए <strong className="text-amber-300">₹{currentPlan.price} {currentPlan.name}</strong> में आपको लाइफटाइम डिजिटल पहचान पत्र मिलेगा और हर डायरेक्ट रेफरल पर <strong className="text-emerald-400">₹{currentPlan.referralCommission} का सीधा पेआउट</strong> आपके UPI में प्राप्त होगा।
              </p>
            </div>

            {/* Step 1 Actions */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleNextToStep2}
                className="btn-3d-amber w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>अगला चरण: व्यक्तिगत जानकारी (Next)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: PERSONAL DETAILS ================= */}
        {currentStep === 2 && (
          <div className="p-4 sm:p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  पूरा नाम (Full Name) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="उदा. राहुल शर्मा"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  10-अंकों का मोबाइल नंबर (Mobile No) *
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Live Preview of Permanent Fixed Non-Editable User ID */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/40 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white flex items-center gap-1.5">
                    <span>स्थायी व नॉन-एडिटेबल यूजर आईडी (Fixed ID)</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">LOCKED</span>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {name.trim() ? `नाम (${name.trim()}) व चुने गए प्लान (₹${currentPlan.price}) अनुसार ऑटो-असाइन` : 'नाम और प्लान के अनुसार ऑटो-जनरेट'}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-400/60 text-amber-300 font-mono font-black text-xs tracking-wider shadow-inner">
                {name.trim()
                  ? generateRainAkshUserId(selectedPlan, name.trim(), storage.getUsers())
                  : `RNX${currentPlan.price}RN01`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  ईमेल पता (Email Address)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  लॉगिन पासवर्ड बनाएं (Password) *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="कम से कम 4 अक्षर"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-9 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400">मल्टी-डिवाइस लॉगिन के लिए पासवर्ड आवश्यक है</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  शहर (City)
                </label>
                <input
                  type="text"
                  placeholder="उदा. पटना, दिल्ली, जयपुर"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  राज्य (State)
                </label>
                <input
                  type="text"
                  placeholder="उदा. बिहार, उत्तर प्रदेश"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => { sounds.playClick(); setCurrentStep(1); }}
                className="btn-3d-dark px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-300 flex items-center gap-1.5 min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>पिछला</span>
              </button>
              <button
                type="button"
                onClick={handleNextToStep3}
                className="btn-3d-amber px-6 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 min-h-[44px]"
              >
                <span>अगला चरण: नॉमिनी व UPI (Next)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: NOMINEE & RECEIVING UPI ================= */}
        {currentStep === 3 && (
          <div className="p-4 sm:p-6 space-y-4 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              ⚖️ <strong>भारत सरकार Consumer Direct Selling Rules 2021:</strong> हर डिजिटल एफिलिएट खाते के लिए एक नामांकित व्यक्ति (Nominee) व वैध पेआउट खाता दर्ज करना अनिवार्य है।
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  नॉमिनी का नाम (Nominee Full Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. सुनीता देवी"
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  नॉमिनी से संबंध (Relationship) *
                </label>
                <select
                  value={nomineeRelation}
                  onChange={(e) => setNomineeRelation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold focus:outline-none focus:border-amber-400"
                >
                  <option value="माता / पिता">माता / पिता (Parents)</option>
                  <option value="पति / पत्नी">पति / पत्नी (Spouse)</option>
                  <option value="पुत्र / पुत्री">पुत्र / पुत्री (Son / Daughter)</option>
                  <option value="भाई / बहन">भाई / बहन (Sibling)</option>
                  <option value="अन्य">अन्य पारिवारिक सदस्य (Other)</option>
                </select>
              </div>
            </div>

            {/* User Receiving UPI */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-bold">
                आपका पेआउट बैंक UPI ID (Receiving UPI Address) *
              </label>
              <div className="relative">
                <Wallet className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="उदा. 9876543210@paytm / name@okaxis / name@ybl"
                  value={receivingUpi}
                  onChange={(e) => setReceivingUpi(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-400"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                आपके द्वारा रेफर किए गए हर व्यक्ति का कमीशन सीधा इसी UPI ID पर भेजा जाएगा।
              </p>
            </div>

            {/* Privacy Toggles Engine */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                🔒 प्राइवेसी सुरक्षा मास्क इंजन (Privacy Mask Engine)
              </span>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300 font-medium">आईडी कार्ड पर मोबाइल नंबर मास्क करें (+91 ••••••845)</span>
                <input
                  type="checkbox"
                  checked={maskMobile}
                  onChange={(e) => setMaskMobile(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300 font-medium">ईमेल आईडी मास्क करें (r•••••@gmail.com)</span>
                <input
                  type="checkbox"
                  checked={maskEmail}
                  onChange={(e) => setMaskEmail(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 cursor-pointer"
                />
              </label>
            </div>

            {/* Step 3 Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => { sounds.playClick(); setCurrentStep(2); }}
                className="btn-3d-dark px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-300 flex items-center gap-1.5 min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>पिछला</span>
              </button>
              <button
                type="button"
                onClick={handleNextToStep4}
                className="btn-3d-amber px-6 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 min-h-[44px]"
              >
                <span>अगला चरण: QR कोड भुगतान (Next)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: OFFICIAL PAYMENT GATEWAY ================= */}
        {currentStep === 4 && (
          <div className="p-4 sm:p-6 space-y-4 text-xs">
            {/* Payment Method Switcher */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => { sounds.playClick(); setPaymentTab('upi'); }}
                className={`flex-1 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition ${
                  paymentTab === 'upi' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>आधिकारिक UPI Gateway (GooglePay/PhonePe/Paytm)</span>
              </button>
              {config.enableStripe && (
                <button
                  type="button"
                  onClick={() => { sounds.playClick(); setPaymentTab('stripe'); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition ${
                    paymentTab === 'stripe' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>कार्ड भुगतान (Card / Stripe)</span>
                </button>
              )}
            </div>

            {paymentTab === 'upi' ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-400/50 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  {/* Dynamic QR Code */}
                  <div className="p-2.5 bg-white rounded-2xl shadow-xl shrink-0">
                    <img
                      src={qrCodeUrl}
                      alt="Official Payment QR"
                      className="w-36 h-36 object-contain"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                      OFFICIAL RECEIVER GATEWAY
                    </span>
                    <p className="text-xl font-black text-white">
                      ₹{currentPlan.price}{' '}
                      <span className="text-xs font-normal text-slate-400">({currentPlan.name})</span>
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <p className="text-[10px] text-slate-400">प्राप्तकर्ता का नाम (Payee Name):</p>
                      <p className="font-bold text-white text-xs">{receiverName} (संस्थापक)</p>
                      <div className="flex items-center justify-between pt-1">
                        <code className="text-amber-400 font-mono font-bold text-xs">{upiId}</code>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1"
                        >
                          {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedUpi ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct 1-Click Pay App Deep Link Button */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={upiUri}
                    onClick={() => sounds.playClick()}
                    className="btn-3d-emerald py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>UPI ऐप से सीधे भुगतान करें (1-Click Pay)</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="btn-3d-dark py-3 rounded-2xl text-xs font-bold text-slate-300 flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>UPI आईडी कॉपी करें ({upiId})</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <p className="font-bold text-white">📌 भुगतान के बाद क्या करें?</p>
                  <p>
                    अपने UPI ऐप से ₹{currentPlan.price} का भुगतान पूरा करने के बाद मिलने वाला <strong>12-अंकों का UTR नंबर</strong> कॉपी कर लें और नीचे अगले चरण में दर्ज करें।
                  </p>
                </div>
              </div>
            ) : (
              /* Stripe Mock Interface */
              <div className="space-y-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-white block">डेबिट / क्रेडिट कार्ड विवरण</span>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSimulateStripe}
                  disabled={stripeProcessing}
                  className="btn-3d-cyan w-full py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
                >
                  {stripeProcessing ? 'कार्ड सत्यापित हो रहा है...' : `Pay ₹${currentPlan.price} Instantly`}
                </button>
              </div>
            )}

            {/* Step 4 Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => { sounds.playClick(); setCurrentStep(3); }}
                className="btn-3d-dark px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-300 flex items-center gap-1.5 min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>पिछला</span>
              </button>
              <button
                type="button"
                onClick={handleNextToStep5}
                className="btn-3d-amber px-6 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 min-h-[44px]"
              >
                <span>मैंने भुगतान कर दिया है: UTR डालें (Next)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: UTR VERIFICATION & ACTIVATION ================= */}
        {currentStep === 5 && (
          <form onSubmit={handleFinalSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
            {/* Review Summary */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">सदस्य का नाम:</span>
                <span className="text-white">{name} ({phone})</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">चुना गया प्लान:</span>
                <span className="text-amber-400 font-mono">₹{currentPlan.price} ({currentPlan.name})</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">पेआउट UPI खाता:</span>
                <span className="text-emerald-400 font-mono">{receivingUpi}</span>
              </div>
            </div>

            {/* UTR Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-200 font-bold">
                  12-अंकों का बैंक UTR रेफरेंस नंबर दर्ज करें *
                </label>
                <span className="text-[10px] text-amber-400 font-mono font-bold">
                  {utrNumber.replace(/\D/g, '').length}/12 अंक
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={22}
                placeholder="उदा. 431289123456 या IMPS123456"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-3 rounded-2xl bg-slate-950 border-2 border-amber-400/70 text-amber-300 font-mono font-black text-sm tracking-widest focus:outline-none focus:border-amber-300"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                पेमेंट स्लिप या SMS में 12 डिजिट का UPI Ref / UTR No. होता है।
              </span>
            </div>

            {/* Payment Proof Screenshot Upload */}
            <div>
              <label className="block text-slate-200 font-bold mb-1.5">
                पेमेंट स्क्रीनशॉट अपलोड करें (वैकल्पिक / Optional Proof)
              </label>
              <div className="flex items-center gap-3">
                <label className="btn-3d-dark px-4 py-2.5 rounded-xl cursor-pointer text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>फोटो चुनें</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {proofImage ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={proofImage}
                      alt="Uploaded Proof"
                      className="w-10 h-10 rounded-lg object-cover border border-emerald-400"
                    />
                    <span className="text-[11px] text-emerald-400 font-bold">✓ फोटो अपलोड हो गई</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-500">JPG, PNG समर्थित</span>
                )}
              </div>
            </div>

            {/* Compliance Terms Checkbox */}
            <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 accent-amber-400 mt-0.5"
              />
              <span className="text-[11px] text-slate-300 leading-snug">
                मैं पुष्टि करता हूँ कि मैंने <strong className="text-white">8877490845@spicepay (विकास कुमार)</strong> को निर्धारित राशि भेजी है। मैं भारत सरकार Consumer Direct Selling Rules 2021 के नियमों से सहमत हूँ।
              </span>
            </label>

            {/* Step 5 Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => { sounds.playClick(); setCurrentStep(4); }}
                className="btn-3d-dark px-4 py-3 rounded-2xl text-xs font-bold text-slate-300 flex items-center gap-1.5 min-h-[46px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>पिछला</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-3d-rainbow flex-1 py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-2xl active:scale-95 disabled:opacity-50 min-h-[46px]"
              >
                {isSubmitting ? (
                  <span>सत्यापित हो रहा है...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white text-white" />
                    <span>रजिस्ट्रेशन पूरा करें & डिजिटल आईडी कार्ड पाएं</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
