import React, { useState, useEffect } from 'react';
import {
  Crown,
  ShieldCheck,
  Download,
  Share2,
  Copy,
  Wallet,
  Users,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  MessageSquare,
  Bell,
  Settings,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Send,
  ExternalLink,
  ChevronRight,
  Eye,
  RefreshCw,
  QrCode,
} from 'lucide-react';
import { UserProfile, PlanTier, AvatarFrame, ChatMessage, NotificationItem, PayoutRequest } from '../types';
import { storage, DEFAULT_PLANS } from '../services/storage';
import { DigitalIdCard } from '../components/DigitalIdCard';
import { ProfileFrame } from '../components/ProfileFrame';
import { DownlineNetworkTree } from '../components/DownlineNetworkTree';
import { ReferralQrCard } from '../components/ReferralQrCard';
import { ReferralAnalyticsChart } from '../components/ReferralAnalyticsChart';
import { sounds, triggerCelebration, triggerMegaCelebration } from '../utils/audioCelebration';

interface DashboardViewProps {
  currentUser: UserProfile;
  onSelectPlan: (plan: PlanTier) => void;
  onOpenVerify: () => void;
  onOpenReferralStudio?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  onSelectPlan,
  onOpenVerify,
  onOpenReferralStudio,
}) => {
  const [user, setUser] = useState<UserProfile>(currentUser);
  const [activeTab, setActiveTab] = useState<'overview' | 'card' | 'downline' | 'analytics' | 'qr' | 'wallet' | 'chat' | 'notifications' | 'profile'>('overview');
  const [downlineViewMode, setDownlineViewMode] = useState<'tree' | 'table'>('tree');
  const [copiedRefToast, setCopiedRefToast] = useState(false);

  // Edit Profile Form state (User ID and Sponsor ID locked)
  const [editName, setEditName] = useState(user.fullName || user.name);
  const [editPhone, setEditPhone] = useState(user.mobile || user.phone);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editUpi, setEditUpi] = useState(user.upiId || '');
  const [editCity, setEditCity] = useState(user.city || '');
  const [editState, setEditState] = useState(user.state || '');
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(user.profilePic || user.avatarUrl || '');
  const [editFrame, setEditFrame] = useState<AvatarFrame>(user.avatarFrame || 'silver');
  const [editNominee, setEditNominee] = useState(user.nomineeName || '');
  const [editNomineeRel, setEditNomineeRel] = useState(user.nomineeRelation || '');
  const [editPassword, setEditPassword] = useState(user.password || '');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Wallet & Payout State
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawUpi, setWithdrawUpi] = useState<string>(user.upiId || '');
  const [payoutMessage, setPayoutMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Chat with Admin State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    storage.getConversationWithUser(user.userId || user.id)
  );
  const [chatInput, setChatInput] = useState('');

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    storage.getNotifications(user.userId || user.id)
  );

  // Downlines
  const downlines = storage.getDownlines(user.userId || user.id);
  const payouts = storage.getPayouts().filter((p) => p.userId === (user.userId || user.id));

  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      const fresh = storage.getUserById(user.userId || user.id);
      if (fresh) {
        setUser(fresh);
      }
      setChatMessages(storage.getConversationWithUser(user.userId || user.id));
      setNotifications(storage.getNotifications(user.userId || user.id));
    });
    return unsubscribe;
  }, [user.userId, user.id]);

  const plan = user.currentPlan === '1000' ? 'royal' : user.currentPlan === '500' ? 'platinum' : 'silver';
  const currentPlan = DEFAULT_PLANS[plan] || DEFAULT_PLANS.silver;
  const isPlatinumOrRoyal = plan === 'platinum' || plan === 'royal';
  const isRoyal = plan === 'royal';

  // Referral link
  const origin = window.location.origin;
  const myUserId = user.userId || user.id;
  const referralLink = `${origin}?ref=${encodeURIComponent(myUserId)}`;
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedUserIdToast, setCopiedUserIdToast] = useState(false);

  const handleCopyUserId = () => {
    sounds.playClick();
    triggerCelebration();
    navigator.clipboard.writeText(myUserId);
    setCopiedUserIdToast(true);
    setTimeout(() => setCopiedUserIdToast(false), 2500);
  };

  const handleCopyRef = () => {
    sounds.playClick();
    triggerCelebration();
    navigator.clipboard.writeText(referralLink);
    setCopiedRef(true);
    setCopiedRefToast(true);
    setTimeout(() => {
      setCopiedRef(false);
      setCopiedRefToast(false);
    }, 2500);
  };

  const handleShareWhatsApp = () => {
    sounds.playClick();
    triggerCelebration();
    const text = `🔥 Join RainAksh Network! Mera User ID: ${myUserId}. Get verified Digital ID & earn up to ₹765 per direct invite: ${referralLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    const updated: UserProfile = {
      ...user,
      fullName: editName.trim(),
      name: editName.trim(),
      mobile: editPhone.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      upiId: editUpi.trim(),
      city: editCity.trim(),
      state: editState.trim(),
      bio: editBio.trim(),
      profilePic: editAvatarUrl.trim(),
      avatarUrl: editAvatarUrl.trim(),
      avatarFrame: editFrame,
      nomineeName: editNominee.trim(),
      nomineeRelation: editNomineeRel.trim(),
      password: editPassword.trim(),
    };
    storage.saveUser(updated);
    setUser(updated);
    triggerCelebration();
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  const handlePrivacyToggle = (newPrivacy: UserProfile['privacySettings']) => {
    sounds.playClick();
    const updated: UserProfile = {
      ...user,
      privacySettings: newPrivacy,
      privacy: {
        isCardPublic: newPrivacy.isCardPublic,
        maskPhone: newPrivacy.maskMobile,
        maskEmail: newPrivacy.maskEmail,
        maskAddress: false,
      },
    };
    storage.saveUser(updated);
    setUser(updated);
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setPayoutMessage({ text: 'Valid amount enter karein.', isError: true });
      return;
    }
    if (!withdrawUpi.trim()) {
      setPayoutMessage({ text: 'Valid UPI ID enter karein.', isError: true });
      return;
    }
    const res = storage.requestPayout(myUserId, amt, withdrawUpi.trim());
    if (res.success) {
      triggerMegaCelebration();
      setPayoutMessage({
        text: `₹${amt} withdrawal request submitted! Admin Vikas Kumar jald hi transfer kar denge.`,
        isError: false,
      });
      setWithdrawAmount('');
    } else {
      setPayoutMessage({ text: res.message, isError: true });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    storage.sendMessage({
      senderId: myUserId,
      senderName: user.fullName || user.name,
      receiverId: 'admin',
      message: chatInput.trim(),
    });
    setChatInput('');
  };

  const handleExportDownlines = () => {
    sounds.playClick();
    triggerCelebration();
    const headers = 'User ID,Full Name,Phone,Current Plan,Join Date,Status\n';
    const rows = downlines
      .map(
        (d) =>
          `"${d.userId || d.id}","${d.fullName || d.name}","${d.mobile || d.phone}","${d.currentPlan}","${d.joinDate}","${d.verificationStatus}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RainAksh_Downlines_${myUserId}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Member Executive Top Banner */}
      <div className={`p-5 sm:p-6 rounded-3xl border shadow-2xl relative overflow-hidden ${
        isRoyal
          ? 'bg-gradient-to-r from-amber-950 via-[#0B0C10] to-amber-900 border-amber-400 shadow-[0_10px_35px_rgba(245,158,11,0.3)]'
          : isPlatinumOrRoyal
          ? 'bg-gradient-to-r from-slate-950 via-[#0B0C10] to-cyan-950 border-cyan-400 shadow-[0_10px_30px_rgba(56,189,248,0.2)]'
          : 'bg-[#0B0C10] border-emerald-500/80 shadow-[0_10px_25px_rgba(16,185,129,0.2)]'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <ProfileFrame
              src={user.profilePic || user.avatarUrl}
              alt={user.fullName || user.name}
              frame={user.avatarFrame}
              size="lg"
              showCrownBadge={isRoyal}
            />
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {user.fullName || user.name}
                </h1>
                {isRoyal && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-400 flex items-center gap-1 shadow-sm">
                    <Crown className="w-3.5 h-3.5 fill-amber-400" /> CROWN VIP
                  </span>
                )}
                {plan === 'platinum' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black border border-cyan-400 flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" /> PLATINUM
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs justify-center sm:justify-start">
                <div className="inline-flex items-center gap-1.5 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-cyan-400/30 shadow-inner">
                  <span className="font-mono text-cyan-300 font-black">
                    Membership ID: {myUserId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUserId}
                    className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 active:scale-95"
                    title="Copy User ID"
                    aria-label="Copy User ID"
                  >
                    {copiedUserIdToast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in-75 duration-150" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[10px] text-slate-300 font-semibold hidden sm:inline">
                      {copiedUserIdToast ? 'Copied' : 'Copy'}
                    </span>
                  </button>
                </div>
                <span className="text-slate-400">
                  Sponsor: <strong className="text-amber-400 font-mono">{user.sponsorId}</strong>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40">
                  {user.verificationStatus === 'verified' || user.planStatus === 'active' ? 'Active Membership' : 'Under Verification'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Balance & Withdraw */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center min-w-[130px] shadow-inner">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Available Balance</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                ₹{user.walletBalance.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab('wallet');
              }}
              className="btn-3d-emerald px-5 py-3.5 rounded-2xl text-xs font-black flex items-center gap-1.5"
            >
              <Wallet className="w-4 h-4" />
              <span>Withdraw UPI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Referral Link Copied Toast Notification */}
      {copiedRefToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.4)] flex items-center gap-2 border border-emerald-300 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />
          <span>Referral Link Copied to Clipboard!</span>
        </div>
      )}

      {/* Sticky Floating Referral Strip */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2 text-slate-200 w-full lg:w-auto">
          <Share2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-bold">Aapka Direct Referral Link (Earn ₹{currentPlan.referralCommission} Per Invite):</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <code className="flex-1 sm:flex-none font-mono text-[11px] text-amber-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 truncate max-w-xs">
            {referralLink}
          </code>
          <button
            onClick={handleCopyRef}
            className="btn-3d-amber px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 shadow-md active:scale-95 text-slate-950"
            title="Copy Referral Link to Clipboard"
          >
            {copiedRef ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 animate-in zoom-in-75 duration-150" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-950" />
            )}
            <span>{copiedRef ? 'Link Copied!' : 'Copy Referral Link'}</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setActiveTab('qr'); }}
            className="btn-3d-cyan px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0"
            title="View & Download QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Referral QR</span>
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="btn-3d-emerald px-3 py-1.5 rounded-xl text-xs font-bold shrink-0"
          >
            WhatsApp
          </button>
          {onOpenReferralStudio && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenReferralStudio();
              }}
              className="btn-3d-dark px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 border border-amber-500/30 shrink-0 flex items-center gap-1 shadow-sm"
              title="प्रचार केंद्र व पोस्टर मेकर (Viral Marketing Studio)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>प्रचार केंद्र</span>
            </button>
          )}
        </div>
      </div>

      {/* 5 Quick Tile Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          onClick={() => { sounds.playClick(); setActiveTab('card'); }}
          className="network-tile p-3.5 cursor-pointer space-y-1 text-center"
        >
          <Crown className="w-5 h-5 text-amber-400 mx-auto" />
          <p className="text-xs font-black text-white">Digital ID Passport</p>
          <p className="text-[10px] text-slate-400">Card & Privacy</p>
        </div>

        <div
          onClick={() => {
            sounds.playClick();
            setActiveTab('downline');
            setDownlineViewMode('tree');
          }}
          className="network-tile p-3.5 cursor-pointer space-y-1 text-center group hover:border-amber-400/80 transition"
        >
          <Users className="w-5 h-5 text-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
          <p className="text-xs font-black text-white">Downline Tree</p>
          <p className="text-[10px] text-amber-400 font-semibold">Interactive Levels</p>
        </div>

        <div
          onClick={() => { sounds.playClick(); setActiveTab('analytics'); }}
          className="network-tile p-3.5 cursor-pointer space-y-1 text-center group hover:border-cyan-400/80 transition"
        >
          <TrendingUp className="w-5 h-5 text-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
          <p className="text-xs font-black text-white">30-Day Growth</p>
          <p className="text-[10px] text-slate-400">Recharts Telemetry</p>
        </div>

        <div
          onClick={() => { sounds.playClick(); setActiveTab('qr'); }}
          className="network-tile p-3.5 cursor-pointer space-y-1 text-center group hover:border-amber-400/80 transition"
        >
          <QrCode className="w-5 h-5 text-amber-300 mx-auto group-hover:scale-110 transition-transform" />
          <p className="text-xs font-black text-white">Referral QR</p>
          <p className="text-[10px] text-slate-400">Scan & Download</p>
        </div>

        <div
          onClick={() => { sounds.playClick(); setActiveTab('wallet'); }}
          className="network-tile p-3.5 cursor-pointer space-y-1 text-center"
        >
          <Wallet className="w-5 h-5 text-emerald-400 mx-auto" />
          <p className="text-xs font-black text-white">₹{user.walletBalance} Wallet</p>
          <p className="text-[10px] text-slate-400">Instant UPI payout</p>
        </div>
      </div>

      {/* Sub Tabs Bar */}
      <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar gap-1 text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'card', label: 'Digital ID Card Studio', icon: Crown },
          { id: 'downline', label: `🌳 Downline Tree (${downlines.length})`, icon: Users },
          { id: 'analytics', label: '📈 30-Day Growth Analytics', icon: TrendingUp },
          { id: 'qr', label: '📱 Referral QR Studio', icon: QrCode },
          { id: 'wallet', label: 'Wallet & Payouts', icon: Wallet },
          { id: 'chat', label: 'Private Chat With Admin', icon: MessageSquare },
          { id: 'notifications', label: 'Alerts', icon: Bell },
          { id: 'profile', label: 'Edit Profile & Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="network-tile p-4">
              <span className="text-xs text-slate-400 font-bold">Total Earned</span>
              <p className="text-2xl font-black text-amber-400 font-mono mt-1">
                ₹{user.totalEarned.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-400">Referral rewards</span>
            </div>

            <div className="network-tile p-4">
              <span className="text-xs text-slate-400 font-bold">Pending Payout</span>
              <p className="text-2xl font-black text-cyan-400 font-mono mt-1">
                ₹{(user.earnings?.pendingPayout || 0).toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-slate-400">In verification pipeline</span>
            </div>

            <div className="network-tile p-4">
              <span className="text-xs text-slate-400 font-bold">Direct Downline</span>
              <p className="text-2xl font-black text-white font-mono mt-1">
                {downlines.length} Members
              </p>
              <span className="text-[10px] text-emerald-400">Active referrals</span>
            </div>

            <div className="network-tile p-4">
              <span className="text-xs text-slate-400 font-bold">Withdrawn to UPI</span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
                ₹{user.totalWithdrawn.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-400">Successfully received</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-[#0B0C10] p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Your Digital Identity Passport</span>
                </h3>
                <button
                  onClick={() => { sounds.playClick(); setActiveTab('card'); }}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Customize Card</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <DigitalIdCard user={user} allowDownload={true} showPrivacyToggles={false} />
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#0B0C10] p-5 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Recent Downlines</span>
                  </h3>
                  <button
                    onClick={() => { sounds.playClick(); setActiveTab('downline'); }}
                    className="text-xs text-cyan-400 hover:underline font-bold"
                  >
                    View All ({downlines.length})
                  </button>
                </div>

                {downlines.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-950 text-center text-xs text-slate-400 space-y-3">
                    <p>Abhi tak koi downline join nahi hua hai.</p>
                    <button
                      onClick={handleShareWhatsApp}
                      className="btn-3d-emerald px-4 py-2 rounded-xl text-xs font-bold"
                    >
                      Invite on WhatsApp (Earn ₹{currentPlan.referralCommission})
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {downlines.slice(0, 3).map((d) => (
                      <div
                        key={d.userId || d.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={d.profilePic || d.avatarUrl}
                            alt={d.fullName || d.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <p className="font-bold text-white">{d.fullName || d.name}</p>
                            <p className="text-[10px] text-cyan-400 font-mono">{d.userId || d.id}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {d.currentPlan ? `₹${d.currentPlan}` : d.plan}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Embedded QR Code in Overview */}
              <ReferralQrCard
                user={user}
                referralLink={referralLink}
                compact={true}
                onCopySuccess={() => setCopiedRefToast(true)}
              />
            </div>
          </div>

          {/* 30-Day Growth Analytics in Overview */}
          <div className="pt-2">
            <ReferralAnalyticsChart user={user} />
          </div>
        </div>
      )}

      {/* Tab: Digital ID Card Studio */}
      {activeTab === 'card' && (
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-white">Digital ID Card Studio & Privacy Engine</h3>
            <p className="text-xs text-slate-400">
              Personalized cards according to active system. Phone number masked by default.
            </p>
          </div>

          <DigitalIdCard
            user={user}
            allowDownload={true}
            showPrivacyToggles={true}
            onPrivacyChange={handlePrivacyToggle}
          />
        </div>
      )}

      {/* Tab: Downlines Network */}
      {activeTab === 'downline' && (
        <div className="space-y-4">
          {/* Sub-view switcher: Visual Tree vs Table Ledger */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0B0C10] p-4 rounded-3xl border border-slate-800">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>Downline Referral Network</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  Sponsor: {myUserId}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Explore your multi-system network hierarchy, direct & indirect growth, and commission earnings.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* View Switcher Pills */}
              <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setDownlineViewMode('tree');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    downlineViewMode === 'tree'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Visual Tree</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setDownlineViewMode('table');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    downlineViewMode === 'table'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Table Ledger</span>
                </button>
              </div>

              {isPlatinumOrRoyal && (
                <button
                  onClick={handleExportDownlines}
                  className="btn-3d-cyan flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black shrink-0"
                  title="Export Downline CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              )}
            </div>
          </div>

          {/* Conditional Rendering: Visual Tree vs Table Ledger */}
          {downlineViewMode === 'tree' ? (
            <DownlineNetworkTree
              currentUser={user}
              onOpenJoinModal={(p) => onSelectPlan(p || 'platinum')}
              onShareWhatsApp={handleShareWhatsApp}
            />
          ) : (
            <div>
              {downlines.length === 0 ? (
                <div className="p-12 rounded-3xl bg-[#0B0C10] border border-slate-800 text-center space-y-3">
                  <Users className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-base font-bold text-white">No Direct Downline Members Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Share your referral link on WhatsApp to earn instant commissions. Check the Visual Tree tab to preview growth simulations!
                  </p>
                  <button
                    onClick={handleShareWhatsApp}
                    className="btn-3d-emerald px-4 py-2.5 rounded-xl text-xs font-bold"
                  >
                    Share on WhatsApp
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0B0C10]">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">User ID & Member</th>
                        <th className="p-3.5">Enrolled System</th>
                        <th className="p-3.5">Join Date</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Commission Earned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {downlines.map((d) => {
                        const commission =
                          d.currentPlan === '1000' || d.plan === 'royal'
                            ? 765
                            : d.currentPlan === '500' || d.plan === 'platinum'
                            ? 365
                            : 65;
                        return (
                          <tr key={d.userId || d.id} className="hover:bg-slate-800/40">
                            <td className="p-3.5">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={d.profilePic || d.avatarUrl}
                                  alt={d.fullName || d.name}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                                />
                                <div>
                                  <p className="font-bold text-white">{d.fullName || d.name}</p>
                                  <p className="font-mono text-[10px] text-amber-400">{d.userId || d.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 font-bold text-slate-200">
                              {d.currentPlan ? `System ₹${d.currentPlan}` : `${d.plan} System`}
                            </td>
                            <td className="p-3.5 font-mono text-slate-400">{d.joinDate}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                {d.verificationStatus || d.planStatus}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono font-black text-emerald-400">
                              +₹{commission}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Analytics & Export */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white">
                30-Day Referral Growth & Earning Analytics
              </h3>
              <p className="text-xs text-slate-400">
                Daily commission telemetry, invite velocity, and performance insights for your network.
              </p>
            </div>
            {isPlatinumOrRoyal && (
              <button
                onClick={handleExportDownlines}
                className="btn-3d-cyan flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black"
              >
                <Download className="w-4 h-4" />
                <span>Export Activity Dataset (CSV)</span>
              </button>
            )}
          </div>

          {/* Recharts 30-Day Line Graph */}
          <ReferralAnalyticsChart user={user} />

          {/* Conversion Telemetry Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="network-tile p-5 space-y-2">
              <span className="text-xs text-slate-400 font-bold">Conversion Funnel</span>
              <p className="text-3xl font-black text-cyan-400 font-mono">
                {downlines.length > 0 ? `${Math.round((downlines.length / (downlines.length + 3)) * 100)}%` : '0%'}
              </p>
              <p className="text-[11px] text-slate-400">Referral link conversion rate</p>
            </div>

            <div className="network-tile p-5 space-y-2">
              <span className="text-xs text-slate-400 font-bold">Avg. Payout Per Node</span>
              <p className="text-3xl font-black text-amber-400 font-mono">
                ₹{currentPlan.referralCommission}
              </p>
              <p className="text-[11px] text-slate-400">Direct credit on sponsor verified sales</p>
            </div>

            <div className="network-tile p-5 space-y-2">
              <span className="text-xs text-slate-400 font-bold">UPI Settlement Lag</span>
              <p className="text-3xl font-black text-emerald-400 font-mono">12 Min</p>
              <p className="text-[11px] text-slate-400">Average payout processing by Vikas Kumar</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Referral QR Code Studio */}
      {activeTab === 'qr' && (
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-white">Your Official Referral QR Code</h3>
            <p className="text-xs text-slate-400">
              Automatically encodes your unique referral link. Download as PNG image or scan with any smartphone camera.
            </p>
          </div>

          <ReferralQrCard
            user={user}
            referralLink={referralLink}
            onCopySuccess={() => setCopiedRefToast(true)}
          />
        </div>
      )}

      {/* Tab: Wallet & Payouts */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-[#0B0C10] p-5 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Request Instant UPI Payout</span>
              </h3>
              <span className="font-mono font-black text-amber-400 text-sm">
                Balance: ₹{user.walletBalance}
              </span>
            </div>

            {payoutMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  payoutMessage.isError
                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {payoutMessage.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{payoutMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleRequestPayout} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Withdrawal Amount (₹) *
                </label>
                <input
                  type="number"
                  min="50"
                  max={user.walletBalance}
                  required
                  placeholder={`Max ₹${user.walletBalance}`}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Target UPI ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 8877490845@spicepay or yourname@upi"
                  value={withdrawUpi}
                  onChange={(e) => setWithdrawUpi(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={user.walletBalance <= 0}
                className="btn-3d-emerald w-full py-3.5 rounded-xl text-xs font-black disabled:opacity-50"
              >
                Submit Payout Request
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 bg-[#0B0C10] p-5 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-sm font-black text-white">Payout History</h3>
            {payouts.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-950 text-center text-xs text-slate-400">
                Koi payout history nahi mili.
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {payouts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-mono font-bold text-white">₹{p.amount}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{p.upiId}</p>
                      <p className="text-[9px] text-slate-500">{p.requestedAt}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : p.status === 'rejected'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {p.status}
                      </span>
                      {p.utrReference && (
                        <p className="text-[9px] font-mono text-emerald-400 mt-1">
                          Ref: {p.utrReference}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Private 1-to-1 Chat */}
      {activeTab === 'chat' && (
        <div className="max-w-2xl mx-auto bg-[#0B0C10] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[520px]">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="Admin Vikas Kumar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                />
                <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 absolute bottom-0 right-0" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                  <span>Vikas Kumar (Founder)</span>
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </h4>
                <p className="text-[10px] text-emerald-400 font-bold">1-to-1 Secure Operational Guidance</p>
              </div>
            </div>
            <span className="text-[10px] text-cyan-300 font-mono bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
              Private Tunnel
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
            {chatMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-xs text-slate-400 p-4">
                Admin Vikas Kumar se baat karne ke liye niche message bhejein.
              </div>
            ) : (
              chatMessages.map((msg) => {
                const isMe = msg.senderId === myUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                        isMe
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold rounded-br-none shadow'
                          : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.message}</p>
                      <span className="text-[9px] block text-right opacity-70 mt-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Admin ko sandesh likhein..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="btn-3d-amber px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab: Alerts & Notifications */}
      {activeTab === 'notifications' && (
        <div className="max-w-2xl mx-auto space-y-3">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <span>Alerts & Multicast Broadcasts</span>
          </h3>

          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-4 rounded-2xl bg-[#0B0C10] border border-slate-800 space-y-1 text-xs shadow-md"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">{n.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono">{n.createdAt}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Edit Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto bg-[#0B0C10] p-6 rounded-3xl border border-slate-800 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-black text-white">Profile Manager & Settings</h3>
              <p className="text-xs text-slate-400">
                Rule: User ID and Sponsor ID are permanently locked.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-300 font-black bg-slate-950 px-2.5 py-1 rounded-lg border border-cyan-400/30">
                {myUserId}
              </span>
              <button
                type="button"
                onClick={handleCopyUserId}
                className="btn-3d-dark px-2.5 py-1 rounded-lg text-xs font-bold text-slate-200 flex items-center gap-1.5 shadow-sm active:scale-95"
                title="Copy User ID"
              >
                {copiedUserIdToast ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in-75 duration-150" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span>{copiedUserIdToast ? 'Copied' : 'Copy ID'}</span>
              </button>
            </div>
          </div>

          {profileSaveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Membership ID (Locked)</span>
                  <span className="font-mono font-black text-cyan-300 text-sm">{myUserId}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUserId}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-400/50 transition-colors flex items-center gap-1 active:scale-95"
                  title="Copy User ID"
                >
                  {copiedUserIdToast ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in-75 duration-150" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  <span className="text-[10px] font-semibold">{copiedUserIdToast ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Sponsor ID (Locked)</span>
                <span className="font-mono font-black text-amber-400 text-sm">{user.sponsorId}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-bold">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">Payout UPI ID</label>
                <input
                  type="text"
                  value={editUpi}
                  onChange={(e) => setEditUpi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">Nominee Name</label>
                <input
                  type="text"
                  value={editNominee}
                  onChange={(e) => setEditNominee(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-bold">Nominee Relation</label>
                <input
                  type="text"
                  value={editNomineeRel}
                  onChange={(e) => setEditNomineeRel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-3d-amber w-full py-3.5 rounded-xl text-xs font-black"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Visual Feedback Toast Notification for Copied User ID */}
      {copiedUserIdToast && (
        <div className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/95 border-2 border-emerald-400 text-emerald-300 text-xs font-bold shadow-[0_15px_35px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
          <span>Membership User ID copied to clipboard: <strong className="font-mono text-white tracking-wider">{myUserId}</strong></span>
        </div>
      )}
    </div>
  );
};
