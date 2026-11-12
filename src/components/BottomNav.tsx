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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0C10]/95 backdrop-blur-xl border-t border-slate-800/90 lg:hidden px-2 pt-2.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-[0_-12px_30px_rgba(0,0,0,0.7)] select-none overflow-visible">
      <div className="flex items-end justify-around max-w-md mx-auto relative">
        {/* 1. Home */}
        <button
          onClick={() => { sounds.playClick(); setActiveView('home'); }}
          className={`flex flex-col items-center justify-center transition-all duration-300 ease-out cursor-pointer ${
            activeView === 'home'
              ? '-translate-y-2 scale-115 px-3 py-1.5 rounded-2xl bg-gradient-to-b from-amber-500/25 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-[0_8px_22px_rgba(245,158,11,0.5),0_0_12px_rgba(245,158,11,0.3)] z-10 min-h-[50px] min-w-[50px]'
              : 'scale-100 py-1 px-1.5 rounded-xl text-slate-400 hover:text-slate-200 min-h-[44px] min-w-[44px] opacity-75 hover:opacity-100'
          }`}
          aria-label="Home"
        >
          <Home className={`transition-all duration-300 ${activeView === 'home' ? 'w-6 h-6 text-amber-300 stroke-[2.5] drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]' : 'w-5 h-5'}`} />
          <span className={`transition-all duration-300 ${activeView === 'home' ? 'text-[11px] font-black text-amber-300 mt-0.5 tracking-wide' : 'text-[9.5px] font-bold mt-0.5'}`}>
            Home
          </span>
          {activeView === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] mt-0.5 animate-pulse" />
          )}
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
          className={`flex flex-col items-center justify-center transition-all duration-300 ease-out cursor-pointer ${
            activeView === 'plans'
              ? '-translate-y-2 scale-115 px-3 py-1.5 rounded-2xl bg-gradient-to-b from-cyan-500/25 via-slate-900 to-slate-950 border-2 border-cyan-400 shadow-[0_8px_22px_rgba(6,182,212,0.5),0_0_12px_rgba(6,182,212,0.3)] z-10 min-h-[50px] min-w-[50px]'
              : 'scale-100 py-1 px-1.5 rounded-xl text-slate-400 hover:text-slate-200 min-h-[44px] min-w-[44px] opacity-75 hover:opacity-100'
          }`}
          aria-label="3 Plans"
          title="3 Membership System Plans"
        >
          <CreditCard className={`transition-all duration-300 ${activeView === 'plans' ? 'w-6 h-6 text-cyan-300 stroke-[2.5] drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]' : 'w-5 h-5 text-cyan-400'}`} />
          <span className={`transition-all duration-300 ${activeView === 'plans' ? 'text-[11px] font-black text-cyan-300 mt-0.5 tracking-wide' : 'text-[9.5px] font-bold mt-0.5'}`}>
            3 Plans
          </span>
          {activeView === 'plans' && (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4] mt-0.5 animate-pulse" />
          )}
        </button>

        {/* 3. Center Floating Button: STRICTLY Join Now for Guests, Dashboard for Logged-In Members */}
        {currentUser ? (
          <button
            onClick={() => { sounds.playClick(); setActiveView('dashboard'); }}
            className={`relative flex flex-col items-center group transition-all duration-300 ease-out cursor-pointer ${
              activeView === 'dashboard'
                ? '-top-5 scale-120 z-20'
                : '-top-3 scale-100'
            }`}
            aria-label="Dashboard"
            title="Open Member Dashboard"
          >
            <div className={`rounded-2xl btn-3d-amber flex items-center justify-center p-2 transition-all duration-300 ${
              activeView === 'dashboard'
                ? 'w-13 h-13 ring-4 ring-amber-400/60 shadow-[0_12px_32px_rgba(245,158,11,0.75)]'
                : 'w-12 h-12 shadow-[0_10px_25px_rgba(245,158,11,0.55)]'
            }`}>
              <Zap className={`text-slate-950 fill-slate-950 transition-all ${activeView === 'dashboard' ? 'w-7 h-7 animate-bounce' : 'w-6 h-6'}`} />
            </div>
            <span className={`tracking-wider mt-1 drop-shadow whitespace-nowrap transition-all ${
              activeView === 'dashboard'
                ? 'text-[10px] font-black text-amber-300 scale-105'
                : 'text-[9px] font-black text-amber-300/80'
            }`}>
              Dashboard
            </span>
          </button>
        ) : (
          <button
            onClick={() => { sounds.playClick(); onOpenJoinModal(); }}
            className="-top-3 relative flex flex-col items-center group active:scale-95 transition-all duration-300 ease-out cursor-pointer hover:scale-105"
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
          className={`relative flex flex-col items-center justify-center transition-all duration-300 ease-out cursor-pointer ${
            activeView === 'dashboard' && !currentUser
              ? '-translate-y-2 scale-115 px-3 py-1.5 rounded-2xl bg-gradient-to-b from-emerald-500/25 via-slate-900 to-slate-950 border-2 border-emerald-400 shadow-[0_8px_22px_rgba(16,185,129,0.5),0_0_12px_rgba(16,185,129,0.3)] z-10 min-h-[50px] min-w-[50px]'
              : 'scale-100 py-1 px-1.5 rounded-xl text-slate-400 hover:text-slate-200 min-h-[44px] min-w-[44px] opacity-75 hover:opacity-100'
          }`}
          aria-label={currentUser ? 'My ID Card' : 'Sponsor Card'}
          title={currentUser ? 'My Digital ID Card' : 'Sponsor Digital Card'}
        >
          <Fingerprint className={`transition-all duration-300 ${activeView === 'dashboard' && !currentUser ? 'w-6 h-6 text-emerald-300 stroke-[2.5] drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]' : 'w-5 h-5 text-emerald-400'}`} />
          <span className={`transition-all duration-300 ${activeView === 'dashboard' && !currentUser ? 'text-[11px] font-black text-emerald-300 mt-0.5 tracking-wide' : 'text-[9.5px] font-bold mt-0.5'}`}>
            {currentUser ? 'My ID' : 'Sponsor'}
          </span>
          {activeView === 'dashboard' && !currentUser && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] mt-0.5 animate-pulse" />
          )}
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        {/* 5. Master Control Panel */}
        <button
          onClick={() => { sounds.playClick(); onOpenAdmin(); }}
          className={`flex flex-col items-center justify-center transition-all duration-300 ease-out cursor-pointer ${
            activeView === 'admin'
              ? '-translate-y-2 scale-115 px-3 py-1.5 rounded-2xl bg-gradient-to-b from-amber-500/25 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-[0_8px_22px_rgba(245,158,11,0.5),0_0_12px_rgba(245,158,11,0.3)] z-10 min-h-[50px] min-w-[50px]'
              : 'scale-100 py-1 px-1.5 rounded-xl text-slate-400 hover:text-slate-200 min-h-[44px] min-w-[44px] opacity-75 hover:opacity-100'
          }`}
          aria-label="Control Panel"
          title="Master Control Panel"
        >
          <Lock className={`transition-all duration-300 ${activeView === 'admin' ? 'w-6 h-6 text-amber-300 stroke-[2.5] drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]' : 'w-5 h-5 text-amber-400'}`} />
          <span className={`transition-all duration-300 ${activeView === 'admin' ? 'text-[11px] font-black text-amber-300 mt-0.5 tracking-wide' : 'text-[9.5px] font-bold mt-0.5'}`}>
            Control
          </span>
          {activeView === 'admin' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] mt-0.5 animate-pulse" />
          )}
        </button>
      </div>
    </nav>
  );
};
