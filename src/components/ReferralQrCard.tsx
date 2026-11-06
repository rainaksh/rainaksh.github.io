import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Copy,
  CheckCircle2,
  Share2,
  Sparkles,
  ShieldCheck,
  Crown,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../types';
import { sounds, triggerCelebration } from '../utils/audioCelebration';

interface ReferralQrCardProps {
  user: UserProfile;
  referralLink: string;
  onCopySuccess?: () => void;
  className?: string;
  compact?: boolean;
}

export const ReferralQrCard: React.FC<ReferralQrCardProps> = ({
  user,
  referralLink,
  onCopySuccess,
  className = '',
  compact = false,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const myUserId = user.userId || user.id;
  const isRoyal = user.currentPlan === '1000' || user.plan === 'royal';
  const isPlatinum = user.currentPlan === '500' || user.plan === 'platinum';

  // Generate high-resolution QR code
  useEffect(() => {
    let isMounted = true;

    QRCode.toDataURL(referralLink, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0A0F1D',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR Generation Error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [referralLink]);

  const handleCopy = () => {
    sounds.playClick();
    triggerCelebration();
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setShowToast(true);
    if (onCopySuccess) onCopySuccess();
    setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 2500);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    sounds.playClick();
    triggerCelebration();

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `RainAksh_Referral_QR_${myUserId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareWhatsApp = () => {
    sounds.playClick();
    triggerCelebration();
    const text = `🔥 Join RainAksh Network with my official Sponsor ID: ${myUserId}! Scan my QR or register directly: ${referralLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (compact) {
    return (
      <div className={`p-4 rounded-3xl bg-[#0B0C10] border border-slate-800 flex flex-col items-center text-center space-y-3 relative ${className}`}>
        {/* Toast confirmation */}
        {showToast && (
          <div className="absolute -top-3 z-30 px-3 py-1 bg-emerald-500 text-slate-950 font-black text-[11px] rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Referral Link Copied!</span>
          </div>
        )}

        <div className="relative p-2 bg-white rounded-2xl shadow-xl ring-2 ring-amber-400/50">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt={`Referral QR for ${myUserId}`} className="w-32 h-32 object-contain rounded-xl" />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center bg-slate-100 rounded-xl">
              <QrCode className="w-8 h-8 text-slate-400 animate-pulse" />
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-black text-white">Scan to Join</p>
          <p className="text-[10px] text-amber-400 font-mono font-bold mt-0.5">{myUserId}</p>
        </div>

        <div className="flex gap-1.5 w-full">
          <button
            onClick={handleCopy}
            className="flex-1 btn-3d-dark py-1.5 rounded-xl text-[11px] font-bold text-slate-200 flex items-center justify-center gap-1"
            title="Copy Referral Link"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Link'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="btn-3d-cyan px-2.5 py-1.5 rounded-xl text-[11px] font-black"
            title="Download QR Image"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 sm:p-6 rounded-3xl bg-[#0B0C10] border border-slate-800 shadow-2xl space-y-4 relative overflow-hidden ${className}`}>
      {/* Toast Notification Confirmation */}
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150 border border-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>Referral Link Copied to Clipboard!</span>
        </div>
      )}

      {/* Subtle Ambient Light */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
              <span>Personal Referral QR Code</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Instant Scan
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Share with contacts or print to get direct referrals automatically credited to your ID.
            </p>
          </div>
        </div>

        {isRoyal ? (
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-400">
            <Crown className="w-3.5 h-3.5 fill-amber-400" />
            <span>Royal QR</span>
          </span>
        ) : isPlatinum ? (
          <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
            <span>Platinum QR</span>
          </span>
        ) : null}
      </div>

      {/* Body: QR Display + Details */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 relative z-10">
        {/* QR Code Graphic Box */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="p-3 bg-white rounded-2xl shadow-2xl ring-4 ring-amber-400/40 relative group">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Referral QR Code for ${user.fullName || user.name}`}
                className="w-40 h-40 object-contain rounded-xl"
              />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center bg-slate-100 rounded-xl">
                <QrCode className="w-10 h-10 text-slate-400 animate-pulse" />
              </div>
            )}

            {/* Small center watermark badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 text-amber-300 font-mono text-[9px] font-black px-1.5 py-0.5 rounded-md border border-amber-400 shadow-md">
              RX
            </div>
          </div>

          <span className="text-[10px] text-slate-400 mt-2 font-semibold">
            Point camera to scan & join
          </span>
        </div>

        {/* Info & Encoding Details */}
        <div className="flex-1 space-y-3 text-left w-full">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Encoded Sponsor ID
            </span>
            <p className="text-base font-black text-amber-400 font-mono flex items-center gap-2">
              <span>{myUserId}</span>
              <span className="text-xs text-slate-300 font-sans font-normal">
                ({user.fullName || user.name})
              </span>
            </p>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Direct Referral Destination
            </span>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 font-mono text-xs text-cyan-300 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 truncate">
                {referralLink}
              </code>
            </div>
          </div>

          <div className="pt-1 flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn-3d-amber px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95"
              title="Copy Referral Link"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Referral Link'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="btn-3d-cyan px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5"
              title="Download QR as PNG"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG QR</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="btn-3d-emerald px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Share WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
