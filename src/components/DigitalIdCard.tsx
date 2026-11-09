import React, { useState, useRef } from 'react';
import {
  Crown,
  ShieldCheck,
  Download,
  Share2,
  Copy,
  CheckCircle2,
  RotateCw,
  Sparkles,
  Fingerprint,
  Lock,
  Globe,
  Award,
} from 'lucide-react';
import { UserProfile, PlanTier } from '../types';
import { ProfileFrame } from './ProfileFrame';
import { BrandLogo } from './BrandLogo';
import { sounds, triggerCelebration } from '../utils/audioCelebration';

interface DigitalIdCardProps {
  user: UserProfile;
  planOverride?: PlanTier;
  allowDownload?: boolean;
  showPrivacyToggles?: boolean;
  onPrivacyChange?: (updated: UserProfile['privacySettings']) => void;
  isPublicView?: boolean;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({
  user,
  planOverride,
  allowDownload = true,
  showPrivacyToggles = false,
  onPrivacyChange,
  isPublicView = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedIdToast, setCopiedIdToast] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const plan = planOverride || user.plan || (user.currentPlan === '1000' ? 'royal' : user.currentPlan === '500' ? 'platinum' : 'silver');

  // Privacy masking logic per blueprint: +91 ******845
  const maskPhone = (phone: string) => {
    if (!phone) return '+91 ••••••845';
    const isMasked = user.privacySettings?.maskMobile ?? user.privacy?.maskPhone ?? true;
    if (!isMasked && !isPublicView) return phone;
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 6) return '+91 ••••••';
    return `+91 ••••••${clean.slice(-3)}`;
  };

  const maskEmail = (email: string) => {
    if (!email) return '•••••@••••';
    const isMasked = user.privacySettings?.maskEmail ?? user.privacy?.maskEmail ?? true;
    if (!isMasked && !isPublicView) return email;
    const parts = email.split('@');
    if (parts.length !== 2) return '••••••@••••';
    const name = parts[0];
    const maskedName = name.length > 2 ? `${name[0]}••••${name.slice(-1)}` : '••••';
    return `${maskedName}@${parts[1]}`;
  };

  const displayUserId = user.userId || user.id || 'RNX1000RN01';
  const displaySponsorId = user.sponsorId || 'RNX1000VK01';
  const displayName = user.fullName || user.name || 'Member Name';
  const displayAvatar = user.profilePic || user.avatarUrl;

  // Tier UI accents
  const getCardTheme = () => {
    switch (plan) {
      case 'royal':
        return {
          wrapper: 'bg-gradient-to-br from-amber-950 via-[#0B0C10] to-amber-900 border-2 border-amber-400 shadow-[0_15px_40px_rgba(245,158,11,0.35)]',
          nameplate: 'bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 text-amber-950 border border-amber-400/90 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.5)] font-serif font-black tracking-wide',
          tierLabel: 'CROWN ROYALE VIP GOLD',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/50',
          chipColor: 'from-yellow-300 via-amber-400 to-yellow-600',
          hologramColor: 'from-amber-400/25 via-yellow-300/30 to-amber-500/10',
          accentBorder: 'border-amber-400',
          icon: <Crown className="w-5 h-5 text-amber-300 fill-amber-400 drop-shadow" />,
        };
      case 'platinum':
        return {
          wrapper: 'bg-gradient-to-br from-slate-950 via-[#0B0C10] to-cyan-950 border-2 border-cyan-400/90 shadow-[0_15px_35px_rgba(56,189,248,0.3)]',
          nameplate: 'bg-gradient-to-r from-cyan-950 to-slate-900 text-cyan-200 border border-cyan-400/70 shadow-inner font-sans font-bold',
          tierLabel: 'PLATINUM SHIELD MEMBER',
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50',
          chipColor: 'from-slate-200 via-cyan-300 to-slate-400',
          hologramColor: 'from-cyan-400/30 via-blue-400/20 to-teal-300/25',
          accentBorder: 'border-cyan-400',
          icon: <Sparkles className="w-5 h-5 text-cyan-300" />,
        };
      case 'silver':
      default:
        return {
          wrapper: 'bg-gradient-to-br from-[#0B0C10] via-zinc-950 to-slate-900 border-2 border-emerald-400/80 shadow-[0_10px_30px_rgba(16,185,129,0.25)]',
          nameplate: 'bg-slate-900/90 text-slate-100 border border-emerald-400/40 shadow-sm font-sans font-bold',
          tierLabel: 'BASIC NORMAL NEON SYSTEM',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
          chipColor: 'from-emerald-300 via-teal-300 to-emerald-500',
          hologramColor: 'from-emerald-400/20 via-teal-300/15 to-transparent',
          accentBorder: 'border-emerald-400',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
        };
    }
  };

