import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, MessageCircle } from 'lucide-react';
import { sounds } from '../utils/audioCelebration';

interface FaqItem {
  q: string;
  a: string;
}

export const FaqView: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: 'प्लान शेयर करने पर कितना कमीशन मिलता है?',
      a: 'रेनाक्ष नेटवर्क पर प्रत्येक डायरेक्ट इनवाइट पर उच्चतम कमीशन मिलता है:\n• सिस्टम 1 (₹100 नॉर्मल) शेयर करने पर: ₹65 त्वरित यूपीआई भुगतान (65%)।\n• सिस्टम 2 (₹500 प्लैटिनम) शेयर करने पर: ₹365 त्वरित यूपीआई भुगतान (73%)।\n• सिस्टम 3 (₹1000 रॉयल VIP) शेयर करने पर: ₹765 त्वरित यूपीआई भुगतान (76.5% - भारत में सर्वोच्च)।',
    },
    {
      q: 'कमीशन भुगतान (Payout) कैसे और कितनी देर में मिलता है?',
      a: 'जैसे ही आपका रेफरल सदस्य पेमेंट पूरा करता है और व्यवस्थापक द्वारा सत्यापित होता है, आपके वॉलेट में कमीशन जुड़ जाता है। निकासी अनुरोध (Withdrawal) लगाने के बाद संस्थापक विकास कुमार आपके दिए गए UPI आईडी (PhonePe, Google Pay, Paytm, BHIM) पर 10 से 30 मिनट के अंदर सीधे बैंक में ट्रांसफर करते हैं।',
    },
    {
      q: 'डिजिटल आईडी कार्ड में गोपनीयता (Privacy) कैसे सुरक्षित रहती है?',
      a: 'डिफ़ॉल्ट रूप से हर सदस्य का मोबाइल नंबर मास्क्ड रहता है (जैसे +91 ••••••845)। आप अपने डैशबोर्ड में जाकर 1-क्लिक में अपने कार्ड को पब्लिक या प्राइवेट मोड में सेट कर सकते हैं।',
    },
    {
      q: 'क्या मैं किसी भी प्लान से किसी भी प्लान को रेफर कर सकता हूँ?',
      a: 'जी हाँ बिल्कुल! चाहे आप ₹100, ₹500 या ₹1000 के सदस्य हों, आप तीनों में से किसी भी सिस्टम को रेफर कर सकते हैं और उस प्लान का पूरा निर्धारित कमीशन प्राप्त कर सकते हैं।',
    },
    {
      q: 'कंट्रोल पैनल (Control Panel) किसके पास है और इसका क्या काम है?',
      a: 'कंट्रोल पैनल केवल संस्थापक विकास कुमार के पास मास्टर प्रशासनिक पासकोड से सुरक्षित है। इसके माध्यम से नए सदस्यों का सत्यापन, बैंक यूटीआर अप्रूवल, पेआउट रिलीज और प्लेटफॉर्म सुरक्षा का केंद्रीय संचालन किया जाता है।',
    },
    {
      q: 'क्या यह प्लेटफॉर्म भारत सरकार के डायरेक्ट सेलिंग नियमों के अनुरूप है?',
      a: 'हाँ, 100% वैधानिक। उपभोक्ता संरक्षण (डायरेक्ट सेलिंग) नियम, 2021 के सभी दिशा-निर्देशों के अनुसार प्रत्येक सदस्य को प्रमाणित डिजिटल आईडी, पारदर्शी सॉफ्टवेयर सुविधाएं और रीयल-टाइम एफिलिएट टूल्स प्रदान किए जाते हैं।',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[10px] sm:text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30 inline-flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 fill-amber-400" />
          <span>अक्सर पूछे जाने वाले सवाल</span>
        </span>
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white">
          संदेह निवारण एवं एफएक्यू (FAQ)
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          रेनाक्ष नेटवर्क से संबंधित आपके सभी प्रश्नों के स्पष्ट एवं प्रामाणिक उत्तर।
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl bg-[#0B0C10] border border-slate-800 overflow-hidden transition shadow-sm"
            >
              <button
                onClick={() => {
                  sounds.playClick();
                  setOpenIndex(isOpen ? null : index);
                }}
                className="w-full p-3.5 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-amber-300 transition min-h-[46px]"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="leading-snug break-words">{faq.q}</span>
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-[11px] sm:text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3 whitespace-pre-line">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Help Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <h4 className="text-xs sm:text-sm font-black text-white flex items-center justify-center sm:justify-start gap-1.5">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>क्या आपका कोई अन्य सवाल है?</span>
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            हमारे संस्थापक विकास कुमार से सीधे टेलीग्राम या ईमेल पर संपर्क करें।
          </p>
        </div>
        <a
          href="https://t.me/rainaksh"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sounds.playClick()}
          className="btn-3d-telegram px-4 py-2.5 rounded-xl text-xs font-black shrink-0 min-h-[42px] flex items-center gap-1.5 shadow"
        >
          <span>टेलीग्राम @rainaksh</span>
        </a>
      </div>
    </div>
  );
};
