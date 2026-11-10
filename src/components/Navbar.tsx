import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Crown,
  User,
  LogOut,
  Menu,
  X,
  CreditCard,
  HelpCircle,
  BookOpen,
  FileText,
  Lock,
  Sparkles,
  PhoneCall,
  Sun,
  Moon,
  Zap,
  ChevronRight,
  ExternalLink,
  Send,
  Mail,
} from 'lucide-react';
import { UserProfile } from '../types';
import { storage } from '../services/storage';
import { BrandLogo } from './BrandLogo';
import { sounds } from '../utils/audioCelebration';

interface NavbarProps {
  currentUser: UserProfile | null;
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenJoinModal: (plan?: 'silver' | 'platinum' | 'royal') => void;
  onOpenAdmin: () => void;
  onOpenVerify: () => void;
  onOpenAnnouncementModal?: () => void;
  onOpenReferralStudio?: () => void;
  onOpenLogin?: () => void;
  onOpenPlansModal?: () => void;
  onOpenSponsorCard?: () => void;
  unreadNotifsCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  sponsorId?: string;
  hasSponsorRef?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  setActiveView,
  onOpenJoinModal,
  onOpenAdmin,
  onOpenVerify,
  onOpenAnnouncementModal,
  onOpenReferralStudio,
  onOpenLogin,
  onOpenPlansModal,
  onOpenSponsorCard,
  unreadNotifsCount,
  darkMode,
  setDarkMode,
  sponsorId = '',
  hasSponsorRef = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const config = storage.getConfig();

  const cleanSponsorId = sponsorId?.trim().toUpperCase() || '';
  const sponsorUser = cleanSponsorId ? storage.getUserById(cleanSponsorId) : null;
  const sponsorName = sponsorUser?.fullName || sponsorUser?.name || cleanSponsorId;

