import React, { useState } from 'react';
import {
  Shield,
  Crown,
  Bell,
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
  Search,
  Zap,
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

  const handleLogout = () => {
    sounds.playClick();
    storage.setCurrentUser(null);
    setActiveView('home');
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'plans', label: '3 Membership Plans', icon: CreditCard },
    { id: 'guide', label: 'Guide & Walkthrough', icon: BookOpen },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'legal', label: 'Govt Rules & Policy', icon: FileText },
    { id: 'contact', label: 'Help Desk', icon: PhoneCall },
  ];

  return (
    <>
      {/* Platform Long Continuous Announcement Ticker Banner */}
      {config.announcementTicker && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 px-3 py-1.5 text-[11px] sm:text-xs font-black shadow-md border-b border-amber-600/30 overflow-hidden whitespace-nowrap select-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-hidden whitespace-nowrap">
            <div className="flex items-center gap-2.5 overflow-hidden flex-1 relative whitespace-nowrap">
              <span className="shrink-0 bg-slate-950 text-amber-300 text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm z-10 border border-amber-300/40">
                <Zap className="w-3 h-3 fill-amber-300 animate-pulse" />
                <span>ANNOUNCEMENT</span>
              </span>
              <span
                className="animate-marquee-slow whitespace-nowrap inline-flex items-center font-extrabold text-slate-950 text-[11px] sm:text-xs tracking-wide py-0.5 cursor-pointer hover:[animation-play-state:paused]"
                title={config.announcementTicker}
                onClick={() => {
                  sounds.playClick();
                  onOpenAnnouncementModal?.();
                }}
              >
                {config.announcementTicker}&nbsp;&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;&nbsp;{config.announcementTicker}&nbsp;&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </div>

            <div className="shrink-0 flex items-center gap-1.5 z-10">
              {onOpenReferralStudio && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenReferralStudio();
                  }}
                  className="hidden sm:inline-flex bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white px-2.5 py-1 rounded-full text-[10px] font-black items-center gap-1 shadow transition active:scale-95 border border-amber-400/40"
                  title="रेफरल व प्रचार केंद्र (Promotional Poster Maker)"
                >
                  <Sparkles className="w-3 h-3 fill-amber-300" />
                  <span>प्रचार केंद्र</span>
                </button>
              )}

              {onOpenAnnouncementModal && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenAnnouncementModal();
                  }}
                  className="bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow transition active:scale-95"
                >
                  <span>खासियत & रिवॉर्ड्स</span>
                  <span>→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#0B0C10]/95 backdrop-blur-md border-b border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo with RainAksh Triangle + Crown */}
          <div onClick={() => { sounds.playClick(); setActiveView('home'); }}>
            <BrandLogo size="md" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Verify Member ID */}
            <button
              onClick={() => { sounds.playClick(); onOpenVerify(); }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold btn-3d-dark"
              title="Verify Member Digital Card"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verify ID</span>
            </button>

            {/* Dark mode */}
            <button
              onClick={() => { sounds.playClick(); setDarkMode(!darkMode); }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 btn-3d-dark"
              title={darkMode ? 'Light Theme' : 'Dark Theme'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Control Panel Access Button */}
            <button
              onClick={() => { sounds.playClick(); onOpenAdmin(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-bold btn-3d-dark"
              title="Control Panel • केंद्रीय नियंत्रण प्रणाली"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Control Panel</span>
            </button>

            {/* User Session or 3D Shopsy Pill Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { sounds.playClick(); setActiveView('dashboard'); }}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border transition ${
                    activeView === 'dashboard'
                      ? 'bg-amber-500/10 border-amber-400/60 text-amber-300'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <img
                    src={currentUser.profilePic || currentUser.avatarUrl}
                    alt={currentUser.fullName || currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover border border-amber-400/50"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold leading-none truncate max-w-[100px]">
                      {currentUser.fullName || currentUser.name}
                    </p>
                    <p className="text-[10px] text-amber-400 font-mono leading-tight mt-0.5">
                      {currentUser.userId || currentUser.id}
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 btn-3d-dark"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { sounds.playClick(); onOpenLogin?.(); }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 btn-3d-dark"
                >
                  Log In
                </button>
                <button
                  onClick={() => { sounds.playClick(); onOpenJoinModal('platinum'); }}
                  className="btn-3d-rainbow px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95"
                  title="Join Now (5-Step Registration)"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Join Now</span>
                </button>
              </div>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => { sounds.playClick(); setMobileMenuOpen(!mobileMenuOpen); }}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-2 animate-in slide-in-from-top-4 duration-200">
            {!currentUser && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenJoinModal('platinum');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-3d-rainbow text-xs font-black shadow-lg"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Join Now (5-Step Registration)</span>
              </button>
            )}

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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {onOpenReferralStudio && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenReferralStudio();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl btn-3d-amber text-xs font-black shadow-md"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>रेफरल एवं प्रचार केंद्र (Marketing Studio)</span>
              </button>
            )}

            <div className="pt-2 border-t border-slate-800/80 flex gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenVerify();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl btn-3d-dark text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Verify ID Card</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl btn-3d-dark text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                <span>Control Panel</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
