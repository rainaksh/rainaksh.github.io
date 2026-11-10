import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Crown,
  Lock,
  Sparkles,
  ArrowRight,
  User,
  Search,
  CheckCircle2,
  Copy,
  Zap,
} from 'lucide-react';
import { storage } from '../services/storage';
import { DigitalIdCard } from './DigitalIdCard';
import { PlanTier, UserProfile } from '../types';
import { sounds, triggerCelebration } from '../utils/audioCelebration';

interface SponsorCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSponsorId?: string;
  onOpenJoinModal?: (plan?: PlanTier, sponsorId?: string) => void;
  onOpenLogin?: () => void;
  onOpenVerifyModal?: () => void;
}

export const SponsorCardModal: React.FC<SponsorCardModalProps> = ({
  isOpen,
  onClose,
  initialSponsorId = '',
  onOpenJoinModal,
  onOpenLogin,
  onOpenVerifyModal,
}) => {
  const [inputSponsorId, setInputSponsorId] = useState<string>(initialSponsorId || '');
  const [activeSponsorId, setActiveSponsorId] = useState<string>(initialSponsorId || '');
  const [searchError, setSearchError] = useState<string>('');

  // Sync if initialSponsorId changes
  React.useEffect(() => {
    if (initialSponsorId) {
      setInputSponsorId(initialSponsorId);
      setActiveSponsorId(initialSponsorId);
    }
  }, [initialSponsorId]);

  if (!isOpen) return null;

  // Retrieve sponsor user from storage
  const foundUser = activeSponsorId ? storage.getUserById(activeSponsorId) : null;
  
  // Safe resolved user profile only if activeSponsorId is set
  const targetUser: UserProfile | null = activeSponsorId
    ? (foundUser || (activeSponsorId.toUpperCase().includes('VK') ? storage.getUserById('RNX1000VK01') || null : null)) || null
    : null;

  const handleSearchSponsor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sounds.playClick();
    setSearchError('');
    const clean = inputSponsorId.trim().toUpperCase();
    if (!clean) {
      setSearchError('कृपया स्पॉन्सर आईडी दर्ज करें।');
      return;
    }
    const user = storage.getUserById(clean);
    if (user) {
      setActiveSponsorId(user.userId || user.id);
      triggerCelebration();
    } else if (clean === 'RNX1000RN01' || clean === 'RNX1000VK01' || clean === 'RX_MAIN_001') {
      setActiveSponsorId(clean);
      triggerCelebration();
    } else {
      setSearchError(`आईडी "${clean}" का स्पॉन्सर रिकॉर्ड नहीं मिला। कृपया सही आईडी दर्ज करें।`);
    }
  };

  const handleJoinUnderSponsor = () => {
    sounds.playClick();
    triggerCelebration();
    onClose();
    if (onOpenJoinModal) {
      onOpenJoinModal('platinum', targetUser?.userId || activeSponsorId || 'RNX1000VK01');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sounds.playClick();
          onClose();
        }
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-[#0B0C10] border-2 border-amber-400/90 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.35)] overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-200"
      >
        
        {/* Top Header Bar */}
        <div className="p-3.5 sm:p-5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border-b border-amber-500/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xs sm:text-base font-black text-white flex items-center gap-1.5 sm:gap-2">
                <span>प्रमाणित स्पॉन्सर डिजिटल आईडी कार्ड</span>
                <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                  VERIFIED
                </span>
              </h3>
              <p className="text-[10px] text-amber-300 font-mono mt-0.5">
                Sponsor Digital ID Passport & Security Verification
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 sm:p-2 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition min-h-[36px] min-w-[36px] flex items-center justify-center shadow"
            aria-label="Close Pop-up"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 text-xs text-slate-300">
          
          {/* STATE A: NO SPONSOR ENTERED YET (Organic Visitor View) */}
          {!targetUser ? (
            <div className="space-y-4 py-2">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/50 via-slate-900 to-slate-950 border-2 border-amber-400/70 space-y-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-300">
                  <Search className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-sm sm:text-base font-black text-white">
                  स्पॉन्सर विवरण सत्यापन केंद्र
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                  भारत सरकार डायरेक्ट सेलिंग दिशानिर्देश 2021 के अनुसार किसी भी पंजीकृत सदस्य का प्रमाणित डिजिटल कार्ड देखने व उनके अंतर्गत जॉइन करने हेतु उनकी <strong>स्पॉन्सर आईडी</strong> दर्ज करें।
                </p>

                {/* Form to enter sponsor ID */}
                <form onSubmit={handleSearchSponsor} className="flex flex-col sm:flex-row gap-2 pt-2 max-w-md mx-auto">
                  <input
                    type="text"
                    value={inputSponsorId}
                    onChange={(e) => setInputSponsorId(e.target.value.toUpperCase())}
                    placeholder="स्पॉन्सर आईडी दर्ज करें (उदा. RNX1000...)"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border-2 border-slate-700 text-white font-mono font-black text-xs tracking-wider focus:outline-none focus:border-amber-400 text-center sm:text-left"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="btn-3d-amber px-5 py-2.5 rounded-xl text-xs font-black shrink-0 flex items-center justify-center gap-1.5 shadow"
                  >
                    <span>सत्यापित करें व कार्ड देखें</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {searchError && (
                  <p className="text-[11px] text-rose-400 font-bold bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/30">
                    {searchError}
                  </p>
                )}
              </div>

              {/* Safe alternative for users who have no sponsor */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-center">
                <p className="text-[11px] text-slate-400">
                  क्या आपके पास कोई स्पॉन्सर आईडी नहीं है?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setInputSponsorId('RNX1000VK01');
                    setActiveSponsorId('RNX1000VK01');
                    setSearchError('');
                    triggerCelebration();
                  }}
                  className="btn-3d-dark px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold text-amber-300 hover:text-white border border-amber-400/40 inline-flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>संस्थापक आईडी (RNX1000VK01 - विकास कुमार) से जुड़ें</span>
                </button>
                <p className="text-[10px] text-slate-500 pt-1">
                  या सहायता केंद्र से संपर्क करें: Telegram @rainaksh • Email accaiwork@gmail.com
                </p>
              </div>
            </div>
          ) : (
            /* STATE B: SPONSOR ENTERED AND VERIFIED */
            <>
              {/* Change / Re-search Sponsor ID bar */}
              <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[11px] text-slate-300 truncate">
                    सत्यापित स्पॉन्सर: <strong className="text-white font-black">{targetUser.fullName || targetUser.name}</strong> (<span className="text-amber-400 font-mono font-bold">{targetUser.userId || targetUser.id}</span>)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActiveSponsorId('');
                    setInputSponsorId('');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 hover:text-white text-[10px] font-bold shrink-0"
                >
                  दूसरी आईडी जांचें
                </button>
              </div>

              {/* Privacy Masking Info Banner */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white text-[11px]">
                      सुरक्षित प्राइवेसी मास्किंग (+91 ••••••845)
                    </p>
                    <p className="text-[10px] text-slate-400">
                      सरकारी गोपनीयता नियमों के अनुसार फोन नंबर सुरक्षित मास्क किया गया है।
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  100% SECURE
                </span>
              </div>

              {/* The Actual Digital ID Card */}
              <div className="w-full">
                <DigitalIdCard
                  user={targetUser}
                  isPublicView={false}
                  allowDownload={true}
                  showPrivacyToggles={true}
                />
              </div>

              {/* Sponsor Verification Details Summary Box in Devanagari */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">स्पॉन्सर का नाम:</span>
                  <strong className="text-white font-bold">{targetUser.fullName || targetUser.name}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">स्थायी यूजर आईडी:</span>
                  <strong className="text-amber-400 font-mono font-black">{targetUser.userId || targetUser.id}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">अपलाइन आईडी:</span>
                  <strong className="text-cyan-400 font-mono font-bold">{targetUser.sponsorId}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">सदस्यता टियर:</span>
                  <span className="text-emerald-400 font-bold uppercase">{targetUser.plan || 'Royal'} System (आजीवन)</span>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleJoinUnderSponsor}
                  className="btn-3d-rainbow py-3.5 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl min-h-[46px]"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>इस स्पॉन्सर से जुड़ें (Join Now)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onClose();
                    onOpenLogin?.();
                  }}
                  className="btn-3d-dark py-3.5 px-4 rounded-2xl text-xs font-bold text-slate-200 flex items-center justify-center gap-2 min-h-[46px]"
                >
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>अकाउंट में लॉगिन करें (Log In)</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Modal Bottom Footer Strip */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
              onOpenVerifyModal?.();
            }}
            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>अन्य सदस्य आईडी सर्च करें ↗</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="btn-3d-dark px-4 py-1.5 rounded-xl text-xs font-bold text-slate-300"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