  // Prevent background scroll when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    sounds.playClick();
    storage.setCurrentUser(null);
    setActiveView('home');
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'होम (Home)', icon: Shield },
    { id: 'plans', label: '3 प्लान्स (Plans)', icon: CreditCard },
    { id: 'guide', label: 'गाइड (Guide)', icon: BookOpen },
    { id: 'faq', label: 'सवाल-जवाब (FAQ)', icon: HelpCircle },
    { id: 'legal', label: 'नियम व नीतियां (Legal)', icon: FileText },
    { id: 'contact', label: 'हेल्प डेस्क (Support)', icon: PhoneCall },
  ];

  return (
    <>
      {/* 1. Sleek Announcement Ticker Bar */}
      {config.announcementTicker && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 h-7 sm:h-8 px-2 sm:px-4 text-[10px] sm:text-xs font-black shadow-sm border-b border-amber-600/30 overflow-hidden select-none flex items-center z-50">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-hidden">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden flex-1 relative">
              <span className="shrink-0 bg-slate-950 text-amber-300 text-[8px] sm:text-[9px] uppercase font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300/40">
                <Zap className="w-2.5 h-2.5 fill-amber-300 animate-pulse" />
                <span className="hidden sm:inline">ANNOUNCEMENT</span>
                <span className="sm:hidden">LIVE</span>
              </span>
              <span
                className="animate-marquee-slow whitespace-nowrap inline-flex items-center font-extrabold text-slate-950 text-[10px] sm:text-xs tracking-wide cursor-pointer hover:[animation-play-state:paused]"
                title={config.announcementTicker}
                onClick={() => {
                  sounds.playClick();
                  onOpenAnnouncementModal?.();
                }}
              >
                {config.announcementTicker}&nbsp;&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;&nbsp;{config.announcementTicker}&nbsp;&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </div>

            <div className="shrink-0 flex items-center gap-1 sm:gap-1.5">
              {onOpenReferralStudio && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenReferralStudio();
                  }}
                  className="hidden md:inline-flex bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white px-2 py-0.5 rounded-full text-[9px] font-black items-center gap-1 shadow-sm transition active:scale-95 border border-amber-400/40"
                  title="रेफरल व प्रचार केंद्र (Promotional Poster Maker)"
                >
                  <Sparkles className="w-2.5 h-2.5 fill-amber-300" />
                  <span>प्रचार केंद्र</span>
                </button>
              )}

              {onOpenAnnouncementModal && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenAnnouncementModal();
                  }}
                  className="bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black flex items-center gap-1 shadow-sm transition active:scale-95"
                >
                  <span>रिवॉर्ड्स</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SPONSOR REFERRAL LINK VISITOR VIEW (स्पॉन्सर लिंक से आया आगंतुक - धीमी गति में रनिंग हेडर) */}
      {!currentUser && hasSponsorRef && cleanSponsorId !== '' && cleanSponsorId !== 'RX_SYSTEM' && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-emerald-300 h-8 sm:h-9 px-2 sm:px-4 text-[10px] sm:text-xs font-bold border-b border-emerald-500/50 flex items-center justify-between gap-1.5 shadow-inner z-40 select-none overflow-hidden">
          <div className="flex items-center gap-1.5 overflow-hidden flex-1 relative">
            <span className="shrink-0 bg-emerald-500/25 text-emerald-300 text-[8px] sm:text-[9px] uppercase font-black px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-400/50 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="hidden xs:inline">SPONSOR</span>
              <span>INVITED</span>
            </span>

            {/* Continuous Slow Marquee for Complete Text on Any Screen Size */}
            <div
              className="animate-marquee-slow whitespace-nowrap inline-flex items-center text-[10px] sm:text-xs font-extrabold text-emerald-200 tracking-wide cursor-pointer hover:[animation-play-state:paused]"
              title={`स्पॉन्सर ${sponsorName} (${cleanSponsorId}) के आमंत्रण से जुड़े हैं`}
              onClick={() => {
                sounds.playClick();
                onOpenSponsorCard?.();
              }}
            >
              <span>
                ✦ आप प्रमाणित स्पॉन्सर <strong className="text-white font-black underline decoration-amber-400">{sponsorName}</strong> (<span className="text-amber-300 font-mono font-black">{cleanSponsorId}</span>) के विशेष आमंत्रण लिंक से जुड़े हैं • 3-सिस्टम डिजिटल आईडी व अर्न 76.5% UPI पेआउट नेटवर्क • भारत सरकार डायरेक्ट सेलिंग दिशानिर्देश 2021 के अनुरूप • कार्ड देखने के लिए 'कार्ड देखें' बटन दबाएं ✦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✦ आप प्रमाणित स्पॉन्सर <strong className="text-white font-black underline decoration-amber-400">{sponsorName}</strong> (<span className="text-amber-300 font-mono font-black">{cleanSponsorId}</span>) के विशेष आमंत्रण लिंक से जुड़े हैं • 3-सिस्टम डिजिटल आईडी व अर्न 76.5% UPI पेआउट नेटवर्क • भारत सरकार डायरेक्ट सेलिंग दिशानिर्देश 2021 के अनुरूप • कार्ड देखने के लिए 'कार्ड देखें' बटन दबाएं ✦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenSponsorCard?.();
            }}
            className="btn-3d-emerald px-2 sm:px-3 py-1 rounded-lg text-[9px] sm:text-[11px] font-black shrink-0 flex items-center gap-0.5 sm:gap-1 shadow z-10"
            title="स्पॉन्सर डिजिटल आईडी कार्ड देखें"
          >
            <span>कार्ड देखें</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* HEADER 1: PRIMARY TOP HEADER (Logo, Desktop Nav Links, Theme, Verify & Menu) */}
      <header className="sticky top-0 z-40 bg-[#0B0C10]/95 backdrop-blur-md border-b border-slate-800 transition-colors w-full">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-13 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Zone 1: Brand Wordmark Logo */}
          <div
            onClick={() => {
              sounds.playClick();
              setActiveView('home');
              if (mobileMenuOpen) setMobileMenuOpen(false);
            }}
            className="shrink-0 flex items-center cursor-pointer min-w-0"
          >
            <BrandLogo size="md" showTagline={false} />
          </div>

          {/* Zone 2: Desktop Navigation Links (Visible only on lg: screens >= 1024px) */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    if (item.id === 'plans' && onOpenPlansModal) {
                      onOpenPlansModal();
                    } else {
                      setActiveView(item.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-800/90 text-cyan-300 border border-cyan-400/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Header Controls (Dark mode, Sponsor Card modal trigger & Main Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Desktop Only: Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setDarkMode(!darkMode);
              }}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 btn-3d-dark shrink-0"
              title={darkMode ? 'Light Theme' : 'Dark Theme'}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
            </button>

            {/* Sponsor ID Card Modal Quick Trigger (Allows visitor to verify sponsor) */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenSponsorCard?.();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-[11px] sm:text-xs font-bold btn-3d-dark flex items-center gap-1.5 shrink-0 min-h-[38px]"
              title="स्पॉन्सर डिजिटल आईडी कार्ड खोजें या देखें"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="hidden xs:inline">स्पॉन्सर कार्ड</span>
              <span className="xs:hidden">स्पॉन्सर</span>
            </button>

            {/* Menu Button (Always clearly visible with Hindi & English text) */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                sounds.playClick();
                setMobileMenuOpen(true);
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-amber-600/25 hover:from-amber-500/35 hover:to-yellow-500/35 text-amber-300 border-2 border-amber-400/90 active:scale-95 transition shrink-0 min-h-[38px] flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.25)] font-black text-xs cursor-pointer select-none"
              aria-label="Open Complete Menu Options"
              title="सभी मेन्यू विकल्प व सेवाएं खोलें (Open Menu Options)"
            >
              <Menu className="w-4 h-4 text-amber-300 stroke-[2.5]" />
              <span className="font-black text-amber-300 sm:hidden">मेनू</span>
              <span className="font-black text-amber-300 hidden sm:inline">मेनू (Menu)</span>
            </button>
          </div>
        </div>
      </header>

      {/* HEADER 2: DEDICATED ACTION HEADER BAR (Control Panel, Join Now & Log In) */}
      <div className="sticky top-13 sm:top-16 z-30 bg-[#080B11]/98 backdrop-blur-md border-b-2 border-amber-500/40 shadow-[0_6px_20px_rgba(0,0,0,0.6)] w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 py-1.5 sm:py-2">
          {currentUser ? (
            /* ================= VIEW 3: LOGGED IN MEMBER VIEW ================= */
            /* Strictly NO Join Now or Login button! Only Dashboard & Control Panel & Logout */
            <div className="flex items-center justify-between gap-1.5 sm:gap-3">
              {/* Left: User Profile Chip */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveView('dashboard');
                }}
                className={`flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 pr-2 sm:pr-3 rounded-xl sm:rounded-2xl border transition shrink-0 min-w-0 max-w-[55%] sm:max-w-none min-h-[42px] ${
                  activeView === 'dashboard'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
                }`}
                title="My Dashboard & Digital ID Passport"
              >
                <img
                  src={currentUser.profilePic || currentUser.avatarUrl}
                  alt={currentUser.fullName || currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover border border-amber-400/60 shrink-0"
                />
                <div className="text-left min-w-0 overflow-hidden">
                  <p className="text-[11px] sm:text-xs font-black leading-none truncate text-white">
                    {currentUser.fullName || currentUser.name}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-amber-400 font-mono font-bold leading-tight mt-0.5 truncate">
                    {currentUser.userId || currentUser.id} • <span className="uppercase text-emerald-400">{currentUser.plan || 'Royal'}</span>
                  </p>
                </div>
              </button>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Control Panel Button */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenAdmin();
                  }}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 text-[11px] sm:text-xs font-black btn-3d-dark flex items-center gap-1 shrink-0 shadow-sm min-h-[40px]"
                  title="Control Panel • केंद्रीय नियंत्रण"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline">Control Panel</span>
                  <span className="sm:hidden">Control</span>
                </button>

                {/* Dashboard Button */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActiveView('dashboard');
                  }}
                  className="btn-3d-amber px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black flex items-center gap-1 shrink-0 shadow min-h-[40px]"
                >
                  <Crown className="w-3.5 h-3.5 shrink-0" />
                  <span>डैशबोर्ड</span>
                </button>

                {/* Logout Button (restores Join and Login upon click) */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-900 border border-rose-500/50 text-rose-400 hover:bg-rose-500/20 hover:text-white transition active:scale-95 text-[11px] sm:text-xs font-bold flex items-center gap-1 shrink-0 min-h-[40px]"
                  title="लॉगआउट करें (Log Out)"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">लॉगआउट</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================= VIEW 1 & 2: GUEST / VISITOR VIEW ================= */
            /* 3 DEDICATED HIGH-IMPACT 3D BUTTONS: Control Panel, Join Now, Log In */
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 w-full items-center">
              {/* 1. Control Panel Button (Left) */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenAdmin();
                }}
                className="w-full px-1.5 sm:px-3 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 hover:from-slate-800 hover:to-slate-900 text-amber-300 border border-amber-500/40 text-[11px] sm:text-xs font-black btn-3d-dark flex items-center justify-center gap-1 sm:gap-1.5 shadow-md min-h-[42px] active:scale-95 transition"
                title="Control Panel • केंद्रीय नियंत्रण प्रणाली"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Control Panel</span>
                <span className="sm:hidden font-black">Control</span>
              </button>

              {/* 2. Join Now Button (Center - 3D Rainbow Glowing) */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenJoinModal('platinum');
                }}
                className="w-full btn-3d-rainbow px-1.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1 sm:gap-1.5 shadow-lg active:scale-95 min-h-[42px] transition"
                title="Join Now (5-Step Registration)"
              >
                <Zap className="w-3.5 h-3.5 fill-white shrink-0 animate-pulse" />
                <span className="font-black">Join Now</span>
              </button>

              {/* 3. Log In Button (Right - 3D Dark Cyan) */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenLogin?.();
                }}
                className="w-full px-1.5 sm:px-3 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl btn-3d-cyan text-slate-950 font-black text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 shadow-md min-h-[42px] active:scale-95 transition"
                title="सदस्य लॉगिन (Member Login)"
              >
                <User className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span className="font-black">Log In</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Complete Menu Pop-Up Window Modal (Rendered at Root Level with z-[9999] so options never hide accidentally) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto animate-in fade-in duration-150"
          onClick={(e) => {
            // Only close when deliberately clicking the outer dark backdrop
            if (e.target === e.currentTarget) {
              sounds.playClick();
              setMobileMenuOpen(false);
            }
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#0B0C10] rounded-3xl border-2 border-amber-400/90 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(245,158,11,0.4)] overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-200"
          >
            {/* Pop-Up Window Top Bar */}
            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-950/90 via-slate-900 to-slate-950 border-b border-amber-500/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white leading-tight flex items-center gap-1.5">
                    <span>सभी मेन्यू विकल्प (Menu Options)</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                      ALL OPTIONS
                    </span>
                  </h3>
                  <p className="text-[10px] text-amber-300/80 font-bold mt-0.5">
                    RainAksh 3-System Digital Affiliate Network
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-400/60 text-amber-300 hover:text-white hover:bg-slate-800 active:scale-95 transition flex items-center gap-1 shadow font-bold text-xs"
                aria-label="Close Pop-up Window"
              >
                <X className="w-4 h-4 text-amber-400" />
                <span>बंद करें</span>
              </button>
            </div>

            {/* Pop-Up Window Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 text-xs">
              {/* Member Profile Card OR Join CTA */}
              {currentUser ? (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/40 flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={currentUser.profilePic || currentUser.avatarUrl}
                      alt={currentUser.fullName || currentUser.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400/70 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-white truncate">
                          {currentUser.fullName || currentUser.name}
                        </p>
                        <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      </div>
                      <p className="text-[10px] text-amber-400 font-mono mt-0.5">
                        ID: {currentUser.userId || currentUser.id}
                      </p>
                      <p className="text-[9px] text-emerald-400 font-semibold">
                        ✓ Verified Member
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setMobileMenuOpen(false);
                        setActiveView('dashboard');
                      }}
                      className="btn-3d-amber px-3 py-2 rounded-xl text-[11px] font-black shadow"
                    >
                      Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/20 active:scale-95"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-white">RainAksh 3-System Network</p>
                      <p className="text-[10px] text-slate-400">Govt Direct Selling 2021 Compliant</p>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                      Starts ₹100
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setMobileMenuOpen(false);
                        onOpenJoinModal('platinum');
                      }}
                      className="btn-3d-rainbow py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>Join Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setMobileMenuOpen(false);
                        onOpenLogin?.();
                      }}
                      className="btn-3d-dark py-2.5 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Log In</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 1: सदस्यता प्लान्स व स्पॉन्सर कार्ड (Top Highlight Services) */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-black text-amber-400 px-1 tracking-wider block">
                  1. सदस्यता प्लान्स व स्पॉन्सर (Plans & Sponsor)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setMobileMenuOpen(false);
                      if (onOpenPlansModal) {
                        onOpenPlansModal();
                      } else {
                        setActiveView('plans');
                      }
                    }}
                    className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/40 text-left hover:border-amber-400 transition group shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white group-hover:text-amber-300">3 Membership Systems</p>
                        <p className="text-[10px] text-amber-400">₹100, ₹500, ₹1000 प्लान्स व कमाई</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setMobileMenuOpen(false);
                      if (onOpenSponsorCard) {
                        onOpenSponsorCard();
                      } else {
                        onOpenVerify();
                      }
                    }}
                    className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-slate-900 to-slate-950 border border-emerald-500/40 text-left hover:border-emerald-400 transition group shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white group-hover:text-emerald-300">Sponsor Digital ID Card</p>
                        <p className="text-[10px] text-emerald-400">
                          {cleanSponsorId ? `स्पॉन्सर आईडी: ${cleanSponsorId}` : 'सत्यापित स्पॉन्सर खोजें'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* SECTION 2: मुख्य पृष्ठ व जानकारी (Page Navigation) */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-black text-cyan-400 px-1 tracking-wider block">
                  2. मुख्य पृष्ठ व जानकारी (Page Navigation)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setMobileMenuOpen(false);
                          if (item.id === 'plans' && onOpenPlansModal) {
                            onOpenPlansModal();
                          } else {
                            setActiveView(item.id);
                          }
                        }}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                          isActive
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400 shadow-sm'
                            : 'bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: त्वरित टूल्स व नियंत्रण (Tools & Controls) */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <span className="text-[10px] uppercase font-black text-amber-400 px-1 tracking-wider block">
                  3. त्वरित टूल्स व नियंत्रण (Tools & Controls)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="py-2.5 px-3 rounded-xl btn-3d-amber text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 col-span-2 shadow"
                  >
                    <Lock className="w-4 h-4 text-slate-950 shrink-0" />
                    <span>Control Panel • केंद्रीय नियंत्रण प्रणाली</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setMobileMenuOpen(false);
                      onOpenVerify();
                    }}
                    className="py-2.5 px-3 rounded-xl btn-3d-dark text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <User className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Verify Member ID</span>
                  </button>

                  {onOpenReferralStudio && (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setMobileMenuOpen(false);
                        onOpenReferralStudio();
                      }}
                      className="py-2.5 px-3 rounded-xl btn-3d-dark text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 fill-amber-300 shrink-0" />
                      <span>प्रचार केंद्र (Posters)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* SECTION 4: आधिकारिक हेल्प डेस्क (Help Desk) */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black text-slate-400 px-1 tracking-wider">
                    4. आधिकारिक हेल्प डेस्क (Help Desk)
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono font-bold">24/7 Live</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://t.me/rainaksh"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sounds.playClick()}
                    className="btn-3d-telegram py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow"
                  >
                    <Send className="w-4 h-4" />
                    <span>Telegram @rainaksh</span>
                  </a>

                  <a
                    href="mailto:accaiwork@gmail.com?subject=RainAksh%20Help%20Desk%20Support"
                    onClick={() => sounds.playClick()}
                    className="btn-3d-email py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Support</span>
                  </a>
                </div>
              </div>

              {/* SECTION 5: थीम मोड Toggle */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between px-1 text-xs text-slate-400">
                <span className="font-medium">थीम मोड (Color Theme):</span>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setDarkMode(!darkMode);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-800 active:scale-95 transition"
                >
                  {darkMode ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Pop-Up Window Footer */}
            <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 shrink-0 flex items-center justify-between gap-3">
              <div className="text-[10px] text-slate-500 font-medium">
                <p>RainAksh Network • Direct Selling 2021</p>
                <p className="text-amber-500/80">UPI: 8877490845@spicepay</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setMobileMenuOpen(false);
                }}
                className="btn-3d-dark px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white"
              >
                विंडो बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