  const theme = getCardTheme();

  const handleShare = () => {
    sounds.playClick();
    triggerCelebration();
    const origin = window.location.origin;
    const shareUrl = `${origin}?verify=${encodeURIComponent(displayUserId)}&ref=${encodeURIComponent(displayUserId)}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyUserId = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    triggerCelebration();
    navigator.clipboard.writeText(displayUserId);
    setCopiedIdToast(true);
    setTimeout(() => setCopiedIdToast(false), 2500);
  };

  const handleDownload = () => {
    sounds.playClick();
    triggerCelebration();
    window.print();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Interactive Controls Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-bold text-slate-300">
          <Fingerprint className="w-4 h-4 text-cyan-400" />
          <span>Govt. Direct Selling Verified ID</span>
        </span>
        <button
          onClick={() => {
            sounds.playClick();
            setIsFlipped(!isFlipped);
          }}
          className="btn-3d-dark flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold text-slate-300"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{isFlipped ? 'Show Front' : 'Show Back'}</span>
        </button>
      </div>

      {/* The Digital ID Card Element */}
      <div
        ref={cardRef}
        className={`relative w-full aspect-auto sm:aspect-[1.58/1] min-h-[220px] rounded-3xl overflow-hidden transition-all duration-500 select-none shadow-2xl ${theme.wrapper}`}
        style={{ perspective: '1000px' }}
      >
        {/* Security Watermark Guilloche Micro-Grid Texture */}
        <div className="absolute inset-0 security-watermark-grid opacity-35 pointer-events-none" />

        {/* Large Prominent Centered RAINAKSH Bold Watermark Typography */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <span className="text-[36px] sm:text-[76px] font-black tracking-[0.22em] text-white/[0.08] select-none font-sans uppercase -rotate-12 transform scale-110 drop-shadow-sm">
            RAINAKSH
          </span>
        </div>

        {/* Diagonal Repeating RAINAKSH High-Security Micro-Text Watermark */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 flex items-center justify-center opacity-25 rotate-[-22deg] scale-125">
          <div className="flex flex-col gap-3.5 text-center whitespace-nowrap font-mono font-black tracking-widest text-[8px] sm:text-[10px]">
            <span className="text-white/60">
              ✦ RAINAKSH ✦ OFFICIAL DIGITAL PASSPORT ✦ RAINAKSH ✦ SPONSOR: {displaySponsorId} ✦ RAINAKSH ✦
            </span>
            <span className="text-amber-300 font-extrabold">
              ★ RAINAKSH NETWORK ★ GOVT DIRECT SELLING 2021 VALIDATED ★ RAINAKSH ★ UNIQUE ID: {displayUserId} ★
            </span>
            <span className="text-cyan-300 font-extrabold">
              ✦ RAINAKSH ✦ DIRECT UPI SETTLEMENT ✦ RAINAKSH ✦ ANTI-COUNTERFEIT ID ✦ RAINAKSH ✦
            </span>
            <span className="text-white/60">
              ★ RAINAKSH NETWORK ★ LIFETIME MEMBERSHIP CREDENTIAL ★ RAINAKSH ★ VERIFIED BY VIKAS KUMAR ★
            </span>
            <span className="text-amber-300 font-extrabold">
              ✦ RAINAKSH ✦ SPONSOR ID: {displaySponsorId} • 100% CONSUMER COMPLIANT • RAINAKSH ✦
            </span>
          </div>
        </div>

        {/* Holographic light sweep & edge glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-tr ${theme.hologramColor} pointer-events-none opacity-50 mix-blend-overlay`}
        />
        <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        {!isFlipped ? (
          /* ================= FRONT SIDE ================= */
          <div className="relative h-full flex flex-col justify-between p-3 sm:p-5 z-10 text-white">
            {/* Header Ribbon: Pure Typographic RainAksh Logo without icon */}
            <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-2">
              <div className="min-w-0">
                <BrandLogo size="xs" showTagline={false} />
                <p className="text-[9px] sm:text-[10px] text-cyan-300 font-mono font-bold tracking-tight flex items-center gap-1 mt-0.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="truncate">Digital Identity & Affiliate Passport</span>
                </p>
              </div>

              {/* Status & Plan Pill */}
              <div className="text-right shrink-0">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider border ${theme.badgeBg}`}>
                  <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                  {user.verificationStatus === 'verified' || user.planStatus === 'active' ? 'VERIFIED' : 'PENDING'}
                </span>
                <p className="text-[8px] sm:text-[9px] text-amber-400/90 font-mono font-bold tracking-wider mt-0.5 truncate max-w-[120px]">
                  {theme.tierLabel}
                </p>
              </div>
            </div>

            {/* Middle Section: Photo with frame + Nameplate */}
            <div className="grid grid-cols-12 gap-3 items-center my-auto">
              <div className="col-span-4 flex flex-col items-center">
                <ProfileFrame
                  src={displayAvatar}
                  alt={displayName}
                  frame={user.avatarFrame || (plan === 'royal' ? 'golden_crown' : plan === 'platinum' ? 'platinum' : 'silver')}
                  size="lg"
                  showCrownBadge={plan === 'royal'}
                />
                <button
                  type="button"
                  onClick={handleCopyUserId}
                  className="mt-1.5 text-[9px] font-mono text-cyan-300 hover:text-white font-black bg-slate-950/90 hover:bg-slate-900 px-2 py-0.5 rounded-lg border border-cyan-400/40 hover:border-cyan-300 flex items-center gap-1 transition-all active:scale-95 shadow-sm"
                  title="Copy User ID"
                >
                  <span>{displayUserId}</span>
                  {copiedIdToast ? (
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 animate-in zoom-in-75 duration-150" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 text-cyan-400/80" />
                  )}
                </button>
              </div>

              <div className="col-span-8 flex flex-col justify-center space-y-1.5 pl-1">
                {/* Golden / Platinum / Neon Nameplate */}
                <div className={`px-2.5 py-1.5 rounded-xl ${theme.nameplate}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] uppercase tracking-wider opacity-70 block font-sans">
                      CARD HOLDER NAME
                    </span>
                    {plan === 'royal' && (
                      <span className="flex items-center gap-0.5 text-[8px] bg-amber-950/30 text-amber-950 px-1 rounded font-black">
                        <Crown className="w-2.5 h-2.5 fill-amber-500" /> VIP
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold truncate drop-shadow-sm tracking-wide">
                    {displayName}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-x-1.5 gap-y-1 text-[9px] sm:text-[11px] bg-slate-950/70 p-1.5 sm:p-2 rounded-xl border border-white/5 backdrop-blur-sm">
                  <div className="truncate">
                    <span className="text-slate-400 text-[7.5px] sm:text-[9px] block uppercase truncate">Mobile (Masked)</span>
                    <span className="font-mono text-slate-200 font-bold text-[8.5px] sm:text-[10px] truncate block">{maskPhone(user.mobile || user.phone)}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400 text-[7.5px] sm:text-[9px] block uppercase truncate">Sponsor ID</span>
                    <span className="font-mono text-cyan-400 font-black text-[8.5px] sm:text-[10px] truncate block">{displaySponsorId}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400 text-[7.5px] sm:text-[9px] block uppercase truncate">Email</span>
                    <span className="text-slate-200 font-mono text-[8px] sm:text-[9.5px] truncate block">{maskEmail(user.email)}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-400 text-[7.5px] sm:text-[9px] block uppercase truncate">Valid Until</span>
                    <span className="font-mono text-emerald-400 text-[8.5px] sm:text-[10px] font-bold truncate block">2030 (Lifetime)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Smart Chip + Barcode + QR */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-auto">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-6 rounded-lg bg-gradient-to-tr ${theme.chipColor} p-0.5 shadow border border-yellow-200/50 flex flex-col justify-around`}>
                  <div className="h-0.5 bg-slate-950/40 rounded" />
                  <div className="h-0.5 bg-slate-950/40 rounded" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">
                    RAINAKSH VALIDATED
                  </p>
                  <p className="text-[9px] font-mono text-cyan-300 font-bold tracking-tight">
                    AUTHENTIC PASS
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white p-0.5 rounded-lg shadow-sm border border-slate-300 flex items-center justify-center">
                  <svg className="w-full h-full text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm10 0h2v2h-2v-2zm4 0h4v2h-4v-2zm-4 4h2v4h-2v-4zm4 2h4v2h-4v-2zm0-4h2v2h-2v-2zm-6-2h2v2h-2v-2z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-slate-400 uppercase font-mono">WATERMARK</p>
                  <p className="text-[10px] font-mono font-bold text-amber-300">
                    {displayUserId.replace('RX_', '#')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= BACK SIDE ================= */
          <div className="relative h-full flex flex-col justify-between p-4 sm:p-5 z-10 text-white bg-slate-950/95 overflow-hidden">
            {/* Back Side RAINAKSH Watermark Stamp */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
              <span className="text-[48px] sm:text-[72px] font-black tracking-[0.22em] text-white/[0.05] select-none font-sans uppercase -rotate-12 transform scale-110">
                RAINAKSH
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>TERMS & OFFICIAL VERIFICATION PORTAL</span>
              </div>
              <span className="text-[9px] font-mono text-slate-400">DIRECT SELLING 2021 COMPLIANT</span>
            </div>

            <div className="h-7 w-full bg-slate-900 border-y border-white/10 my-1 flex items-center px-3">
              <div className="w-full h-1 bg-gradient-to-r from-amber-500/30 via-cyan-400/40 to-amber-500/30" />
            </div>

            <div className="space-y-1.5 text-[9px] sm:text-[10px] text-slate-300">
              <p className="leading-tight text-slate-400">
                1. This digital membership passport is issued by <strong className="text-white">RainAksh Network</strong> for verified direct affiliate services.
              </p>
              <p className="leading-tight text-slate-400">
                2. Member is entitled to instant referral commission payouts on direct sponsor sales (₹65 / ₹365 / ₹765).
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                <div>
                  <span className="text-slate-400 text-[8px] block uppercase">DIRECTOR / ADMIN</span>
                  <span className="font-bold text-amber-300 text-xs">Vikas Kumar</span>
                  <span className="text-[8px] text-slate-400 block font-mono">UPI: 8877490845@spicepay</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[8px] block uppercase">PORTAL URL</span>
                  <span className="font-mono text-cyan-300 text-[10px] flex items-center gap-1 justify-end">
                    <Globe className="w-3 h-3" /> rainaksh.network
                  </span>
                  <span className="text-[8px] text-slate-400 block">Support: +91 8877490845</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[9px]">
              <div className="font-serif italic text-amber-200 text-sm opacity-90">
                Vikas Kumar
              </div>
              <div className="font-mono text-[9px] text-slate-400">
                PASSPORT REF: {displayUserId}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3D Action Buttons */}
      <div className="w-full grid grid-cols-3 gap-1.5 sm:gap-2 mt-3.5">
        <button
          onClick={handleShare}
          className="btn-3d-dark flex items-center justify-center gap-1 py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-2xl text-[10px] sm:text-xs font-bold text-slate-200"
          title="Share Digital Card"
        >
          {copiedLink ? (
            <>
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
              <span className="text-emerald-400 truncate">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">Share</span>
            </>
          )}
        </button>

        {allowDownload && (
          <button
            onClick={handleDownload}
            className="btn-3d-cyan flex items-center justify-center gap-1 py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-2xl text-[10px] sm:text-xs font-black"
            title="Download / Print ID"
          >
            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">Save ID</span>
          </button>
        )}

        <button
          onClick={() => {
            sounds.playClick();
            setIsFlipped(!isFlipped);
          }}
          className="btn-3d-amber flex items-center justify-center gap-1 py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-2xl text-[10px] sm:text-xs font-black"
          title="Flip ID Card"
        >
          <RotateCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="truncate">Flip</span>
        </button>
      </div>

      {/* Privacy Control Drawer */}
      {showPrivacyToggles && onPrivacyChange && (
        <div className="w-full mt-4 p-4 rounded-3xl bg-slate-900 border border-slate-800 text-xs space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between font-bold text-slate-200">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Digital ID Card Privacy Engine
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded font-mono font-bold">
              Data Masking Active
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Prompt Rule: By default mobile number masked rehta hai. Aap card ko public ya private kar sakte hain.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-slate-300 font-bold">Public Card Access</span>
              <input
                type="checkbox"
                checked={user.privacySettings?.isCardPublic ?? true}
                onChange={(e) => {
                  sounds.playClick();
                  onPrivacyChange({
                    ...user.privacySettings,
                    isCardPublic: e.target.checked,
                  });
                }}
                className="w-4 h-4 rounded text-amber-500 accent-amber-500 focus:ring-amber-400"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-slate-300 font-bold">Mask Mobile Number</span>
              <input
                type="checkbox"
                checked={user.privacySettings?.maskMobile ?? true}
                onChange={(e) => {
                  sounds.playClick();
                  onPrivacyChange({
                    ...user.privacySettings,
                    maskMobile: e.target.checked,
                  });
                }}
                className="w-4 h-4 rounded text-amber-500 accent-amber-500 focus:ring-amber-400"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-slate-300 font-bold">Mask Email Address</span>
              <input
                type="checkbox"
                checked={user.privacySettings?.maskEmail ?? true}
                onChange={(e) => {
                  sounds.playClick();
                  onPrivacyChange({
                    ...user.privacySettings,
                    maskEmail: e.target.checked,
                  });
                }}
                className="w-4 h-4 rounded text-amber-500 accent-amber-500 focus:ring-amber-400"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-slate-300 font-bold">Mask Earnings</span>
              <input
                type="checkbox"
                checked={user.privacySettings?.maskEarnings ?? false}
                onChange={(e) => {
                  sounds.playClick();
                  onPrivacyChange({
                    ...user.privacySettings,
                    maskEarnings: e.target.checked,
                  });
                }}
                className="w-4 h-4 rounded text-amber-500 accent-amber-500 focus:ring-amber-400"
              />
            </label>
          </div>
        </div>
      )}

      {/* Toast Notification for Copied User ID */}
      {copiedIdToast && (
        <div className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/95 border-2 border-emerald-400 text-emerald-300 text-xs font-bold shadow-[0_12px_30px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
          <span>Membership User ID copied: <strong className="font-mono text-white tracking-wider">{displayUserId}</strong></span>
        </div>
      )}
    </div>
  );
};
