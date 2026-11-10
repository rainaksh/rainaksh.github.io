import React from 'react';
import { BookOpen, CheckCircle2, ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { PlanTier } from '../types';
import { sounds, triggerCelebration } from '../utils/audioCelebration';

interface GuideViewProps {
  onSelectPlan: (plan: PlanTier) => void;
}

export const GuideView: React.FC<GuideViewProps> = ({ onSelectPlan }) => {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[10px] sm:text-xs font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3.5 py-1 rounded-full border border-cyan-400/30 inline-flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>सदस्यता एवं कमाई संपूर्ण मार्गदर्शिका</span>
        </span>
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white">
          प्लेटफ़ॉर्म कैसे काम करता है? (Step-by-Step Guide)
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          जानिए कैसे रजिस्ट्रेशन करना है, सुरक्षित UPI भुगतान करना है और हर रेफरल पर ₹65 से ₹765 तक का सीधा बैंक भुगतान पाना है।
        </p>
      </div>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full btn-3d-amber text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
              1
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">चरण 1: अपना पसंदीदा सदस्यता प्लान चुनें</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed sm:pl-11">
            रेनाक्ष नेटवर्क पर आपकी सुविधा अनुसार 3 आधुनिक सिस्टम उपलब्ध हैं:
          </p>
          <ul className="sm:pl-11 space-y-2 text-[11px] sm:text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>सिस्टम 1 (₹100 नॉर्मल):</strong> नियॉन डिजिटल आईडी कार्ड + प्रति इनवाइट <strong>₹65 नकद पेआउट</strong> (65%)।</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>सिस्टम 2 (₹500 प्लैटिनम):</strong> होलोग्राफिक डिजिटल कार्ड + लाइव एनालिटिक्स व प्रति इनवाइट <strong>₹365 नकद पेआउट</strong> (73%)।</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>सिस्टम 3 (₹1000 रॉयल VIP):</strong> 3डी लिक्विड गोल्ड कार्ड, गोल्डन नेमप्लेट व प्रति इनवाइट <strong>₹765 अधिकतम पेआउट</strong> (76.5%)।</span>
            </li>
          </ul>
        </div>

        {/* Step 2 */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full btn-3d-cyan text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
              2
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">चरण 2: आधिकारिक यूपीआई (UPI) से भुगतान करें</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed sm:pl-11">
            आधिकारिक यूपीआई आईडी <strong className="text-amber-300 font-mono font-bold">8877490845@spicepay</strong> (विकास कुमार) पर अपने किसी भी UPI ऐप (PhonePe, Google Pay, Paytm) से सीधे भुगतान करें। भुगतान के बाद 12-अंकों का UTR रेफरेंस नंबर और स्क्रीनशॉट फॉर्म में अपलोड करें।
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full btn-3d-emerald text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
              3
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">चरण 3: स्थायी यूजर आईडी व डिजिटल आईडी कार्ड प्राप्त करें</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed sm:pl-11">
            संस्थापक द्वारा सत्यापन होते ही आपका खाता तुरंत सक्रिय हो जाएगा। आपको आजीवन वैध स्थायी यूजर आईडी (जैसे <strong className="text-cyan-300 font-mono font-bold">RNX1000VK01</strong>) और एचडी स्मार्ट कार्ड मिलेगा जिसे आप कभी भी डाउनलोड व शेयर कर सकते हैं।
          </p>
        </div>

        {/* Step 4 */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-3 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full btn-3d-amber text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
              4
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">चरण 4: दोस्तों को आमंत्रित करें और त्वरित UPI निकासी पाएं</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed sm:pl-11">
            अपने स्पॉन्सर रेफरल लिंक या डिजिटल पोस्टर को WhatsApp व सोशल मीडिया पर साझा करें। जैसे ही कोई सदस्य जुड़ेगा, उसका कमीशन तुरंत आपके वॉलेट में क्रेडिट होगा और 10-30 मिनट में सीधा आपके बैंक खाते में ट्रांसफर होगा!
          </p>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => {
            sounds.playClick();
            triggerCelebration();
            onSelectPlan('platinum');
          }}
          className="btn-3d-rainbow w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-black inline-flex items-center justify-center gap-2 shadow-xl min-h-[46px]"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>अभी अपनी सदस्यता शुरू करें (Join Now)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
