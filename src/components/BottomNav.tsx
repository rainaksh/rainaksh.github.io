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
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  setActiveView,
  currentUser,
  onOpenJoinModal,
  onOpenAdmin,
  unreadCount = 0,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0C10]/95 backdrop-blur-xl border-t border-slate-800/90 lg:hidden px-2 pt-1.5 pb-2 sm:pb-3 shadow-[0_-12px_30px_rgba(0,0,0,0.7)] select-none">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Home */}
        <button
          onClick={() => { sounds.playClick(); setActiveView('home'); }}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            activeView === 'home' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* 2. 3 Systems */}
        <button
          onClick={() => { sounds.playClick(); setActiveView('plans'); }}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            activeView === 'plans' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="3 Systems"
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">3 Systems</span>
        </button>

        {/* 3. Glowing 3D Rainbow Center Floating Join Button */}
        <button
          onClick={() => { sounds.playClick(); onOpenJoinModal(); }}
          className="relative -top-4 flex flex-col items-center group active:scale-95 transition-transform"
          aria-label="Join Now (Starts ₹100)"
        >
          <div className="w-13 h-13 rounded-2xl btn-3d-rainbow flex items-center justify-center p-2.5 shadow-[0_10px_25px_rgba(236,72,153,0.55)]">
            <Zap className="w-7 h-7 text-white fill-white animate-pulse" />
          </div>
          <span className="text-[9px] font-black text-amber-300 tracking-wider mt-1 drop-shadow whitespace-nowrap">
            JOIN ₹100
          </span>
        </button>

        {/* 4. Digital ID Card / Dashboard */}
        <button
          onClick={() => { sounds.playClick(); setActiveView(currentUser ? 'dashboard' : 'home'); }}
          className={`relative min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            activeView === 'dashboard' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="My ID Dashboard"
        >
          {currentUser ? <Fingerprint className="w-5 h-5 text-emerald-400" /> : <User className="w-5 h-5" />}
          <span className="text-[10px] mt-0.5">{currentUser ? 'My ID' : 'Account'}</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        {/* 5. Master Control Panel */}
        <button
          onClick={() => { sounds.playClick(); onOpenAdmin(); }}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
            activeView === 'admin' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Master Control Panel"
        >
          <Lock className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] mt-0.5">Control</span>
        </button>
      </div>
    </nav>
  );
};
