import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Pause,
  Play,
} from 'lucide-react';
import { storage } from '../services/storage';
import { PopupSlidePhoto } from '../types';
import { sounds, triggerMegaCelebration } from '../utils/audioCelebration';

interface HomePhotoSliderModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onNavigatePlan?: (plan?: any) => void;
  activeView?: string;
}

export const HomePhotoSliderModal: React.FC<HomePhotoSliderModalProps> = ({
  isOpen: forceOpen,
  onClose: customClose,
  onNavigatePlan,
  activeView = 'home',
}) => {
  const [slides, setSlides] = useState<PopupSlidePhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load slides from storage
  const loadSlides = () => {
    const config = storage.getConfig();
    if (config.popupSlidesEnabled === false) {
      setSlides([]);
      return;
    }
    const all = storage.getPopupSlides();
    const active = all.filter((s) => s.enabled);
    setSlides(active);
  };

  useEffect(() => {
    loadSlides();
    const unsubscribe = storage.subscribe(loadSlides);
    return () => unsubscribe();
  }, []);

  // Show popup automatically on target pages (default: home) if slides exist
  useEffect(() => {
    const config = storage.getConfig();
    const targetPages = config.popupTargetPages && config.popupTargetPages.length > 0
      ? config.popupTargetPages
      : ['home'];

    const isTargetPage = targetPages.includes(activeView);

    if (!isTargetPage && forceOpen === undefined) {
      setIsVisible(false);
      return;
    }

    if (forceOpen !== undefined) {
      setIsVisible(forceOpen);
      if (forceOpen) {
        triggerMegaCelebration();
      }
      return;
    }

    if (slides.length > 0) {
      // Small delay for smooth entrance after page paint + trigger grand celebration!
      const timer = setTimeout(() => {
        setIsVisible(true);
        triggerMegaCelebration();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [slides, activeView, forceOpen]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  // Auto-slide effect
  useEffect(() => {
    if (!isVisible || slides.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isVisible, slides.length, isPaused, currentIndex]);

  // Handle closing with smooth zoom-out animation
  const handleClose = () => {
    sounds.playClick();
    setIsClosing(true);
    try {
      sessionStorage.setItem('rainaksh_home_popup_dismissed', 'true');
    } catch {
      // ignore
    }
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      customClose?.();
    }, 220); // matches zoom-out transition duration
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Touch swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe && slides.length > 1) {
      sounds.playClick();
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    } else if (isRightSwipe && slides.length > 1) {
      sounds.playClick();
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  // If no slides or not visible or not home page, render nothing!
  if (!isVisible || slides.length === 0) return null;

  const currentSlide = slides[currentIndex] || slides[0];
  if (!currentSlide) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Zoom In & Zoom Out Modal Container - hugs image size */}
      <div
        className={`relative inline-block max-w-[94vw] sm:max-w-xl md:max-w-2xl max-h-[92vh] bg-[#0B0C10] border-2 border-amber-400 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_55px_rgba(245,158,11,0.55)] overflow-hidden flex flex-col my-auto transition-all transform duration-200 ${
          isClosing ? 'scale-75 opacity-0' : 'scale-100 opacity-100 animate-in zoom-in-90 fade-in'
        }`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Festive Congratulations Ribbon with Badhai animation */}
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-slate-950 font-black text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 text-center flex items-center justify-between gap-1 shadow-md border-b border-amber-300 shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm animate-bounce">🎉</span>
            <span className="truncate font-black tracking-wide text-slate-950">
              बधाई हो! विशेष आमंत्रण एवं अवसर
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerMegaCelebration();
            }}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950/85 hover:bg-slate-950 text-amber-300 text-[10px] font-bold border border-amber-400/50 shadow transition active:scale-90 cursor-pointer shrink-0"
            title="Celebrate Again (पुनः बधाई इफेक्ट)"
          >
            <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
            <span>🎊 बधाई इफेक्ट</span>
          </button>
        </div>

        {/* Top Control Bar with Slide Counter & PROMINENT CUT/CLOSE BUTTON */}
        <div className="absolute top-10 right-2.5 z-30 flex items-center gap-2">
          {slides.length > 1 && (
            <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] sm:text-xs font-mono font-black text-amber-300 border border-amber-400/50 shadow-md">
              {currentIndex + 1} / {slides.length}
            </span>
          )}

          {/* High-Visibility Circular Top Cut Button (Unmissable on all screens) */}
          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white border-2 border-white/90 shadow-[0_4px_18px_rgba(225,29,72,0.9)] active:scale-90 min-h-[42px] transition cursor-pointer font-black text-xs"
            aria-label="Cut / Close Pop-up (कट करें)"
            title="Cut / Close Pop-up (कट करें)"
          >
            <X className="w-5 h-5 stroke-[3] text-white" />
            <span className="text-[11px] font-black uppercase tracking-wider pr-0.5">कट करें (Cut)</span>
          </button>
        </div>

        {/* Dynamic Image Display: Container adapts to intrinsic image size */}
        <div className="relative flex items-center justify-center bg-black/70 overflow-hidden max-h-[70vh]">
          <img
            key={currentSlide.id}
            src={currentSlide.imageUrl}
            alt={currentSlide.title || `Slide ${currentIndex + 1}`}
            className="max-w-full max-h-[70vh] w-auto h-auto object-contain block mx-auto transition-opacity duration-300 select-none"
            loading="eager"
          />

          {/* Navigation Arrows (if > 1 slide) */}
          {slides.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-2xl bg-black/75 hover:bg-amber-500 hover:text-slate-950 text-white border border-amber-400/60 backdrop-blur-md transition shadow-2xl active:scale-90 min-h-[42px] min-w-[42px] flex items-center justify-center cursor-pointer z-10"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-2xl bg-black/75 hover:bg-amber-500 hover:text-slate-950 text-white border border-amber-400/60 backdrop-blur-md transition shadow-2xl active:scale-90 min-h-[42px] min-w-[42px] flex items-center justify-center cursor-pointer z-10"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Optional Title & Subtitle */}
        {(currentSlide.title || currentSlide.subtitle) && (
          <div className="p-3 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950 border-t border-amber-400/40 shrink-0 text-center px-4 space-y-0.5">
            {currentSlide.title && (
              <h4 className="text-sm sm:text-base font-black text-white leading-tight break-words">
                {currentSlide.title}
              </h4>
            )}
            {currentSlide.subtitle && (
              <p className="text-xs text-amber-300 font-medium break-words">
                {currentSlide.subtitle}
              </p>
            )}
          </div>
        )}

        {/* BOTTOM ACTION BAR (ALWAYS VISIBLE WITH DEDICATED CUT BUTTON) */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Mobile-Friendly Bottom Cut/Close Button */}
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-red-950/80 text-rose-300 hover:text-white border border-rose-500/40 hover:border-rose-400 text-xs font-black flex items-center justify-center gap-1.5 min-h-[44px] transition active:scale-95 shadow cursor-pointer order-2 sm:order-1"
          >
            <X className="w-4 h-4 stroke-[3] text-rose-400" />
            <span>✕ पॉपअप कट करें (Close)</span>
          </button>

          {/* Center: Slide Indicators & Pause/Play (if > 1 slide) */}
          {slides.length > 1 && (
            <div className="flex items-center justify-center gap-2 order-1 sm:order-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-1 hover:text-white px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 transition text-[10px] text-slate-400"
                title={isPaused ? 'Resume Auto-Play' : 'Pause Auto-Play'}
              >
                {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
                <span>{isPaused ? 'Play' : 'Pause'}</span>
              </button>

              <div className="flex items-center gap-1.5 px-1">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sounds.playClick();
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-6 bg-gradient-to-r from-amber-400 to-yellow-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                        : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Right: Optional Call to Action Button */}
          {currentSlide.linkText ? (
            <button
              onClick={() => {
                sounds.playClick();
                handleClose();
                if (currentSlide.linkUrl) {
                  if (currentSlide.linkUrl.startsWith('http')) {
                    window.open(currentSlide.linkUrl, '_blank');
                  } else {
                    onNavigatePlan?.(currentSlide.linkUrl);
                  }
                } else {
                  onNavigatePlan?.('royal');
                }
              }}
              className="w-full sm:w-auto btn-3d-rainbow px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-xl min-h-[44px] order-3"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>{currentSlide.linkText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="hidden sm:block order-3 text-[11px] text-slate-500">
              Tap anywhere outside or press Esc to close
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
