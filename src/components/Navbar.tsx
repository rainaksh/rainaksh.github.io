import React, { useState, useEffect } from 'react';
import {
  Shield,
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
  unreadNotifsCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
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
  unreadNotifsCount,
  darkMode,
  setDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const config = storage.getConfig();

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
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'plans', label: '3 Membership Systems', icon: CreditCard },
    { id: 'guide', label: 'Guide & Walkthrough', icon: BookOpen },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'legal', label: 'Govt Rules & Policy', icon: FileText },
    { id: 'contact', label: 'Help Desk', icon: PhoneCall },
  ];

  return (
    <>
      {/* 1. Sleek Announcement Ticker Bar (Optimized for all screen sizes) */}
      {config.announcementTicker && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 h-7 sm:h-8 px-2 sm:px-4 text-[10px] sm:text-xs font-black shadow-sm border-b border-amber-600/30 overflow-hidden select-none flex items-center z-50">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-hidden">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden flex-1 relative">
              <span className="shrink-0 bg-slate-950 text-amber-300 text-[8px] sm:text-[9px] uppercase font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300/40">
                <Zap className="w-2.5 h-2.5 fill-amber-300 animate-pulse" />
                <span className="hidden xs:inline">ANNOUNCEMENT</span>
                <span className="xs:hidden">LIVE</span>
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

      {/* 2. Main Header Bar (Rock-solid responsiveness across mobile, tablet, desktop) */}
      <header className="sticky top-0 z-40 bg-[#0B0C10]/95 backdrop-blur-md border-b border-slate-800 transition-colors w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Zone 1: Brand Wordmark Logo (Title-case RainAksh with Cyan NETWORK Badge) */}
          <div
            onClick={() => {
              sounds.playClick();
              setActiveView('home');
              if (mobileMenuOpen) setMobileMenuOpen(false);
            }}
            className="shrink-0 flex items-center cursor-pointer"
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
                  onClick={() => {
                    sounds.playClick();
                    setActiveView(item.id);
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

          {/* Zone 3: Header Actions & Mobile Triggers */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Desktop Only: Verify ID */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenVerify();
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold btn-3d-dark shrink-0"
              title="Verify Member Digital Card"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verify ID</span>
            </button>

            {/* Desktop Only: Dark / Light Mode Toggle */}
            <button
              onClick={() => {
                sounds.playClick();
                setDarkMode(!darkMode);
              }}
              className="hidden lg:flex p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 btn-3d-dark shrink-0"
              title={darkMode ? 'Light Theme' : 'Dark Theme'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Desktop Only: Control Panel */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenAdmin();
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-bold btn-3d-dark shrink-0"
              title="Control Panel • केंद्रीय नियंत्रण प्रणाली"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Control Panel</span>
            </button>

            {/* Desktop User Status OR Log In / Join */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveView('dashboard');
                    if (mobileMenuOpen) setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 sm:pr-3 rounded-xl border transition shrink-0 ${
                    activeView === 'dashboard'
                      ? 'bg-amber-500/10 border-amber-400/60 text-amber-300'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                  title="My Digital ID & Dashboard"
                >
                  <img
                    src={currentUser.profilePic || currentUser.avatarUrl}
                    alt={currentUser.fullName || currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-amber-400/50 shrink-0"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold leading-none truncate max-w-[90px] md:max-w-[120px]">
                      {currentUser.fullName || currentUser.name}
                    </p>
                    <p className="text-[10px] text-amber-400 font-mono leading-tight mt-0.5">
                      {currentUser.userId || currentUser.id}
                    </p>
                  </div>
                </button>

                {/* Logout on desktop */}
                <button
                  onClick={handleLogout}
                  className="hidden lg:flex p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 btn-3d-dark shrink-0"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Log In (hidden on very small phones, shown on sm+) */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenLogin?.();
                    if (mobileMenuOpen) setMobileMenuOpen(false);
                  }}
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 btn-3d-dark shrink-0"
                >
                  Log In
                </button>

                {/* Glowing 3D Rainbow Join Button (Always visible on all screens!) */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenJoinModal('platinum');
                    if (mobileMenuOpen) setMobileMenuOpen(false);
                  }}
                  className="btn-3d-rainbow px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black flex items-center gap-1 sm:gap-1.5 shadow-md active:scale-95 shrink-0 whitespace-nowrap"
                  title="Join Now (5-Step Registration)"
                >
                  <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" />
                  <span>Join Now</span>
                </button>
              </div>
            )}

            {/* Complete Hub Pop-up Window Trigger Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 active:scale-95 transition shrink-0 min-h-[38px] flex items-center gap-1.5 shadow-sm"
              aria-label={mobileMenuOpen ? 'Close Pop-up Window' : 'Open Complete Hub Pop-up Window'}
              title="नेविगेशन एवं मुख्य नियंत्रण पॉप-अप विंडो (Complete Hub)"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-amber-300" />}
              <span className="hidden xl:inline text-xs font-bold text-slate-300">Menu</span>
            </button>
          </div>
        </div>

        {/* 3. Complete View Pop-Up Window Modal (Popup Dialog with Backdrop Blur) */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
            onClick={(e) => {
              // Click outside popup card to close
              if (e.target === e.currentTarget) {
                sounds.playClick();
                setMobileMenuOpen(false);
              }
            }}
          >
            <div className="relative w-full max-w-lg bg-[#0B0C10] rounded-3xl border-2 border-amber-400/90 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.35)] overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in zoom-in-95 duration-200">
              
              {/* Pop-Up Window Top Bar */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border-b border-amber-500/40 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <BrandLogo size="sm" showTagline={false} />
                    </div>
                    <p className="text-[10px] text-amber-300 font-bold mt-0.5">
                      नेविगेशन एवं मुख्य नियंत्रण पॉप-अप विंडो (Complete Hub)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition min-h-[40px] min-w-[40px] flex items-center justify-center shadow"
                  aria-label="Close Pop-up Window"
                >
                  <X className="w-5 h-5 text-amber-400" />
                </button>
              </div>

              {/* Pop-Up Window Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
                
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
                        onClick={() => {
                          sounds.playClick();
                          setActiveView('dashboard');
                          setMobileMenuOpen(false);
                        }}
                        className="btn-3d-amber px-3 py-2 rounded-xl text-[11px] font-black shadow"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/20 active:scale-95"
                        title="Logout"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-white">RainAksh 3-System Network</p>
                        <p className="text-[10px] text-slate-400">Govt Direct Selling 2021 Compliant</p>
                      </div>
                      <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                        Starts ₹100
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          onOpenJoinModal('platinum');
                          setMobileMenuOpen(false);
                        }}
                        className="btn-3d-rainbow py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Zap className="w-3.5 h-3.5 fill-white" />
                        <span>Join Now</span>
                      </button>
                      <button
                        onClick={() => {
                          sounds.playClick();
                          onOpenLogin?.();
                          setMobileMenuOpen(false);
                        }}
                        className="btn-3d-dark py-2.5 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Log In</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Navigation Links Grid / List */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-1 tracking-wider block">
                    मुख्य पृष्ठ व जानकारी (Page Navigation)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            sounds.playClick();
                            setActiveView(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                            isActive
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                              : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800/80'
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

                {/* Quick Tools & Controls */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-1 tracking-wider block">
                    त्वरित टूल्स व नियंत्रण (Tools & Controls)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onOpenVerify();
                        setMobileMenuOpen(false);
                      }}
                      className="py-2.5 px-3 rounded-xl btn-3d-dark text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Verify ID Card</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        onOpenAdmin();
                        setMobileMenuOpen(false);
                      }}
                      className="py-2.5 px-3 rounded-xl btn-3d-dark text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Control Panel</span>
                    </button>

                    {onOpenReferralStudio && (
                      <button
                        onClick={() => {
                          sounds.playClick();
                          onOpenReferralStudio();
                          setMobileMenuOpen(false);
                        }}
                        className="py-2.5 px-3 rounded-xl btn-3d-amber text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 col-span-2 shadow-sm"
                      >
                        <Sparkles className="w-4 h-4 fill-slate-950 shrink-0" />
                        <span>प्रचार केंद्र (Marketing & Poster Studio)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Official Help Desk (Telegram @rainaksh & Email) */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 px-1 tracking-wider">
                      आधिकारिक हेल्प डेस्क (Help Desk)
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

                {/* Theme Mode Toggle */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between px-1 text-xs text-slate-400">
                  <span className="font-medium">थीम मोड (Color Theme):</span>
                  <button
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
              <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800 shrink-0 flex items-center justify-between gap-3">
                <div className="text-[10px] text-slate-500 font-medium">
                  <p>RainAksh Network • Direct Selling 2021</p>
                  <p className="text-amber-500/80">UPI: 8877490845@spicepay</p>
                </div>
                <button
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
      </header>
    </>
  );
};
