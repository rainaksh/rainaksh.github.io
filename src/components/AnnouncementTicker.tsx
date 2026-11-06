import React from 'react';
import { Volume2, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { sounds } from '../utils/audioCelebration';

interface AnnouncementTickerProps {
  onOpenAnnouncementModal: () => void;
}

export const AnnouncementTicker: React.FC<AnnouncementTickerProps> = ({
  onOpenAnnouncementModal,
}) => {
  return (
    <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 px-3 py-1.5 text-xs font-black shadow-md border-b border-amber-600/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-hidden">
        {/* Left marquee / announcement message */}
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="shrink-0 bg-slate-950 text-amber-300 text-[10px] uppercase font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Volume2 className="w-3 h-3 fill-amber-300 animate-pulse" />
            <span>ANNOUNCEMENT</span>
          </span>

          <div className="truncate text-[11px] sm:text-xs tracking-tight flex items-center gap-2">
            <span className="font-bold hidden md:inline text-slate-950">
              ⚡ RainAksh Network:
            </span>
            <span className="font-extrabold text-slate-950">
              ₹100 जॉइनिंग पर ₹65, ₹500 पर ₹365 और ₹1000 पर ₹765 इंस्टेंट UPI पेआउट!
            </span>
            <span className="text-slate-900/80 text-[10px] hidden lg:inline font-mono">
              [Receiver UPI: 8877490845@spicepay (Vikas Kumar)]
            </span>
          </div>
        </div>

        {/* Right CTA button to open full details */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenAnnouncementModal();
          }}
          className="shrink-0 bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow transition transform active:scale-95"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span className="whitespace-nowrap">खासियत & प्लान रिवॉर्ड्स देखें</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
