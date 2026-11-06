import React from 'react';
import { Home, CreditCard, Sparkles, User, Fingerprint, Lock } from 'lucide-react';
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0C10]/95 backdrop-blur-xl border-t border-slate-800/90 lg:hidden px-3 py-2 shadow-[0_-12px_30px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => { sounds.playClick(); setActiveView('home'); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
            activeView === 'home' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* 3 Plans */}
        <button
          onClick={() => { sounds.playClick(); setActiveView('plans'); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
            activeView === 'plans' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px]">Plans</span>
        </button>

        {/* 3D Center Floating Button */}
        <button
          onClick={() => { sounds.playClick(); onOpenJoinModal(); }}
          className="relative -top-4 flex flex-col items-center group active:scale-95 transition-transform"
        >
          <div className="w-13 h-13 rounded-2xl btn-3d-amber flex items-center justify-center p-2.5 shadow-[0_10px_25px_rgba(245,158,11,0.5)]">
            <Sparkles className="w-7 h-7 text-slate-950 fill-amber-400 animate-pulse" />
          </div>
          <span className="text-[9px] font-black text-amber-300 tracking-wider mt-1 drop-shadow">
            JOIN ₹100
          </span>
        </button>

        {/* Digital ID Card / Dashboard */}
        <button
          onClick={() => { sounds.playClick(); setActiveView(currentUser ? 'dashboard' : 'home'); }}
          className={`relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
            activeView === 'dashboard' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {currentUser ? <Fingerprint className="w-5 h-5 text-emerald-400" /> : <User className="w-5 h-5" />}
          <span className="text-[10px]">{currentUser ? 'My ID' : 'Account'}</span>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        {/* Control Panel Key */}
        <button
          onClick={() => { sounds.playClick(); onOpenAdmin(); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
            activeView === 'admin' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-5 h-5 text-amber-400" />
          <span className="text-[10px]">Control</span>
        </button>
      </div>
    </nav>
  );
};
