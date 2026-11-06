import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Share2,
  Fingerprint,
  Crown,
  Zap,
} from 'lucide-react';
import { UserProfile, Transaction } from '../types';
import { DigitalIdCard } from './DigitalIdCard';
import { sounds } from '../utils/audioCelebration';

interface ThankYouModalProps {
  user: UserProfile;
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
  onGoToDashboard: () => void;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({
  user,
  transaction,
  isOpen,
  onClose,
  onGoToDashboard,
}) => {
  const myUserId = user.userId || user.id;
  const isRoyal = transaction.plan === 'royal' || transaction.planAmount === 1000;
  const isPlatinum = transaction.plan === 'platinum' || transaction.planAmount === 500;

  // Custom multi-burst confetti explosion for plan upgrades
  const firePlanUpgradeConfettiExplosion = () => {
    sounds.playJackpot();

    // Tier-matched color themes
    const colors = isRoyal
      ? ['#F59E0B', '#FBBF24', '#FEF08A', '#FFFFFF', '#D97706']
      : isPlatinum
      ? ['#38BDF8', '#66FCF1', '#BAE6FD', '#FFFFFF', '#0284C7']
      : ['#34D399', '#10B981', '#6EE7B7', '#FFFFFF', '#059669'];

    // 1. Center massive blast
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
      colors,
      scalar: 1.2,
      ticks: 250,
    });

    // 2. Left cannon explosion
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.75 },
        colors,
      });
    }, 200);

    // 3. Right cannon explosion
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.75 },
        colors,
      });
    }, 400);

    // 4. Cascade stars/circles shower
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 120,
        origin: { y: 0.3 },
        colors,
        shapes: ['circle'],
        scalar: 0.9,
      });
    }, 650);
  };

  useEffect(() => {
    if (isOpen) {
      firePlanUpgradeConfettiExplosion();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleShareWhatsApp = () => {
    sounds.playClick();
    const text = `🎉 Maine RainAksh Network join kar liya hai! Mera Unique User ID: ${myUserId}. Aap bhi join karein aur har referral par ₹65 se ₹765 kamayein: ${window.location.origin}?ref=${myUserId}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0B0C10] border-2 border-amber-500/50 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.35)] overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Celebration Header */}
        <div className="p-6 text-center bg-gradient-to-b from-amber-500/20 via-[#0B0C10] to-[#0B0C10] border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl btn-3d-emerald text-slate-950 mx-auto flex items-center justify-center mb-3 animate-bounce shadow-xl">
            {isRoyal ? <Crown className="w-9 h-9 fill-slate-950 text-slate-950" /> : <CheckCircle2 className="w-9 h-9" />}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-black border border-amber-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Plan Upgrade & Membership Active!</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Congratulations, {user.fullName || user.name}!
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg mx-auto">
            Aapka UTR ({transaction.upiTxnRef || transaction.utrNumber}) dispatch ho chuka hai.
            Aapka RainAksh Digital ID Card unique format <span className="text-cyan-300 font-mono font-bold">{myUserId}</span> ke sath generate ho gaya hai!
          </p>

          {/* Trigger Confetti Explosion Button */}
          <div className="pt-2">
            <button
              onClick={firePlanUpgradeConfettiExplosion}
              className="btn-3d-dark text-[11px] font-bold text-amber-300 px-3 py-1 rounded-full inline-flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Celebrate Again (Explode Confetti) 🎉</span>
            </button>
          </div>
        </div>

        {/* Content details */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="network-tile p-3">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Your Unique ID</span>
              <span className="font-mono font-black text-cyan-300 text-sm">{myUserId}</span>
            </div>

            <div className="network-tile p-3">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Upgraded Plan</span>
              <span className="font-bold text-white capitalize font-mono text-sm">
                ₹{transaction.planAmount || transaction.amount} Tier
              </span>
            </div>

            <div className="network-tile p-3">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">UTR Ref No</span>
              <span className="font-mono text-amber-300 font-bold truncate block">
                {transaction.upiTxnRef || transaction.utrNumber}
              </span>
            </div>

            <div className="network-tile p-3">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Sponsor ID</span>
              <span className="font-mono text-cyan-400 font-black">{user.sponsorId}</span>
            </div>
          </div>

          {/* Digital ID Card Preview */}
          <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-3 px-1 text-xs text-slate-400">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4 text-amber-400" />
                <span>Aapka Digital Membership Card Preview</span>
              </span>
              <span className="text-emerald-400 font-bold text-[11px] bg-emerald-500/10 px-2.5 py-0.5 rounded">
                Tier Verified
              </span>
            </div>

            <DigitalIdCard user={user} allowDownload={false} />
          </div>
        </div>

        {/* 3D Action Footer with Depth Shadows */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleShareWhatsApp}
            className="btn-3d-emerald w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-black"
          >
            <Share2 className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onGoToDashboard();
            }}
            className="btn-3d-amber w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-xs font-black"
          >
            <span>Open User Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
