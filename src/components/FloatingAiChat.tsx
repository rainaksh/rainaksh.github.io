import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Crown,
  HelpCircle,
  ShieldCheck,
  PhoneCall,
  DollarSign,
  Zap,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { UserProfile, PlanTier } from '../types';
import { storage } from '../services/storage';
import { sounds, triggerCelebration } from '../utils/audioCelebration';

interface FloatingAiChatProps {
  currentUser: UserProfile | null;
  onSelectPlan: (plan: PlanTier) => void;
  onOpenVerify: () => void;
  onOpenReferralStudio: () => void;
}

interface QuickQA {
  q: string;
  a: string;
  actionText?: string;
  action?: () => void;
}

export const FloatingAiChat: React.FC<FloatingAiChatProps> = ({
  currentUser,
  onSelectPlan,
  onOpenVerify,
  onOpenReferralStudio,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  const quickQuestions: QuickQA[] = [
    {
      q: 'किस प्लान में जॉइन करने पर कितना कमीशन मिलेगा?',
      a: '₹100 नॉर्मल प्लान पर ₹65 (65%), ₹500 प्लैटिनम शील्ड पर ₹365 (73%), और ₹1000 रॉयल क्राउन VIP पर ₹765 (76.5%) सीधा UPI पेआउट मिलता है। कोई कटौती नहीं!',
      actionText: '3 प्लान्स देखें',
      action: () => onSelectPlan('platinum'),
    },
    {
      q: 'पेमेंट किसे और कैसे करना है?',
      a: 'भुगतान केवल संस्थापक विकास कुमार के अधिकृत UPI: 8877490845@spicepay पर करें। पेमेंट के बाद 12-अंक का UTR नंबर दर्ज करें। 10-30 मिनट में सत्यापन पूर्ण हो जाता है।',
      actionText: 'वेरिफाई आईडी पोर्टल',
      action: () => onOpenVerify(),
    },
    {
      q: 'प्रचार के लिए पोस्टर और मैसेज कहाँ से मिलेंगे?',
      a: 'हमारे "प्रचार केंद्र (Marketing Studio)" में आपके नाम व स्पॉन्सर आईडी से लाइव HD पोस्टर्स व रेडीमेड वायरल WhatsApp स्टेटस उपलब्ध हैं जिन्हें आप 1-क्लिक में डाउनलोड व शेयर कर सकते हैं।',
      actionText: 'प्रचार केंद्र खोलें',
      action: () => onOpenReferralStudio(),
    },
    {
      q: 'डिजिटल आईडी कार्ड क्या है और इसमें क्या खास है?',
      a: 'यह भारत सरकार Direct Selling 2021 मानकों के अनुसार जारी किया जाने वाला स्मार्ट पासपोर्ट है जिसमें एंटी-काउंटरफीट क्यूआर कोड, स्पॉन्सर वॉटरमार्क व प्राइवेसी प्रोटेक्शन इंजन है।',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    sounds.playClick();
    const myId = currentUser?.userId || currentUser?.id || 'GUEST_USER';
    const myName = currentUser?.fullName || currentUser?.name || 'Guest User';
    storage.sendMessage({
      senderId: myId,
      senderName: myName,
      receiverId: 'RX_MAIN_001',
      message: inputMsg.trim(),
    });

    setInputMsg('');
    setSentSuccess(true);
    triggerCelebration();
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <>
      {/* Floating 3D Pulse Launcher Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => {
            sounds.playClick();
            setIsOpen(!isOpen);
          }}
          className="btn-floating-pulse relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black shadow-[0_12px_30px_rgba(245,158,11,0.5)] border-2 border-yellow-200 active:scale-95 cursor-pointer"
          title="24/7 AI Guidance & Live Support"
          aria-label="Open AI Guidance & Live Support"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 fill-slate-950 text-slate-950" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 absolute -top-1 -right-1 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 absolute -top-1 -right-1" />
          </div>
          <span className="text-xs font-black tracking-wide hidden sm:inline">
            AI सहायता & सपोर्ट
          </span>
          <span className="sm:hidden text-xs font-black">सहायता</span>
        </button>
      </div>

      {/* Interactive Guidance Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-[#0B0C10] rounded-t-3xl sm:rounded-3xl border-2 border-amber-400/80 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[640px] animate-in slide-in-from-bottom-6 duration-300">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border-b border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                    <span>RainAksh AI Guidance Desk</span>
                    <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </h4>
                  <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active • विकास कुमार (8877490845@spicepay)</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Quick Action Matrix */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenReferralStudio();
                    setIsOpen(false);
                  }}
                  className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 text-left transition flex flex-col justify-between"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 mb-1" />
                  <span className="font-bold text-amber-300 text-[11px] leading-tight">
                    प्रचार केंद्र व पोस्टर मेकर
                  </span>
                  <span className="text-[9px] text-slate-400 mt-1">1-क्लिक शेयर</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenVerify();
                    setIsOpen(false);
                  }}
                  className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-400 text-left transition flex flex-col justify-between"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-300 mb-1" />
                  <span className="font-bold text-cyan-300 text-[11px] leading-tight">
                    आईडी कार्ड सत्यापन
                  </span>
                  <span className="text-[9px] text-slate-400 mt-1">10-30 Min Speed</span>
                </button>
              </div>

              {/* Instant Q&A Accordion */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  अक्सर पूछे जाने वाले सवाल (Instant Guidance)
                </span>

                {quickQuestions.map((item, index) => {
                  const isExpanded = selectedTopic === item.q;
                  return (
                    <div
                      key={index}
                      className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden transition"
                    >
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setSelectedTopic(isExpanded ? null : item.q);
                        }}
                        className="w-full p-3 text-left font-bold text-slate-200 flex items-center justify-between gap-2 text-[11px]"
                      >
                        <span className="flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{item.q}</span>
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-3 pb-3 pt-1 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-2">
                          <p className="leading-relaxed">{item.a}</p>
                          {item.action && item.actionText && (
                            <button
                              onClick={() => {
                                sounds.playClick();
                                item.action?.();
                                setIsOpen(false);
                              }}
                              className="btn-3d-amber px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1"
                            >
                              <span>{item.actionText}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Direct Telegram & Email Help Desk Callout */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-amber-300 text-[11px]">
                    आधिकारिक सहायता एवं संपर्क केंद्र
                  </p>
                  <span className="text-[9px] text-emerald-400 font-mono">24/7 Active</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://t.me/rainaksh"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sounds.playClick()}
                    className="btn-3d-telegram px-3 py-2 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5"
                  >
                    <span>Telegram @rainaksh</span>
                  </a>
                  <a
                    href="mailto:accaiwork@gmail.com?subject=RainAksh%20Support%20Inquiry"
                    onClick={() => sounds.playClick()}
                    className="btn-3d-email px-3 py-2 rounded-xl text-[10px] font-black flex items-center justify-center gap-1.5"
                  >
                    <span>Email Support</span>
                  </a>
                </div>
              </div>

              {sentSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 text-center font-bold">
                  ✓ आपका संदेश विकास कुमार को भेज दिया गया है। शीघ्र उत्तर मिलेगा!
                </div>
              )}
            </div>

            {/* Quick Direct Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="विकास कुमार को संदेश लिखें..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!inputMsg.trim()}
                className="btn-3d-amber p-2 rounded-xl text-slate-950 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
