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
  initialSponsorId = 'RNX1000RN01',
  onOpenJoinModal,
  onOpenLogin,
  onOpenVerifyModal,
}) => {
  const [inputSponsorId, setInputSponsorId] = useState<string>(initialSponsorId || 'RNX1000RN01');
  const [activeSponsorId, setActiveSponsorId] = useState<string>(initialSponsorId || 'RNX1000RN01');
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
  const foundUser = storage.getUserById(activeSponsorId);
  
  // Fallback defaults if looking for official seed or fallback
  const targetUser: UserProfile = foundUser || {
    id: activeSponsorId.toUpperCase().includes('VK') ? 'RNX1000VK01' : 'RNX1000RN01',
    userId: activeSponsorId.toUpperCase().includes('VK') ? 'RNX1000VK01' : 'RNX1000RN01',
    sponsorId: activeSponsorId.toUpperCase().includes('VK') ? 'RX_SYSTEM' : 'RNX1000VK01',
    fullName: activeSponsorId.toUpperCase().includes('VK') ? 'Vikas Kumar' : 'RainAksh Nityam',
    name: activeSponsorId.toUpperCase().includes('VK') ? 'Vikas Kumar' : 'RainAksh Nityam',
    email: activeSponsorId.toUpperCase().includes('VK') ? 'accaiwork@gmail.com' : 'nityam@rainaksh.network',
    mobile: '8877490845',
    phone: '8877490845',
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    avatarFrame: 'golden_crown',
    joinDate: '2025-01-01T00:00:00.000Z',
    plan: 'royal',
    currentPlan: '1000',
    verificationStatus: 'verified',
    planStatus: 'active',
    privacySettings: {
      isCardPublic: true,
      maskMobile: true,
      maskEmail: true,
      maskEarnings: false,
    },
    privacy: {
      isCardPublic: true,
      maskPhone: true,
      maskEmail: true,
      maskAddress: false,
    },
    earnings: { totalEarned: 15300, pendingPayout: 0, withdrawn: 15300 },
    walletBalance: 7650,
    totalEarned: 15300,
    totalWithdrawn: 15300,
    upiId: '8877490845@spicepay',
    city: 'Patna',
    state: 'Bihar',
  };

  const handleSearchSponsor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sounds.playClick();
    setSearchError('');
    const clean = inputSponsorId.trim().toUpperCase();
    if (!clean) {
      setSearchError('कृपया स्पॉन्सर आईडी दर्ज करें');
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
      // Fallback
      setActiveSponsorId(clean);
      setSearchError(`आईडी "${clean}" का स्पॉन्सर रिकॉर्ड लोड किया गया।`);
    }
  };

  const handleJoinUnderSponsor = () => {
    sounds.playClick();
    triggerCelebration();
    onClose();
    if (onOpenJoinModal) {
      onOpenJoinModal('platinum', targetUser.userId || activeSponsorId);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
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
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border-b border-amber-500/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
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
            className="p-2 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition min-h-[40px] min-w-[40px] flex items-center justify-center shadow"
            aria-label="Close Pop-up"
          >
            <X className="w-5 h-5 text-amber-400" />
          </button>
        </div>

        {/* 1. Enter Sponsor ID Input Box (पहले sponcer id enter kre) */}
        <div className="p-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black text-amber-300 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>स्पॉन्सर आईडी दर्ज करें (Enter Sponsor ID):</span>
            </label>
            <span className="text-[9px] text-slate-400 font-mono">Real-time Card Lookup</span>
          </div>

          <form onSubmit={handleSearchSponsor} className="flex items-center gap-2">
            <input
              type="text"
              value={inputSponsorId}
              onChange={(e) => setInputSponsorId(e.target.value.toUpperCase())}
              placeholder="उदा. RNX1000RN01 या RNX1000VK01"
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-black text-xs tracking-wider focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="btn-3d-amber px-4 py-2 rounded-xl text-xs font-black shrink-0 flex items-center gap-1 shadow"
            >
              <span>कार्ड देखें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {searchError && (
            <p className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              {searchError}
            </p>
          )}

          {/* Quick Select Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase shrink-0">Quick Select:</span>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setInputSponsorId('RNX1000RN01');
                setActiveSponsorId('RNX1000RN01');
                setSearchError('');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 shrink-0 ${
                activeSponsorId === 'RNX1000RN01'
                  ? 'bg-amber-400 text-slate-950 font-black shadow'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Crown className="w-3 h-3" />
              <span>RNX1000RN01 (RainAksh Nityam)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setInputSponsorId('RNX1000VK01');
                setActiveSponsorId('RNX1000VK01');
                setSearchError('');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 shrink-0 ${
                activeSponsorId === 'RNX1000VK01'
                  ? 'bg-cyan-400 text-slate-950 font-black shadow'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>RNX1000VK01 (Vikas Kumar)</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs text-slate-300">
          
          {/* Privacy Masking Info Banner */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <p className="font-bold text-white text-[11px]">
                  प्राइवेसी मास्किंग एक्टिव (+91 ••••••845)
                </p>
                <p className="text-[10px] text-slate-400">
                  सरकारी नियमों के अनुसार मोबाइल नंबर सुरक्षित मास्क किया गया है।
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              100% SECURE
            </span>
          </div>

          {/* The Actual Digital ID Card with Sponsor, Masked Phone, and Flip */}
          <div className="w-full">
            <DigitalIdCard
              user={targetUser}
              isPublicView={false}
              allowDownload={true}
              showPrivacyToggles={true}
            />
          </div>

          {/* Sponsor Verification Details Summary Box */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">स्पॉन्सर का नाम (Sponsor Name):</span>
              <strong className="text-white font-bold">{targetUser.fullName || targetUser.name}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">स्थायी यूजर आईडी (Fixed User ID):</span>
              <strong className="text-amber-400 font-mono font-black">{targetUser.userId || targetUser.id}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">अपलाइन स्पॉन्सर आईडी (Parent Sponsor):</span>
              <strong className="text-cyan-400 font-mono font-bold">{targetUser.sponsorId}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">सदस्यता टियर (Membership System):</span>
              <span className="text-emerald-400 font-bold uppercase">{targetUser.plan || 'Royal'} System (Lifetime)</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleJoinUnderSponsor}
              className="btn-3d-rainbow py-3.5 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xl"
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
              className="btn-3d-dark py-3.5 px-4 rounded-2xl text-xs font-bold text-slate-200 flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span>अपने अकाउंट में लॉगिन करें (Log In)</span>
            </button>
          </div>
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
