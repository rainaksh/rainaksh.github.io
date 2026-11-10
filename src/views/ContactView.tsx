import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Crown, Sparkles, SendHorizontal } from 'lucide-react';
import { storage } from '../services/storage';
import { sounds, triggerCelebration } from '../utils/audioCelebration';

export const ContactView: React.FC = () => {
  const config = storage.getConfig();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    triggerCelebration();

    // Store in Control Panel database
    storage.addInquiry({
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setMessage('');
    }, 4000);
  };

  const handleTelegram = () => {
    sounds.playClick();
    window.open('https://t.me/rainaksh', '_blank');
  };

  const handleEmail = () => {
    sounds.playClick();
    window.open('mailto:accaiwork@gmail.com?subject=RainAksh%20Network%20Support%20Inquiry', '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[10px] sm:text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30 inline-flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 fill-amber-400" />
          <span>आधिकारिक सहायता केंद्र</span>
        </span>
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white">
          संपर्क करें • रेनाक्ष नेटवर्क सपोर्ट
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          संस्थापक विकास कुमार एवं आधिकारिक हेल्प डेस्क से सीधे जुड़ें।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl btn-3d-amber flex items-center justify-center font-bold shrink-0">
                <Crown className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xs sm:text-sm">संस्थापक एवं मुख्य प्रशासक</h3>
                <p className="text-xs text-amber-300 font-bold">{config.receiverName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              आधिकारिक यूपीआई: <strong className="text-amber-400 font-bold">{config.upiId}</strong>
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-white text-xs uppercase tracking-wide">आधिकारिक हेल्पडेस्क विवरण</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                उपलब्ध 24/7
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-slate-200">+91 8877490845</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-mono text-cyan-300 break-all">accaiwork@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <SendHorizontal className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="font-mono text-sky-300">Telegram: @rainaksh</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>पटना, बिहार, भारत</span>
              </div>
            </div>

            {/* Glowing 3D Telegram & Email Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleTelegram}
                className="btn-3d-telegram w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2.5 min-h-[44px] shadow"
              >
                <SendHorizontal className="w-4 h-4" />
                <span>टेलीग्राम पर संपर्क करें (@rainaksh)</span>
              </button>

              <button
                onClick={handleEmail}
                className="btn-3d-email w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2.5 min-h-[44px] shadow"
              >
                <Mail className="w-4 h-4" />
                <span>ईमेल भेजें (accaiwork@gmail.com)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-white text-xs sm:text-sm">सीधा संदेश भेजें (Direct Message)</h3>
            <span className="text-[10px] text-amber-300 flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>त्वरित सूचना</span>
            </span>
          </div>

          {submitted && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>आपका संदेश कंट्रोल पैनल में दर्ज हो गया है! संस्थापक विकास कुमार शीघ्र ही आपसे संपर्क करेंगे।</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-bold">आपका पूरा नाम (Your Name)</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. राहुल शर्मा"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 min-h-[42px]"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold">मोबाइल नंबर (Mobile Number)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10 अंकों का मोबाइल नंबर"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-400 min-h-[42px]"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold">संदेश या प्रश्न (Message)</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="अपना प्रश्न अथवा समस्या यहाँ लिखें..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="btn-3d-amber w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 min-h-[46px] shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>कंट्रोल पैनल में संदेश भेजें</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
