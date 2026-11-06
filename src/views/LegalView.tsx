import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock, AlertTriangle, Scale, CheckCircle2 } from 'lucide-react';

export const LegalView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'govt' | 'privacy' | 'terms' | 'disclaimer'>('govt');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
          Compliance & Transparency
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          Government Rules & Legal Policies
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Vikas Digital Club complies strictly with Indian Consumer Protection Laws and IT Privacy Norms.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'govt', label: 'Govt Direct Selling Norms', icon: Scale },
          { id: 'privacy', label: 'Privacy Policy & Masking', icon: Lock },
          { id: 'terms', label: 'Terms & Conditions', icon: FileText },
          { id: 'disclaimer', label: 'Income Disclaimer', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
        {activeTab === 'govt' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <Scale className="w-5 h-5" />
              <h3>Consumer Protection (Direct Selling) Rules, 2021 Compliance</h3>
            </div>
            <p>
              Vikas Digital Club is established as a verified digital membership and direct affiliate program. Under the Consumer Protection (Direct Selling) Rules, 2021 issued by the Ministry of Consumer Affairs, Government of India:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-slate-300">
              <li>
                <strong>Tangible Digital Goods:</strong> Every paid member receives an authentic Digital Membership ID Card, custom profile framing kits, downline analytical software, and digital export tools. We do NOT run an illegal pyramid scheme or money circulation scheme.
              </li>
              <li>
                <strong>Direct Sales Commission:</strong> Referral rewards (₹65 on ₹100, ₹365 on ₹500, ₹765 on ₹1000) are paid exclusively from lawful direct sales of memberships and verified by Admin Vikas Kumar.
              </li>
              <li>
                <strong>Tax Compliance:</strong> Members are responsible for reporting their referral earnings in their individual income tax filings in accordance with Indian tax regulations.
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
              <Lock className="w-5 h-5" />
              <h3>Privacy Policy & Strict Data Masking</h3>
            </div>
            <p>
              Your personal identity and security are our paramount responsibility. In compliance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-slate-300">
              <li>
                <strong>Default Mobile Number Masking:</strong> By default, each user's phone number is masked (e.g. 98••••••10) so unauthorized visitors cannot harvest private contact numbers.
              </li>
              <li>
                <strong>Public vs. Private Card Controls:</strong> Users have complete individual control in their dashboard to toggle their Digital ID Card visibility between Public and Private mode.
              </li>
              <li>
                <strong>Encrypted Admin Storage:</strong> Passwords and banking/UPI data are stored with high security controls accessible solely through the master-authenticated admin portal.
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
              <FileText className="w-5 h-5" />
              <h3>Terms & Conditions</h3>
            </div>
            <p>
              1. <strong>Eligibility:</strong> Members must be at least 18 years of age with a valid Indian Mobile Number and UPI address to receive payouts.
            </p>
            <p>
              2. <strong>Verification Process:</strong> All UPI payments submitted with UTR numbers are cross-verified by Admin Vikas Kumar before card generation and sponsor commission distribution. Fraudulent or fabricated UTR submissions will result in immediate suspension.
            </p>
            <p>
              3. <strong>Identity Integrity:</strong> The assigned Unique User ID (e.g. VK-XXXXXX) and Sponsor ID are immutable system anchors and cannot be altered by users after account creation.
            </p>
          </div>
        )}

        {activeTab === 'disclaimer' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <h3>Income Disclaimer & Affiliate Terms</h3>
            </div>
            <p>
              Referral earnings shown on this website (₹65, ₹365, ₹765) are representative of direct sales commissions paid upon successful, verified purchase of memberships by third-party invitees.
            </p>
            <p>
              We make no promise or guarantee of passive income without active recommendation. Earning potential depends entirely on the personal marketing efforts, network, and diligence of each member.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
