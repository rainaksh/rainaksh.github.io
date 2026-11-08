import React from 'react';

export interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'default' | 'gold' | 'cyan' | 'monochrome' | 'minimal';
  className?: string;
  onClick?: () => void;
}

/**
 * Official RainAksh Typographic Logo
 * The name design itself IS the official logo.
 * Clean, luxury title-case 'RainAksh' with signature gradient and cyan 'NETWORK' badge.
 * No icon before the name per official brand guideline.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  onClick,
}) => {
  const textSize = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const badgeSize = {
    xs: 'text-[8px] px-1 py-0.2',
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[9px] sm:text-[10px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1',
    xl: 'text-sm px-3 py-1.5',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col justify-center select-none group cursor-pointer ${className}`}
      title="RainAksh Network • Govt. Direct Selling 2021 Compliant"
    >
      {/* Official Typographic Logo: The Name Design IS The Logo */}
      <div className="flex items-center gap-1.5 sm:gap-2 leading-none">
        <span
          className={`font-black tracking-tight ${textSize[size]} bg-gradient-to-r from-white via-cyan-200 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)] font-sans transition-transform group-hover:scale-[1.02] duration-200 shrink-0 whitespace-nowrap`}
        >
          RainAksh
        </span>
        <span
          className={`font-black uppercase rounded-md bg-gradient-to-r from-cyan-500/20 to-sky-500/20 text-cyan-300 border border-cyan-400/50 font-mono tracking-widest shadow-[0_0_10px_rgba(56,189,248,0.25)] shrink-0 whitespace-nowrap ${badgeSize[size]}`}
        >
          NETWORK
        </span>
      </div>

      {showTagline && size !== 'xs' && size !== 'sm' && (
        <p className="text-[10px] text-slate-400 font-semibold tracking-tight mt-1 hidden sm:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span>Govt. Direct Selling 2021 Compliant • Official Digital Passport</span>
        </p>
      )}
    </div>
  );
};

/**
 * BrandEmblem now points directly to the official RainAksh typographic name logo
 * Ensuring that wherever an emblem or logo is called, the signature name design is displayed without any icon.
 */
export const BrandEmblem: React.FC<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'gold' | 'cyan' | 'monochrome' | 'minimal';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  return <BrandLogo size={size} showTagline={false} className={className} />;
};
