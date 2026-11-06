import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { sounds } from '../utils/audioCelebration';

interface FaqItem {
  q: string;
  a: string;
}

export const FaqView: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: 'Plan share karne par kitna commission milta hai?',
      a: 'RainAksh Network par referral margin:\n• ₹100 Normal Plan share karne par ₹65 instant payout (65%).\n• ₹500 Platinum Tier share karne par ₹365 instant payout (73%).\n• ₹1000 Crown VIP Tier share karne par ₹765 instant payout (76.5%).',
    },
    {
      q: 'Payout kaise aur kitni der me milega?',
      a: 'Commission approve hote hi wallet me reflect hota hai. Withdrawal request lagane ke baad Admin Vikas Kumar aapke diye gaye UPI ID (GPay, PhonePe, Paytm, BHIM) par 10 se 30 minute ke andar transfer karte hain.',
    },
    {
      q: 'Digital ID Card me privacy kaise secure rehti hai?',
      a: 'By default har sadasya ka mobile number masked rehta hai (+91 ••••••845). Aap dashboard me jakar card ko public ya private switch kar sakte hain.',
    },
    {
      q: 'Kya mai kisi bhi plan se kisi bhi plan ko refer kar sakta hu?',
      a: 'Ji haan! Aap kisi bhi plan ke sadasya ho, aap sabhi 3 plans (₹100, ₹500, ₹1000) ko refer kar sakte hain aur unka pura commission prapt kar sakte hain.',
    },
    {
      q: 'Admin Panel kiske paas hai aur iska password kya hai?',
      a: 'Admin Panel sirf Founder Vikas Kumar ke paas hai aur master key RAINAKSH se protected hai.',
    },
    {
      q: 'Kya ye platform Government Direct Selling Rules ko follow karta hai?',
      a: '100% compliant. Consumer Protection (Direct Selling) Rules, 2021 ke mutabik har member ko genuine digital utilities (Verified ID Card, Analytical software, reselling tools) milti hain.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30">
          Aksar Puche Jane Wale Sawal
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          Frequently Asked Questions (FAQ)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Aapke sabhi sawalon ke spasht aur saral jawab.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl bg-[#0B0C10] border border-slate-800 overflow-hidden transition"
            >
              <button
                onClick={() => {
                  sounds.playClick();
                  setOpenIndex(isOpen ? null : index);
                }}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-cyan-300 transition"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{faq.q}</span>
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3 whitespace-pre-line">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
