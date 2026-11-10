import React from 'react';
import { Home, CreditCard, Sparkles, User, Fingerprint, Lock, Zap } from 'lucide-react';
import { UserProfile } from '../types';
import { sounds } from '../utils/audioCelebration';

interface BottomNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
  currentUser: UserProfile | null;
  onOpenJoinModal: () => void;
  onOpenAdmin: () => void;
  onOpenPlansModal?: () => void;
  onOpenSponsorCard?: () => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  setActiveView,
  currentUser,
  onOpenJoinModal,
  onOpenAdmin,
  onOpenPlansModal,
  onOpenSponsorCard,
  unreadCount = 0,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0C10]/95 backdrop-blur-xl border-t border-slate-800/90 lg:hidden px-2 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-[0_-12px_30px_rgba(0,0,0,0.7)] select-none">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Home */}
        <button
          onClick={() => { sounds.playClick(); setActiveView('home'); }}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition ${
            activeView === 'home' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">Home</span>
        </button>

        {/* 2. 3 Plans */}
        <button
          onClick={() => {
            sounds.playClick();
            if (onOpenPlansModal) {
              onOpenPlansModal();
            } else {
              setActiveView('plans');
            }
          }}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition ${
            activeView === 'plans' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="3 Plans"
          title="3 Membership System Plans"
        >
          <CreditCard className="w-5 h-5 text-cyan-400" />
          <span className="text-[10px] mt-0.5 font-bold">3 Plans</span>
        </button>

        {/* 3. Center Floating Button: STRICTLY Join Now for Guests, Dashboard for Logged-In Members */}
        {currentUser ? (
          <button
            onClick={() => { sounds.playClick(); setActiveView('dashboard'); }}
            className="relative -top-3.5 flex flex-col items-center group active:scale-95 transition-transform"
            aria-label="Dashboard"
            title="Open Member Dashboard"
          >
            <div className="w-12 h-12 rounded-2xl btn-3d-amber flex items-center justify-center p-2 shadow-[0_10px_25px_rgba(245,158,11,0.55)]">
              <Zap className="w-6 h-6 text-slate-950 fill-slate-950" />
            </div>
            <span className="text-[9px] font-black text-amber-300 tracking-wider mt-1 drop-shadow whitespace-nowrap">
              Dashboard
            </span>
          </button>
        ) : (
          <button
            onClick={() => { sounds.playClick(); onOpenJoinModal(); }}
            className="relative -top-3.5 flex flex-col items-center group active:scale-95 transition-transform"
            aria-label="Join Now"
            title="Join 3-System Network"
          >
            <div className="w-12 h-12 rounded-2xl btn-3d-rainbow flex items-center justify-center p-2 shadow-[0_10px_25px_rgba(236,72,153,0.55)]">
              <Zap className="w-6 h-6 text-white fill-white animate-pulse" />
            </div>
            <span className="text-[9px] font-black text-amber-300 tracking-wider mt-1 drop-shadow whitespace-nowrap">
              Join Now
            </span>
          </button>
        )}

        {/* 4. Digital ID Card / Sponsor Card */}
        <button
          onClick={() => {
            sounds.playClick();
            if (currentUser) {
              setActiveView('dashboard');
            } else if (onOpenSponsorCard) {
              onOpenSponsorCard();
            } else {
              setActiveView('dashboard');
            }
          }}
          className={`relative min-h-[44px] min-w-[44px] flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition ${
            activeView === 'dashboard' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label={currentUser ? 'My ID Card' : 'Sponsor Card'}
          title={currentUser ? 'My Digital ID Card' : 'Sponsor Digital Card'}
        >
          <Fingerprint className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] mt-0.5 font-bold">
            {currentUser ? 'My ID' : 'Sponsor'}
          </span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        {/* 5. Master Control Panel */}
        <button
          onClick={() => { sounds.playClick(); onOpenAdmin(); }}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition ${
            activeView === 'admin' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Control Panel"
          title="Master Control Panel"
        >
          <Lock className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] mt-0.5 font-bold">Control</span>
        </button>
      </div>
    </nav>
  );
};
