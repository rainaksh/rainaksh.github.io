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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30">
          Support & Helpdesk Desk
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          Contact Us • RainAksh Network
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Founder Vikas Kumar aur official administrative desk se sidhe judein.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl btn-3d-amber flex items-center justify-center font-bold">
                <Crown className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Founder & Architect</h3>
                <p className="text-xs text-amber-400 font-bold">{config.receiverName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Official Target UPI: <strong className="text-amber-300 font-bold">{config.upiId}</strong>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-white text-xs uppercase tracking-wide">Official Support Desk</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
                Online 24/7
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">+91 8877490845</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-mono text-cyan-300">accaiwork@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <SendHorizontal className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="font-mono text-sky-300">Telegram: @rainaksh</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Patna, Bihar, India</span>
              </div>
            </div>

            {/* Glowing 3D Telegram & Email Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleTelegram}
                className="btn-3d-telegram w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2.5"
              >
                <SendHorizontal className="w-4 h-4" />
                <span>Join Official Telegram (@rainaksh)</span>
              </button>

              <button
                onClick={handleEmail}
                className="btn-3d-email w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2.5"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email (accaiwork@gmail.com)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-white text-sm">Send a Direct Message</h3>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Instant Desk Notification</span>
            </span>
          </div>

          {submitted && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Aapka sandesh Control Panel me register ho gaya hai! Founder Vikas Kumar jaldi hi aapse sampark karenge.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-bold">Your Name (नाम)</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-bold">Mobile Number (फ़ोन)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10 digit mobile number"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-bold">Message (संदेश)</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Aapka sawal ya sandesh..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="btn-3d-amber w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Message to Control Panel</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
