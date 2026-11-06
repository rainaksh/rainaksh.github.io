import React from 'react';
import { Crown, Sparkles, ShieldCheck } from 'lucide-react';
import { AvatarFrame } from '../types';

interface ProfileFrameProps {
  src: string;
  alt: string;
  frame?: AvatarFrame;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showCrownBadge?: boolean;
}

export const ProfileFrame: React.FC<ProfileFrameProps> = ({
  src,
  alt,
  frame = 'none',
  size = 'md',
  className = '',
  showCrownBadge = false,
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const getFrameStyles = () => {
    switch (frame) {
      case 'golden_crown':
        return {
          wrapper: 'relative p-1 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-2 ring-yellow-400',
          badge: true,
          crown: true,
        };
      case 'platinum':
        return {
          wrapper: 'relative p-1 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-200 to-blue-600 shadow-[0_0_18px_rgba(56,189,248,0.45)] ring-2 ring-cyan-300',
          badge: true,
          crown: false,
        };
      case 'silver':
        return {
          wrapper: 'relative p-1 rounded-full bg-gradient-to-tr from-slate-300 via-zinc-100 to-slate-500 shadow-md ring-1 ring-slate-300',
          badge: false,
          crown: false,
        };
      case 'cyber_neon':
        return {
          wrapper: 'relative p-1 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-300 to-indigo-500 shadow-[0_0_15px_rgba(52,211,153,0.5)] ring-2 ring-emerald-400 animate-pulse',
          badge: false,
          crown: false,
        };
      case 'diamond':
        return {
          wrapper: 'relative p-1 rounded-full bg-gradient-to-tr from-purple-400 via-pink-300 to-sky-400 shadow-[0_0_18px_rgba(192,132,252,0.4)] ring-2 ring-pink-300',
          badge: false,
          crown: false,
        };
      default:
        return {
          wrapper: 'relative p-0.5 rounded-full bg-slate-700/50',
          badge: false,
          crown: false,
        };
    }
  };

  const styles = getFrameStyles();

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Golden Crown on top if royal frame or requested */}
      {(styles.crown || showCrownBadge || frame === 'golden_crown') && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)]">
          <div className="bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 p-1 rounded-full border border-yellow-200 shadow-lg animate-bounce">
            <Crown className="w-4 h-4 text-slate-950 fill-yellow-400" />
          </div>
        </div>
      )}

      {/* Frame Ring */}
      <div className={`${styles.wrapper}`}>
        <img
          src={src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
          alt={alt}
          className={`${sizeMap[size]} rounded-full object-cover bg-slate-900 border-2 border-slate-950/40`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
          }}
        />

        {/* Small corner status badge */}
        {styles.badge && (
          <div className="absolute -bottom-1 -right-1 bg-slate-950 rounded-full p-0.5 shadow-md z-10">
            {frame === 'golden_crown' ? (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-slate-950">
                <Sparkles className="w-3 h-3" />
              </span>
            ) : (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500 text-slate-950">
                <ShieldCheck className="w-3 h-3" />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
