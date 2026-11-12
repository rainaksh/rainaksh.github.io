import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Users,
  CreditCard,
  Wallet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  Bell,
  Settings,
  Edit,
  Eye,
  EyeOff,
  RefreshCw,
  Search,
  Send,
  Zap,
  TrendingUp,
  Smartphone,
  Flame,
  Download,
  Trash2,
  History,
  FileText,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  Image as ImageIcon,
  Upload,
  Plus,
  ArrowUp,
  ArrowDown,
  Layers,
} from 'lucide-react';
import {
  UserProfile,
  Transaction,
  PayoutRequest,
  NotificationItem,
  ChatMessage,
  SystemConfig,
  PlanTier,
  PlanAmount,
  UserActivity,
  ContactInquiry,
  PopupSlidePhoto,
} from '../types';
import { storage, ADMIN_PASSWORD_HASH, DEFAULT_PLANS } from '../services/storage';
import { sounds, triggerMegaCelebration, triggerCelebration } from '../utils/audioCelebration';
import { HomePhotoSliderModal } from '../components/HomePhotoSliderModal';

interface AdminViewProps {
  onClose: () => void;
  onOpenVerify: () => void;
}

type AdminTab =
  | 'overview'
  | 'responses'
  | 'activities'
  | 'txns'
  | 'payouts'
  | 'inquiries'
  | 'broadcast'
  | 'chat'
  | 'cms'
  | 'slider';

export const AdminView: React.FC<AdminViewProps> = ({ onClose, onOpenVerify }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Active control panel tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Live storage data
  const [users, setUsers] = useState<UserProfile[]>(() => storage.getUsers());
  const [transactions, setTransactions] = useState<Transaction[]>(() => storage.getTransactions());
  const [payouts, setPayouts] = useState<PayoutRequest[]>(() => storage.getPayouts());
  const [messages, setMessages] = useState<ChatMessage[]>(() => storage.getMessages());
  const [activities, setActivities] = useState<UserActivity[]>(() => storage.getActivities());
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => storage.getInquiries());
  const [config, setConfig] = useState<SystemConfig>(() => storage.getConfig());

  // Search & filter state
  const [userSearch, setUserSearch] = useState('');
  const [activityFilter, setActivityFilter] = useState<string>('ALL');
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserProfile | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserProfile | null>(null);
  const [showUserPasswords, setShowUserPasswords] = useState<Record<string, boolean>>({});

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Chat state
  const [activeChatUserId, setActiveChatUserId] = useState<string>('RX_MAIN_001');
  const [adminReplyText, setAdminReplyText] = useState('');

  // CMS state
  const [cmsUpi, setCmsUpi] = useState(config.upiId);
  const [cmsReceiverName, setCmsReceiverName] = useState(config.receiverName);
  const [cmsSilverPrice, setCmsSilverPrice] = useState(config.silverPrice);
  const [cmsSilverCommission, setCmsSilverCommission] = useState(config.silverCommission);
  const [cmsPlatinumPrice, setCmsPlatinumPrice] = useState(config.platinumPrice);
  const [cmsPlatinumCommission, setCmsPlatinumCommission] = useState(config.platinumCommission);
  const [cmsRoyalPrice, setCmsRoyalPrice] = useState(config.royalPrice);
  const [cmsRoyalCommission, setCmsRoyalCommission] = useState(config.royalCommission);
  const [cmsTicker, setCmsTicker] = useState(config.announcementTicker);
  const [cmsSaveSuccess, setCmsSaveSuccess] = useState(false);

  // Payout UTR state
  const [payoutUtrMap, setPayoutUtrMap] = useState<Record<string, string>>({});
  const [rejectTxnId, setRejectTxnId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [previewProofImage, setPreviewProofImage] = useState<string | null>(null);

  // 7-Photo Slider state
  const [slides, setSlides] = useState<PopupSlidePhoto[]>(() => storage.getPopupSlides());
  const [sliderEnabled, setSliderEnabled] = useState<boolean>(() => config.popupSlidesEnabled !== false);
  const [newSlideUrl, setNewSlideUrl] = useState('');
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideSubtitle, setNewSlideSubtitle] = useState('');
  const [newSlideLinkUrl, setNewSlideLinkUrl] = useState('');
  const [newSlideLinkText, setNewSlideLinkText] = useState('');
  const [sliderMessage, setSliderMessage] = useState('');
  const [sliderTargetPages, setSliderTargetPages] = useState<string[]>(() => config.popupTargetPages || ['home']);
  const [previewSliderModal, setPreviewSliderModal] = useState(false);

  useEffect(() => {
    const unsub = storage.subscribe(() => {
      setUsers(storage.getUsers());
      setTransactions(storage.getTransactions());
      setPayouts(storage.getPayouts());
      setMessages(storage.getMessages());
      setActivities(storage.getActivities());
      setInquiries(storage.getInquiries());
      const cfg = storage.getConfig();
      setConfig(cfg);
      setSlides(storage.getPopupSlides());
      setSliderTargetPages(cfg.popupTargetPages || ['home']);
      setSliderEnabled(cfg.popupSlidesEnabled !== false);
    });
    return unsub;
  }, []);

  // Image compression & upload helper
  const handleUploadSlideImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (slides.length >= 7) {
      setSliderMessage('त्रुटि: आप अधिकतम 7 फोटो ही अपलोड कर सकते हैं।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setNewSlideUrl(dataUrl);
          setSliderMessage('फोटो सफलता से लोड हो गई! विवरण भरकर "स्लाइड जोड़ें" बटन दबाएं।');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    if (!newSlideUrl.trim()) {
      setSliderMessage('कृपया फोटो अपलोड करें या इमेज URL दर्ज करें।');
      return;
    }
    if (slides.length >= 7) {
      setSliderMessage('अधिकतम 7 फोटो सीमा पूर्ण हो चुकी है।');
      return;
    }

    try {
      storage.addPopupSlide({
        imageUrl: newSlideUrl.trim(),
        title: newSlideTitle.trim() || undefined,
        subtitle: newSlideSubtitle.trim() || undefined,
        linkUrl: newSlideLinkUrl.trim() || undefined,
        linkText: newSlideLinkText.trim() || undefined,
        enabled: true,
      });
      setSlides(storage.getPopupSlides());
      setNewSlideUrl('');
      setNewSlideTitle('');
      setNewSlideSubtitle('');
      setNewSlideLinkUrl('');
      setNewSlideLinkText('');
      setSliderMessage('नई फोटो स्लाइड सफलतापूर्वक जोड़ दी गई!');
      triggerCelebration();
    } catch (err: any) {
      setSliderMessage(err.message || 'फोटो जोड़ने में त्रुटि आई।');
    }
  };

  const handleDeleteSlide = (id: string) => {
    if (window.confirm('क्या आप इस फोटो को स्लाइडर से हटाना चाहते हैं? यह स्थायी रूप से हट जाएगी।')) {
      sounds.playClick();
      storage.deletePopupSlide(id);
      setSlides(storage.getPopupSlides());
      setSliderMessage('फोटो स्लाइड स्थायी रूप से हटा दी गई।');
    }
  };

  const handleClearAllSlides = () => {
    if (window.confirm('क्या आप सभी फोटो को डिलीट करना चाहते हैं? इसके बाद कोई भी पॉपअप नहीं खुलेगा।')) {
      sounds.playClick();
      storage.clearAllPopupSlides();
      setSlides([]);
      setSliderMessage('सभी फोटो स्थायी रूप से डिलीट कर दी गईं (अब कोई पॉपअप नहीं दिखेगा)।');
    }
  };

  const handleToggleSlide = (id: string) => {
    sounds.playClick();
    storage.togglePopupSlide(id);
    setSlides(storage.getPopupSlides());
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    sounds.playClick();
    const current = [...slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;
    const temp = current[index];
    current[index] = current[targetIndex];
    current[targetIndex] = temp;
    storage.reorderPopupSlides(current);
    setSlides(storage.getPopupSlides());
  };

  const handleToggleMasterSlider = (enabled: boolean) => {
    sounds.playClick();
    setSliderEnabled(enabled);
    storage.updateConfig({ popupSlidesEnabled: enabled });
    setSliderMessage(
      enabled
        ? 'पॉपअप स्लाइडर सक्रिय (Enabled) है।'
        : 'पॉपअप स्लाइडर निष्क्रिय (Disabled) कर दिया गया है।'
    );
  };

  const handleToggleTargetPage = (pageId: string) => {
    sounds.playClick();
    let updated: string[];
    if (sliderTargetPages.includes(pageId)) {
      updated = sliderTargetPages.filter((p) => p !== pageId);
      if (updated.length === 0) updated = ['home'];
    } else {
      updated = [...sliderTargetPages, pageId];
    }
    setSliderTargetPages(updated);
    storage.updateConfig({ popupTargetPages: updated });
    setSliderMessage(`पॉपअप प्रदर्शन पृष्ठ अपडेट: [${updated.join(', ')}]`);
  };

  const handleSetAllPages = () => {
    sounds.playClick();
    const all = ['home', 'plans', 'guide', 'faq', 'dashboard', 'legal'];
    setSliderTargetPages(all);
    storage.updateConfig({ popupTargetPages: all });
    setSliderMessage('पॉपअप अब सभी पेजों पर प्रदर्शित होगा!');
  };

  const handleSetHomeOnly = () => {
    sounds.playClick();
    const homeOnly = ['home'];
    setSliderTargetPages(homeOnly);
    storage.updateConfig({ popupTargetPages: homeOnly });
    setSliderMessage('पॉपअप अब केवल मुख्य पृष्ठ (Home Page) पर ही प्रदर्शित होगा (डिफ़ॉल्ट सेट)।');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    if (passwordInput.trim() === ADMIN_PASSWORD_HASH) {
      setIsAuthenticated(true);
      setPasswordError('');
      triggerMegaCelebration();
    } else {
      setPasswordError('ACCESS DENIED: Master Code does not match.');
    }
  };

  const handleApproveTxn = (txnId: string) => {
    sounds.playClick();
    const success = storage.approveTransaction(txnId, 'Vikas Kumar (Control Panel)');
    if (success) {
      setTransactions([...storage.getTransactions()]);
      setUsers([...storage.getUsers()]);
      setActivities([...storage.getActivities()]);
    }
  };

  const handleConfirmRejectTxn = () => {
    sounds.playClick();
    if (!rejectTxnId) return;
    storage.rejectTransaction(rejectTxnId, rejectReason || 'Payment record not matched in bank');
    setRejectTxnId(null);
    setRejectReason('');
    setTransactions([...storage.getTransactions()]);
    setActivities([...storage.getActivities()]);
  };

  const handleApprovePayout = (payoutId: string) => {
    sounds.playClick();
    const utr = payoutUtrMap[payoutId] || `BANK-UTR-${Date.now().toString().slice(-6)}`;
    storage.approvePayout(payoutId, utr);
    setPayouts([...storage.getPayouts()]);
    setUsers([...storage.getUsers()]);
    setActivities([...storage.getActivities()]);
  };

  const handleRejectPayout = (payoutId: string) => {
    sounds.playClick();
    storage.rejectPayout(payoutId, 'Verification declined by Administrator');
    setPayouts([...storage.getPayouts()]);
    setUsers([...storage.getUsers()]);
    setActivities([...storage.getActivities()]);
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    if (!selectedUserForEdit) return;
    storage.saveUser(selectedUserForEdit);
    setSelectedUserForEdit(null);
    setUsers([...storage.getUsers()]);
    setActivities([...storage.getActivities()]);
    triggerCelebration();
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm(`Are you sure you want to permanently delete member ${userId}? This will remove all their records.`)) {
      sounds.playClick();
      storage.deleteUser(userId);
      setUsers([...storage.getUsers()]);
      setActivities([...storage.getActivities()]);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    storage.sendBroadcastNotification(broadcastTitle.trim(), broadcastMessage.trim());
    setBroadcastTitle('');
    setBroadcastMessage('');
    setBroadcastSuccess(true);
    triggerCelebration();
    setTimeout(() => setBroadcastSuccess(false), 3500);
  };

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    if (!adminReplyText.trim() || !activeChatUserId) return;
    storage.sendMessage({
      senderId: 'admin',
      senderName: 'Vikas Kumar (Founder Desk)',
      receiverId: activeChatUserId,
      message: adminReplyText.trim(),
    });
    setAdminReplyText('');
    setMessages([...storage.getMessages()]);
  };

  const handleSaveCms = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    storage.updateConfig({
      upiId: cmsUpi.trim(),
      receiverName: cmsReceiverName.trim(),
      silverPrice: Number(cmsSilverPrice),
      silverCommission: Number(cmsSilverCommission),
      platinumPrice: Number(cmsPlatinumPrice),
      platinumCommission: Number(cmsPlatinumCommission),
      royalPrice: Number(cmsRoyalPrice),
      royalCommission: Number(cmsRoyalCommission),
      announcementTicker: cmsTicker.trim(),
    });
    setCmsSaveSuccess(true);
    triggerCelebration();
    setTimeout(() => setCmsSaveSuccess(false), 3000);
  };

  const handleExportResponsesCsv = () => {
    sounds.playClick();
    const rows = [
      [
        'User ID',
        'Join Date',
        'Full Name',
        'Mobile Phone',
        'Email Address',
        'Password',
        'Enrolled System',
        'Sponsor ID',
        'Verification Status',
        'Receiving UPI ID',
        'City',
        'State',
        'Nominee Name',
        'Nominee Relation',
        'Total Earned (₹)',
        'Wallet Balance (₹)',
      ],
      ...users.map((u) => [
        u.userId || u.id,
        u.joinDate || 'N/A',
        `"${u.fullName || u.name}"`,
        u.mobile || u.phone,
        u.email,
        `"${u.password || 'password123'}"`,
        u.currentPlan ? `System ${u.currentPlan}` : u.plan,
        u.sponsorId || 'None',
        u.verificationStatus || u.planStatus,
        u.upiId || 'N/A',
        u.city || 'N/A',
        u.state || 'N/A',
        `"${u.nomineeName || 'N/A'}"`,
        `"${u.nomineeRelation || 'N/A'}"`,
        u.earnings?.totalEarned ?? u.totalEarned ?? 0,
        u.walletBalance ?? 0,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RainAksh_User_Form_Responses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportResponsesJson = () => {
    sounds.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ users, transactions, activities }, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `RainAksh_Full_Database_Dump_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics calculation
  const totalRevenue = transactions
    .filter((t) => t.status === 'approved' || t.status === 'success')
    .reduce((acc, curr) => acc + (curr.planAmount || curr.amount || 0), 0);

  const pendingApprovalsCount = transactions.filter((t) => t.status === 'pending').length;
  const pendingPayoutsAmount = payouts
    .filter((p) => p.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.userId && u.userId.toLowerCase().includes(q)) ||
      (u.mobile && u.mobile.includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.sponsorId && u.sponsorId.toLowerCase().includes(q))
    );
  });

  // Filtered Activities
  const filteredActivities = activities.filter((act) => {
    if (activityFilter === 'ALL') return true;
    return act.action === activityFilter;
  });

  // Master Access Gate
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0B0C10] border-2 border-amber-500/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(245,158,11,0.25)]">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl btn-3d-amber mx-auto flex items-center justify-center text-slate-950 shadow-xl">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white">RainAksh Control Panel</h2>
            <p className="text-xs text-amber-400 font-bold uppercase tracking-widest">
              केंद्रीय नियंत्रण प्रणाली • Master Security
            </p>
            <p className="text-xs text-slate-400">
              संपूर्ण वेबसाइट, सभी यूज़र्स के फॉर्म रिस्पॉन्स, पासवर्ड व गतिविधियों को नियंत्रित करने के लिए मास्टर कोड दर्ज करें।
            </p>
          </div>

          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-xs font-bold mb-1.5">
                Master Security Passcode
              </label>
              <input
                type="password"
                required
                placeholder="Enter Master Passcode"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center tracking-widest focus:outline-none focus:border-amber-400"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { sounds.playClick(); onClose(); }}
                className="flex-1 py-3 rounded-xl btn-3d-dark text-slate-300 text-xs font-bold min-h-[44px]"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl btn-3d-amber text-xs font-black flex items-center justify-center gap-2 shadow-lg min-h-[44px]"
              >
                <Unlock className="w-4 h-4" />
                <span>अनलॉक करें (Unlock)</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0C10] overflow-y-auto text-slate-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl btn-3d-amber flex items-center justify-center font-black text-slate-950">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white">RainAksh Control Panel</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black">
                MASTER ROOT ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              National Direct Selling & Affiliate Administration • Head: Vikas Kumar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportResponsesCsv}
            className="px-3 py-1.5 rounded-xl btn-3d-dark text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5"
            title="Download all user responses as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Responses (CSV)</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl btn-3d-amber text-xs font-black shadow"
          >
            Exit Control Panel
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-4 sm:px-6 py-2 overflow-x-auto flex gap-1.5 scrollbar-thin">
        {[
          { id: 'overview', label: 'अवलोकन (Overview)', icon: TrendingUp },
          { id: 'slider', label: `7 फोटो स्लाइडर (${slides.length}/7)`, icon: ImageIcon, badge: slides.length },
          { id: 'responses', label: `यूज़र फॉर्म रिस्पॉन्स (${users.length})`, icon: FileText, badge: users.length },
          { id: 'activities', label: `ऑडिट व एक्टिविटी इतिहास (${activities.length})`, icon: History, badge: activities.length },
          { id: 'txns', label: `पेमेंट सत्यापन (${pendingApprovalsCount})`, icon: CreditCard, alert: pendingApprovalsCount > 0 },
          { id: 'payouts', label: `UPI पेआउट्स (${payouts.filter(p => p.status === 'pending').length})`, icon: Wallet },
          { id: 'inquiries', label: `हेल्पडेस्क संदेश (${inquiries.length})`, icon: Mail },
          { id: 'broadcast', label: 'सूचना प्रसारण (Broadcast)', icon: Bell },
          { id: 'chat', label: 'लाइव चैट (Live Support)', icon: MessageSquare },
          { id: 'cms', label: 'सिस्टम सेटिंग्स व CMS', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id as AdminTab);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'btn-3d-amber text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 border border-slate-800/80 btn-3d-dark'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
              {tab.alert && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-lg">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">कुल पंजीकृत यूज़र्स</span>
                <p className="text-3xl font-black text-white font-mono">{users.length}</p>
                <span className="text-xs text-emerald-400 font-bold">100% Active in Database</span>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-lg">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">कुल रेवेन्यू संग्रह (Verified)</span>
                <p className="text-3xl font-black text-amber-400 font-mono">₹{totalRevenue.toLocaleString('en-IN')}</p>
                <span className="text-xs text-slate-400">Direct to {config.upiId}</span>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-lg">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">लंबित पेमेंट सत्यापन</span>
                <p className="text-3xl font-black text-cyan-400 font-mono">{pendingApprovalsCount}</p>
                <span className="text-xs text-cyan-300">Requires UTR verification</span>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-lg">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">लंबित UPI पेआउट देनदारी</span>
                <p className="text-3xl font-black text-rose-400 font-mono">₹{pendingPayoutsAmount.toLocaleString('en-IN')}</p>
                <span className="text-xs text-slate-400">Direct commission withdrawals</span>
              </div>
            </div>

            {/* Quick Actions & Recent Activities preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-amber-400" />
                    <h3 className="font-black text-white text-sm">हाल की गतिविधियां व ऑडिट लॉग (Live Activity Stream)</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('activities')}
                    className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>पूरा इतिहास देखें</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activities.slice(0, 5).map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              act.action === 'JOIN'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : act.action === 'PASSWORD_UPDATE'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                : act.action === 'PLAN_PURCHASE'
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {act.action}
                          </span>
                          <span className="text-xs font-black text-white">{act.userName}</span>
                          <span className="text-[11px] text-slate-400 font-mono">({act.userId})</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{act.description}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
                        {act.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h3 className="font-black text-white text-sm">कंट्रोल पैनल त्वरित क्रियाएं</h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setActiveTab('responses')}
                    className="w-full p-3 rounded-2xl btn-3d-dark text-left text-xs font-bold text-slate-200 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>सभी फॉर्म रिस्पॉन्स व पासवर्ड देखें</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab('txns')}
                    className="w-full p-3 rounded-2xl btn-3d-dark text-left text-xs font-bold text-slate-200 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-cyan-400" />
                      <span>पेमेंट स्क्रीनशॉट व UTR अप्रूव करें ({pendingApprovalsCount})</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={handleExportResponsesCsv}
                    className="w-full p-3 rounded-2xl btn-3d-dark text-left text-xs font-bold text-slate-200 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>CSV फाइल में डाउनलोड करें</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={handleExportResponsesJson}
                    className="w-full p-3 rounded-2xl btn-3d-dark text-left text-xs font-bold text-slate-200 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-purple-400" />
                      <span>Full JSON Backup Dump</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: FORM RESPONSES & ALL MEMBERS ================= */}
        {activeTab === 'responses' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-3xl border border-slate-800">
              <div className="space-y-0.5">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <span>सभी यूज़र फॉर्म रिस्पॉन्स एवं विवरण (All Form Responses & Details)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  यूज़र ने कब जॉइन किया, क्या फॉर्म भरा, क्या पासवर्ड है, कौन सा सिस्टम लिया - सब कुछ यहाँ उपलब्ध है।
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name, ID, phone, email..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  onClick={handleExportResponsesCsv}
                  className="px-3.5 py-2 rounded-xl btn-3d-amber text-xs font-black flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV Export</span>
                </button>
              </div>
            </div>

            {/* Form Responses Table */}
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">User ID & Avatar</th>
                    <th className="p-3.5">Join Date & Time</th>
                    <th className="p-3.5">Full Name & Phone</th>
                    <th className="p-3.5">Account Password</th>
                    <th className="p-3.5">Selected System</th>
                    <th className="p-3.5">Receiving UPI ID</th>
                    <th className="p-3.5">Location & Nominee</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400">
                        कोई फॉर्म रिस्पॉन्स नहीं मिला।
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isPassVisible = showUserPasswords[u.userId || u.id];
                      return (
                        <tr key={u.userId || u.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={u.profilePic || u.avatarUrl}
                                alt={u.fullName}
                                className="w-8 h-8 rounded-lg object-cover border border-amber-400/40"
                              />
                              <div>
                                <span className="font-mono font-bold text-amber-300 block">{u.userId || u.id}</span>
                                <span className="text-[10px] text-slate-400">Ref: {u.sponsorId || 'None'}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className="font-mono text-slate-200 block">{u.joinDate || '2026-01-01'}</span>
                            <span className="text-[10px] text-emerald-400">Form Submitted</span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className="font-black text-white block">{u.fullName || u.name}</span>
                            <span className="font-mono text-slate-400 text-[11px] block">{u.mobile || u.phone}</span>
                            <span className="text-[10px] text-cyan-400">{u.email}</span>
                          </td>

                          {/* USER PASSWORD DISPLAY (Requested: password kya hai sab kuch dikhna chahiye) */}
                          <td className="p-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-700/80 font-mono">
                              <span className="text-amber-400 font-bold text-xs">
                                {isPassVisible ? (u.password || 'password123') : '••••••••'}
                              </span>
                              <button
                                onClick={() => {
                                  sounds.playClick();
                                  setShowUserPasswords((prev) => ({
                                    ...prev,
                                    [u.userId || u.id]: !prev[u.userId || u.id],
                                  }));
                                }}
                                className="text-slate-400 hover:text-white p-0.5 ml-1"
                                title="Toggle password visibility"
                              >
                                {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-block ${
                                u.currentPlan === '1000' || u.plan === 'royal'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                                  : u.currentPlan === '500' || u.plan === 'platinum'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                              }`}
                            >
                              {u.currentPlan ? `System ₹${u.currentPlan}` : `${u.plan} System`}
                            </span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className="font-mono text-cyan-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-cyan-900/50">
                              {u.upiId || 'Not provided'}
                            </span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className="text-slate-300 block">{u.city || 'Patna'}, {u.state || 'Bihar'}</span>
                            <span className="text-[10px] text-slate-400">Nominee: {u.nomineeName || 'N/A'} ({u.nomineeRelation || 'N/A'})</span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                u.verificationStatus === 'verified' || u.planStatus === 'active'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {u.verificationStatus || u.planStatus}
                            </span>
                          </td>

                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  sounds.playClick();
                                  setSelectedUserDetail(u);
                                }}
                                className="p-1.5 rounded-lg btn-3d-dark text-cyan-400 hover:text-cyan-300"
                                title="View Complete Form Response"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  sounds.playClick();
                                  setSelectedUserForEdit({ ...u });
                                }}
                                className="p-1.5 rounded-lg btn-3d-dark text-amber-400 hover:text-amber-300"
                                title="Edit Member Form Details"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.userId || u.id)}
                                className="p-1.5 rounded-lg btn-3d-dark text-rose-400 hover:text-rose-300"
                                title="Delete Member"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: USER ACTIVITIES & AUDIT LOG ================= */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-3xl border border-slate-800">
              <div className="space-y-0.5">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-400" />
                  <span>ऑडिट एवं एक्टिविटी इतिहास (Full User Audit History)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  हर यूज़र ने कब जॉइन किया, कब क्या विवरण बदला, पासवर्ड कब बदला, क्या अपलोड या रिमूव किया - सम्पूर्ण रिकॉर्ड।
                </p>
              </div>

              {/* Action Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
                >
                  <option value="ALL">सभी क्रियाएं (All Actions)</option>
                  <option value="JOIN">जॉइनिंग (JOIN)</option>
                  <option value="PLAN_PURCHASE">प्लान/सिस्टम फॉर्म (PLAN_PURCHASE)</option>
                  <option value="PROFILE_UPDATE">प्रोफाइल बदलाव (PROFILE_UPDATE)</option>
                  <option value="PASSWORD_UPDATE">पासवर्ड बदलाव (PASSWORD_UPDATE)</option>
                  <option value="AVATAR_UPDATE">फ़ोटो अपलोड (AVATAR_UPDATE)</option>
                  <option value="AVATAR_REMOVE">फ़ोटो रिमूव (AVATAR_REMOVE)</option>
                  <option value="CONTACT_FORM">हेल्पडेस्क संदेश (CONTACT_FORM)</option>
                </select>

                <button
                  onClick={() => {
                    if (window.confirm('Clear all activity logs?')) {
                      storage.clearActivities();
                      setActivities([]);
                    }
                  }}
                  className="p-2 rounded-xl btn-3d-dark text-slate-400 hover:text-rose-400 text-xs"
                  title="Clear history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Timeline Stream */}
            <div className="space-y-3">
              {filteredActivities.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400">
                  कोई गतिविधि रिकॉर्ड नहीं मिली।
                </div>
              ) : (
                filteredActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                            act.action === 'JOIN'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : act.action === 'PASSWORD_UPDATE'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : act.action === 'PLAN_PURCHASE'
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                              : act.action === 'AVATAR_UPDATE'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {act.action}
                        </span>
                        <h4 className="font-black text-white text-sm">{act.userName}</h4>
                        <span className="font-mono text-xs text-amber-400">({act.userId})</span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{act.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{act.description}</p>

                    {act.details && (
                      <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80 text-[11px] font-mono text-slate-400 overflow-x-auto">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Audit Metadata:</span>
                        <pre className="text-slate-300">{JSON.stringify(act.details, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: TRANSACTIONS & PROOFS ================= */}
        {activeTab === 'txns' && (
          <div className="space-y-4">
            <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  <span>पेमेंट सत्यापन व स्क्रीनशॉट (Payment Verification)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  यूज़र्स द्वारा सबमिट किए गए UTR और भुगतान स्क्रीनशॉट की जांच कर 1-क्लिक में अप्रूव करें।
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400">
                  कोई ट्रांजेक्शन रिकॉर्ड नहीं है।
                </div>
              ) : (
                transactions.map((txn) => {
                  const isPending = txn.status === 'pending';
                  return (
                    <div
                      key={txn.transactionId || txn.id}
                      className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-400 text-xs">
                              {txn.transactionId || txn.id}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                txn.status === 'approved' || txn.status === 'success'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : txn.status === 'rejected'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {txn.status}
                            </span>
                          </div>
                          <p className="text-sm font-black text-white">
                            {txn.userName} ({txn.userPhone}) • User ID: <span className="font-mono text-cyan-400">{txn.userId}</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-2xl font-black text-white font-mono">
                            ₹{txn.planAmount || txn.amount}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            System {txn.plan}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 font-bold block">UTR / Transaction Ref</span>
                          <span className="font-mono font-black text-yellow-400 select-all text-sm">
                            {txn.upiTxnRef || txn.utrNumber || 'N/A'}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 font-bold block">Sponsor ID</span>
                          <span className="font-mono text-white text-xs">{txn.sponsorId || 'None'}</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 font-bold block">Date & Time</span>
                          <span className="font-mono text-slate-300 text-xs">{txn.timestamp || txn.createdAt}</span>
                        </div>
                      </div>

                      {/* Proof Image Preview */}
                      {(txn.proofImage || txn.proofImageUrl) && (
                        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                          <img
                            src={txn.proofImage || txn.proofImageUrl}
                            alt="Payment Proof"
                            className="w-14 h-14 rounded-xl object-cover cursor-pointer border border-cyan-500/50 hover:scale-105 transition"
                            onClick={() => setPreviewProofImage(txn.proofImage || txn.proofImageUrl || null)}
                          />
                          <div>
                            <span className="text-xs font-bold text-white block">भुगतान स्क्रीनशॉट संलग्न है</span>
                            <button
                              type="button"
                              onClick={() => setPreviewProofImage(txn.proofImage || txn.proofImageUrl || null)}
                              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-bold mt-0.5"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>बड़ा करके देखें (Zoom Proof)</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {isPending && (
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleApproveTxn(txn.transactionId || txn.id)}
                            className="flex-1 py-2.5 rounded-xl btn-3d-emerald text-xs font-black flex items-center justify-center gap-1.5 shadow"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Approve & Activate System (कमीशन ट्रांसफर करें)</span>
                          </button>
                          <button
                            onClick={() => setRejectTxnId(txn.transactionId || txn.id)}
                            className="px-4 py-2.5 rounded-xl btn-3d-dark text-rose-400 border border-rose-500/30 text-xs font-bold"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 5: UPI PAYOUTS ================= */}
        {activeTab === 'payouts' && (
          <div className="space-y-4">
            <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <span>UPI रेफरल कमीशन पेआउट्स (Direct Commission Payouts)</span>
              </h2>
              <p className="text-xs text-slate-400">
                मेंबर्स द्वारा की गई कमीशन निकासी रिक्वेस्ट्स को बैंक UTR के साथ अप्रूव करें।
              </p>
            </div>

            <div className="space-y-3">
              {payouts.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400">
                  कोई पेआउट रिक्वेस्ट लंबित नहीं है।
                </div>
              ) : (
                payouts.map((p) => {
                  const isPending = p.status === 'pending';
                  return (
                    <div
                      key={p.id}
                      className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                        <div>
                          <span className="font-mono text-xs text-amber-400 font-bold block">{p.id}</span>
                          <h4 className="text-sm font-black text-white">
                            {p.userName} • Member ID: <span className="font-mono text-cyan-400">{p.userId}</span>
                          </h4>
                          <span className="text-xs text-slate-400 font-mono">
                            Requested: {p.requestedAt}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-2xl font-black text-emerald-400 font-mono">
                            ₹{p.amount}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Target UPI: <strong className="text-yellow-300">{p.upiId}</strong>
                          </span>
                        </div>
                      </div>

                      {isPending ? (
                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Enter Bank UTR (e.g. 602938192837)"
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                            value={payoutUtrMap[p.id] || ''}
                            onChange={(e) =>
                              setPayoutUtrMap({ ...payoutUtrMap, [p.id]: e.target.value })
                            }
                          />
                          <button
                            onClick={() => handleApprovePayout(p.id)}
                            className="px-5 py-2.5 rounded-xl btn-3d-emerald text-xs font-black flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mark Paid via UPI</span>
                          </button>
                          <button
                            onClick={() => handleRejectPayout(p.id)}
                            className="px-4 py-2.5 rounded-xl btn-3d-dark text-rose-400 border border-rose-500/30 text-xs font-bold"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs font-mono text-slate-400">
                          Status: <strong className="text-emerald-400 uppercase">{p.status}</strong> • UTR: {p.utrReference || 'Processed'}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 6: INQUIRIES ================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="bg-slate-900/80 p-4 rounded-3xl border border-slate-800">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span>हेल्पडेस्क संदेश व पूछताछ (Contact Inquiries)</span>
              </h2>
              <p className="text-xs text-slate-400">
                वेबसाइट के Contact Desk से आए सभी डायरेक्ट संदेश।
              </p>
            </div>

            <div className="space-y-3">
              {inquiries.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400">
                  कोई पूछताछ संदेश नहीं है।
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div key={inq.id} className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm">{inq.name}</span>
                        <span className="font-mono text-xs text-amber-400">({inq.phone})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{inq.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{inq.message}</p>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <a
                        href={`https://t.me/rainaksh`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl btn-3d-telegram text-[11px] font-bold flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Telegram Reply (@rainaksh)</span>
                      </a>
                      <a
                        href={`mailto:accaiwork@gmail.com?subject=Response%20to%20${inq.name}&body=Namaste%20${inq.name},`}
                        className="px-3 py-1.5 rounded-xl btn-3d-email text-[11px] font-bold flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Email Reply</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 7: BROADCAST ================= */}
        {activeTab === 'broadcast' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <span>ग्लोबल प्रसारण सूचना (Global Announcement Broadcast)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  सभी मेंबर्स के डैशबोर्ड पर तुरंत पॉप-अप व नोटिफिकेशन स्ट्रिप भेजें।
                </p>
              </div>

              {broadcastSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>सूचना सफलतापूर्वक सभी मेंबर्स के लिए प्रसारित कर दी गई है!</span>
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">Announcement Title (शीर्षक)</label>
                  <input
                    type="text"
                    required
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="e.g. 📢 विशेष बोनस: आज सभी जॉइनिंग पर 10% एक्स्ट्रा पेआउट!"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold">Detailed Message (विस्तृत संदेश)</label>
                  <textarea
                    required
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="संदेश लिखें..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-3d-amber w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Push Broadcast to All Members</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= TAB 8: CHAT ================= */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
            <div className="space-y-3 border-r border-slate-800 pr-4">
              <h3 className="font-black text-white text-xs uppercase tracking-wider">मेंबर्स सूची</h3>
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
                {users.map((u) => (
                  <button
                    key={u.userId || u.id}
                    onClick={() => setActiveChatUserId(u.userId || u.id)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition flex items-center justify-between ${
                      activeChatUserId === (u.userId || u.id)
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <span className="block font-bold truncate max-w-[140px]">{u.fullName || u.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{u.userId || u.id}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
              <div>
                <div className="border-b border-slate-800 pb-2 mb-3">
                  <h4 className="font-black text-white text-sm">
                    Chat with {users.find((u) => (u.userId || u.id) === activeChatUserId)?.fullName || activeChatUserId}
                  </h4>
                  <span className="text-[10px] text-slate-400">Direct 1-on-1 Founder Support Channel</span>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {storage.getConversationWithUser(activeChatUserId).length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-8">कोई पुराना चैट संदेश नहीं है।</p>
                  ) : (
                    storage.getConversationWithUser(activeChatUserId).map((m) => {
                      const isAdmin = m.senderId === 'admin';
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`p-3 rounded-2xl max-w-sm text-xs ${
                              isAdmin
                                ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none shadow'
                                : 'bg-slate-800 text-slate-100 rounded-bl-none'
                            }`}
                          >
                            <p>{m.message}</p>
                            <span className="text-[9px] opacity-70 mt-1 block text-right font-mono">
                              {m.timestamp}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <form onSubmit={handleSendAdminReply} className="flex gap-2">
                <input
                  type="text"
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  placeholder="संदेश का उत्तर लिखें..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl btn-3d-amber text-xs font-black flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= TAB 9: CMS & SYSTEM SETTINGS ================= */}
        {activeTab === 'cms' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-400" />
                  <span>वेबसाइट सेटिंग्स व CMS (System Controls & Payment Gateway)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  वेबसाइट का पेमेंट UPI ID, रिसीवर का नाम, तीनों सिस्टम्स की कीमतें व कमीशन प्रतिशत नियंत्रित करें।
                </p>
              </div>

              {cmsSaveSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>सिस्टम सेटिंग्स सफलतापूर्वक अपडेट कर दी गई हैं!</span>
                </div>
              )}

              <form onSubmit={handleSaveCms} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Official Receiver UPI ID</label>
                    <input
                      type="text"
                      required
                      value={cmsUpi}
                      onChange={(e) => setCmsUpi(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Receiver / Founder Name</label>
                    <input
                      type="text"
                      required
                      value={cmsReceiverName}
                      onChange={(e) => setCmsReceiverName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                {/* 3 Systems pricing and payouts */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    3-System Pricing & Referral Commission Matrix
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-emerald-400 font-bold block">System 1 (Silver)</span>
                      <label className="block text-slate-500 text-[10px]">Price (₹)</label>
                      <input
                        type="number"
                        value={cmsSilverPrice}
                        onChange={(e) => setCmsSilverPrice(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                      />
                      <label className="block text-slate-500 text-[10px] mt-1">Payout (₹)</label>
                      <input
                        type="number"
                        value={cmsSilverCommission}
                        onChange={(e) => setCmsSilverCommission(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-cyan-400 font-bold block">System 2 (Platinum)</span>
                      <label className="block text-slate-500 text-[10px]">Price (₹)</label>
                      <input
                        type="number"
                        value={cmsPlatinumPrice}
                        onChange={(e) => setCmsPlatinumPrice(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                      />
                      <label className="block text-slate-500 text-[10px] mt-1">Payout (₹)</label>
                      <input
                        type="number"
                        value={cmsPlatinumCommission}
                        onChange={(e) => setCmsPlatinumCommission(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-amber-400 font-bold block">System 3 (Royal VIP)</span>
                      <label className="block text-slate-500 text-[10px]">Price (₹)</label>
                      <input
                        type="number"
                        value={cmsRoyalPrice}
                        onChange={(e) => setCmsRoyalPrice(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                      />
                      <label className="block text-slate-500 text-[10px] mt-1">Payout (₹)</label>
                      <input
                        type="number"
                        value={cmsRoyalCommission}
                        onChange={(e) => setCmsRoyalCommission(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Announcement Ticker Text (होमपेज टिकर)</label>
                  <textarea
                    rows={3}
                    value={cmsTicker}
                    onChange={(e) => setCmsTicker(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 btn-3d-amber py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save System Configurations</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset database to pristine default seed state?')) {
                        storage.resetToDefault();
                        setUsers(storage.getUsers());
                        setTransactions(storage.getTransactions());
                        setActivities(storage.getActivities());
                        alert('Database reset to clean factory state.');
                      }
                    }}
                    className="px-4 py-3.5 rounded-2xl btn-3d-dark text-rose-400 border border-rose-500/30 text-xs font-bold"
                  >
                    Reset DB
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= TAB: 7-PHOTO POPUP SLIDER ================= */}
        {activeTab === 'slider' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Box */}
            <div className="bg-slate-900/80 p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-400/30">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>होम पेज पॉपअप स्लाइडर (Max 7 Photos)</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>7 फोटो होम पेज पॉपअप स्लाइडर प्रबंधन</span>
                  </h2>
                  <p className="text-xs text-slate-400 max-w-xl">
                    यहाँ आप अधिकतम 7 फोटो अपलोड कर सकते हैं। होम पेज पर आने वाले यूज़र्स के सामने यह फोटो उनके ऑरिजिनल साइज के अनुसार ज़ूम-इन/आउट इफ़ेक्ट के साथ प्रदर्शित होंगी।
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:self-start">
                  <button
                    onClick={() => handleToggleMasterSlider(!sliderEnabled)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                      sliderEnabled
                        ? 'btn-3d-amber text-slate-950 font-black shadow-md'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${sliderEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    <span>स्लाइडर: {sliderEnabled ? 'सक्रिय (ON)' : 'निष्क्रिय (OFF)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      if (slides.length === 0) {
                        alert('कृपया पहले कम से कम 1 फोटो अपलोड करें ताकि पॉपअप टेस्ट किया जा सके।');
                        return;
                      }
                      triggerMegaCelebration();
                      setPreviewSliderModal(true);
                    }}
                    className="px-3.5 py-2 rounded-xl btn-3d-cyan text-xs font-black shadow flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>लाइव पॉपअप टेस्ट करें</span>
                  </button>
                </div>
              </div>

              {sliderMessage && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                  <span>{sliderMessage}</span>
                  <button onClick={() => setSliderMessage('')} className="text-slate-400 hover:text-white text-xs">
                    ✕
                  </button>
                </div>
              )}

              {/* 7-Slot Tracker Bar */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-300">
                    स्लॉट उपयोग: <strong className="text-amber-400">{slides.length}</strong> / 7 फोटो भरी हुई हैं
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {7 - slides.length > 0 ? `${7 - slides.length} स्लॉट खाली` : 'सभी 7 स्लॉट पूर्ण'}
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
                    const slide = slides[idx];
                    return (
                      <div
                        key={idx}
                        className={`h-12 rounded-xl border flex flex-col items-center justify-center p-0.5 overflow-hidden transition ${
                          slide
                            ? slide.enabled
                              ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                              : 'border-slate-700 bg-slate-800/60 opacity-60'
                            : 'border-dashed border-slate-800 bg-slate-950/60 text-slate-600'
                        }`}
                        title={slide ? `स्लॉट ${idx + 1}: ${slide.title || 'Photo'}` : `स्लॉट ${idx + 1}: खाली`}
                      >
                        {slide ? (
                          <img
                            src={slide.imageUrl}
                            alt="thumb"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Target Pages Selector Box */}
            <div className="bg-slate-900/80 p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>🎯 पॉपअप कहाँ-कहाँ दिखाना है? (Target Pages Selection)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    चुनें कि यूज़र को यह फोटो स्लाइडर पॉपअप किन-किन पेजों पर दिखना चाहिए (बाय डिफ़ॉल्ट: मुख्य पृष्ठ / Home Page)।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSetHomeOnly}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition"
                  >
                    केवल होम पेज (Default)
                  </button>
                  <button
                    type="button"
                    onClick={handleSetAllPages}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition"
                  >
                    सभी पेजों पर (All Pages)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {[
                  { id: 'home', label: '🏠 मुख्य पृष्ठ (Home)', desc: 'मुख्य लैंडिंग पेज' },
                  { id: 'plans', label: '👑 3 प्लान्स व तुलना (Plans)', desc: '₹100, ₹500, ₹1000' },
                  { id: 'guide', label: '📜 नियम व गाइड (Guide)', desc: 'गाइडलाइन्स पेज' },
                  { id: 'faq', label: '❓ सवाल-जवाब (FAQ)', desc: 'हेल्प व FAQ' },
                  { id: 'dashboard', label: '💳 मेंबर डैशबोर्ड (Dashboard)', desc: 'लॉगिन सदस्यों के लिए' },
                  { id: 'legal', label: '⚖️ कानूनी नीतियां (Legal)', desc: 'शर्तें व प्राइवेसी' },
                ].map((page) => {
                  const isChecked = sliderTargetPages.includes(page.id);
                  return (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => handleToggleTargetPage(page.id)}
                      className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 cursor-pointer pointer-events-none"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-black block">{page.label}</span>
                        <span className="text-[10px] text-slate-400">{page.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 flex items-center justify-between">
                <span>वर्तमान सक्रिय पृष्ठ: <strong className="text-amber-400 font-mono font-bold">[{sliderTargetPages.join(', ')}]</strong></span>
                <span className="text-emerald-400 font-bold">✓ ऑटोमैटिक क्लाउड सिंक</span>
              </div>
            </div>

            {/* Upload New Slide Form (Only if < 7) */}
            {slides.length < 7 ? (
              <div className="bg-slate-900/80 p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>नया फोटो जोड़ें (स्लॉट #{slides.length + 1} of 7)</span>
                </h3>

                <form onSubmit={handleAddSlide} className="space-y-4 text-xs">
                  {/* File Upload / URL Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-slate-300 font-bold">
                        1. मोबाइल या कंप्यूटर से फोटो चुनें:
                      </label>
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-amber-400/50 hover:border-amber-400 rounded-2xl p-4 cursor-pointer bg-slate-950 hover:bg-slate-900 transition text-center min-h-[110px]">
                        <Upload className="w-6 h-6 text-amber-400 mb-1" />
                        <span className="text-xs font-bold text-white">फोटो फ़ाइल अपलोड करें</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP (ऑटो-कंप्रेस्ड)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadSlideImage}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-slate-300 font-bold">
                        2. या ऑनलाइन इमेज URL दर्ज करें:
                      </label>
                      <input
                        type="url"
                        value={newSlideUrl}
                        onChange={(e) => setNewSlideUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... या कोई भी फोटो लिंक"
                        className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs min-h-[46px]"
                      />
                      <p className="text-[10px] text-slate-400">
                        टिप: फोटो चाहे खड़ी (Portrait) हो या आड़ी (Landscape), पॉपअप उसी अनुपात में सटीक खुलेगा।
                      </p>
                    </div>
                  </div>

                  {/* Image Preview Box */}
                  {newSlideUrl && (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-amber-400/40 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={newSlideUrl}
                          alt="preview"
                          className="w-20 h-20 object-contain rounded-xl bg-black border border-slate-800"
                        />
                        <div>
                          <span className="text-[11px] font-bold text-emerald-400 block">✓ फोटो तैयार है</span>
                          <span className="text-[10px] text-slate-400">नीचे विवरण भरकर सबमिट करें</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewSlideUrl('')}
                        className="text-xs text-rose-400 hover:text-rose-300 p-2"
                      >
                        फोटो हटाएं
                      </button>
                    </div>
                  )}

                  {/* Optional Text Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">शीर्षक (Optional Title):</label>
                      <input
                        type="text"
                        value={newSlideTitle}
                        onChange={(e) => setNewSlideTitle(e.target.value)}
                        placeholder="e.g. 📢 विशेष बोनस 2026: ₹1000 प्लान पर VIP ताज"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs min-h-[42px]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">उप-शीर्षक (Optional Subtitle):</label>
                      <input
                        type="text"
                        value={newSlideSubtitle}
                        onChange={(e) => setNewSlideSubtitle(e.target.value)}
                        placeholder="e.g. हर डायरेक्ट इनवाइट पर ₹765 नकद सीधा बैंक में!"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs min-h-[42px]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">बटन टेक्स्ट (Optional Button Label):</label>
                      <input
                        type="text"
                        value={newSlideLinkText}
                        onChange={(e) => setNewSlideLinkText(e.target.value)}
                        placeholder="e.g. अभी जॉइन करें (Join Now)"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs min-h-[42px]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">बटन एक्शन / लिंक (Optional Link):</label>
                      <input
                        type="text"
                        value={newSlideLinkUrl}
                        onChange={(e) => setNewSlideLinkUrl(e.target.value)}
                        placeholder="e.g. royal (या कोई वेबसाइट URL)"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs min-h-[42px]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={!newSlideUrl}
                      className="btn-3d-rainbow px-6 py-3 rounded-2xl text-xs font-black shadow-xl flex items-center gap-2 min-h-[46px] disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>स्लाइड जोड़ें (Save to Slot #{slides.length + 1})</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-amber-300 text-xs font-bold text-center">
                ✓ सभी 7 फोटो स्लॉट पूरे हो चुके हैं। नई फोटो जोड़ने के लिए पहले किसी पुरानी फोटो को डिलीट करें।
              </div>
            )}

            {/* List of Active Slides */}
            <div className="bg-slate-900/80 p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>अपलोड की गई फोटो स्लाइड्स ({slides.length}/7)</span>
                </h3>
                {slides.length > 0 && (
                  <button
                    onClick={handleClearAllSlides}
                    className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                    title="सभी फोटो डिलीट करें ताकि कोई पॉपअप न दिखे"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>सभी फोटो हटाएं (Delete All)</span>
                  </button>
                )}
              </div>

              {slides.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-3xl space-y-2">
                  <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">वर्तमान में कोई फोटो अपलोड नहीं है</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    चूंकि कोई फोटो अपलोड नहीं है, इसलिए होम पेज पर कोई पॉपअप नहीं खुलेगा। ऊपर दिए गए फॉर्म से फोटो अपलोड करें।
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        slide.enabled
                          ? 'bg-slate-950 border-amber-400/50 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex flex-col items-center justify-center gap-1 shrink-0">
                          <button
                            onClick={() => handleMoveSlide(index, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] font-mono font-black text-amber-400">
                            #{index + 1}
                          </span>
                          <button
                            onClick={() => handleMoveSlide(index, 'down')}
                            disabled={index === slides.length - 1}
                            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-black border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={slide.imageUrl}
                            alt={slide.title || 'Slide'}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                              स्लॉट {index + 1}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                slide.enabled
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {slide.enabled ? 'सक्रिय (Active)' : 'बंद (Disabled)'}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-black text-white truncate">
                            {slide.title || 'शीर्षक रहित स्लाइड'}
                          </h4>
                          {slide.subtitle && (
                            <p className="text-[11px] text-slate-400 truncate">{slide.subtitle}</p>
                          )}
                          {slide.linkText && (
                            <span className="text-[10px] text-amber-300 block">
                              बटन: {slide.linkText}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => handleToggleSlide(slide.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            slide.enabled
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                          }`}
                        >
                          {slide.enabled ? 'सक्रिय' : 'चालू करें'}
                        </button>

                        <button
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/80 text-rose-400 border border-rose-500/30 transition shadow"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rules & Guidelines Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-amber-400/30 text-xs text-slate-300 space-y-2">
              <h5 className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>पॉपअप स्लाइडर के नियम व मोबाइल अनुकूलन:</span>
              </h5>
              <ul className="space-y-1 text-[11px] text-slate-300 list-disc pl-4">
                <li><strong>होम पेज पर ही प्रदर्शित:</strong> यह पॉपअप केवल वेबसाइट के मुख्य पृष्ठ (Home Page) पर ही खुलता है।</li>
                <li><strong>फोटो के आकार के अनुसार स्वतः साइज:</strong> फोटो का जो भी वास्तविक आकार (लंबा, चौड़ा या चौकोर) होगा, पॉपअप उसी अनुसार मोबाइल या डेस्कटॉप स्क्रीन पर बिना कटे फिट होगा।</li>
                <li><strong>ज़ूम-इन और ज़ूम-आउट प्रभाव:</strong> पॉपअप स्मूथ 3D ज़ूम-इन के साथ खुलता है और बंद करते समय ज़ूम-आउट होता है।</li>
                <li><strong>यदि कोई फोटो नहीं है:</strong> जब कोई भी फोटो अपलोड नहीं होगी या सभी बंद होंगी, तो होम पेज पर कोई पॉपअप नहीं आएगा।</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* FULL USER RESPONSE MODAL */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0B0C10] border-2 border-cyan-500/80 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">Full User Form Response</h3>
                <span className="font-mono text-xs text-amber-400">{selectedUserDetail.userId || selectedUserDetail.id}</span>
              </div>
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Full Name</span>
                <span className="font-bold text-white text-sm">{selectedUserDetail.fullName || selectedUserDetail.name}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Mobile Phone</span>
                <span className="font-mono font-bold text-white">{selectedUserDetail.mobile || selectedUserDetail.phone}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Email Address</span>
                <span className="font-mono text-cyan-300">{selectedUserDetail.email}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Account Password (पासवर्ड)</span>
                <span className="font-mono font-black text-yellow-400 text-sm select-all">
                  {selectedUserDetail.password || 'password123'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Sponsor ID</span>
                <span className="font-mono text-amber-400">{selectedUserDetail.sponsorId || 'None'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Enrolled System</span>
                <span className="font-black text-emerald-400">
                  {selectedUserDetail.currentPlan ? `System ₹${selectedUserDetail.currentPlan}` : selectedUserDetail.plan}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Receiving UPI ID</span>
                <span className="font-mono text-yellow-300 font-bold">{selectedUserDetail.upiId || 'N/A'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Joining Date</span>
                <span className="font-mono text-slate-300">{selectedUserDetail.joinDate || 'N/A'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">City & State</span>
                <span className="text-white">{selectedUserDetail.city || 'N/A'}, {selectedUserDetail.state || 'N/A'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Nominee Details</span>
                <span className="text-white">{selectedUserDetail.nomineeName || 'N/A'} ({selectedUserDetail.nomineeRelation || 'N/A'})</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="px-5 py-2.5 rounded-xl btn-3d-amber text-xs font-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER FORM MODAL */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0B0C10] border-2 border-amber-500/80 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                Edit Member Details • {selectedUserForEdit.userId || selectedUserForEdit.id}
              </h3>
              <button
                onClick={() => setSelectedUserForEdit(null)}
                className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-3.5 text-xs">
              {/* Permanent Fixed Non-Editable User ID */}
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-amber-300 font-black flex items-center gap-1.5 text-xs">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>User ID (स्थायी व नॉन-एडिटेबल आईडी)</span>
                  </label>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    FIXED & NON-EDITABLE
                  </span>
                </div>
                <input
                  type="text"
                  disabled
                  readOnly
                  value={selectedUserForEdit.userId || selectedUserForEdit.id}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-amber-500/30 text-amber-300 font-mono font-black text-sm cursor-not-allowed select-all"
                />
                <p className="text-[10px] text-slate-400">
                  🔒 यह आईडी सिस्टम द्वारा प्लान ({selectedUserForEdit.currentPlan}) और नाम के अनुसार स्थायी रूप से लॉक है। इसे किसी भी स्थिति में एडिट या बदला नहीं जा सकता।
                </p>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Full Name</label>
                <input
                  type="text"
                  required
                  value={selectedUserForEdit.fullName || selectedUserForEdit.name}
                  onChange={(e) =>
                    setSelectedUserForEdit({
                      ...selectedUserForEdit,
                      fullName: e.target.value,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Mobile</label>
                  <input
                    type="tel"
                    required
                    value={selectedUserForEdit.mobile || selectedUserForEdit.phone}
                    onChange={(e) =>
                      setSelectedUserForEdit({
                        ...selectedUserForEdit,
                        mobile: e.target.value,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Account Password</label>
                  <input
                    type="text"
                    required
                    value={selectedUserForEdit.password || ''}
                    onChange={(e) =>
                      setSelectedUserForEdit({
                        ...selectedUserForEdit,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-yellow-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Email</label>
                <input
                  type="email"
                  required
                  value={selectedUserForEdit.email}
                  onChange={(e) =>
                    setSelectedUserForEdit({
                      ...selectedUserForEdit,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Receiving UPI ID</label>
                <input
                  type="text"
                  required
                  value={selectedUserForEdit.upiId || ''}
                  onChange={(e) =>
                    setSelectedUserForEdit({
                      ...selectedUserForEdit,
                      upiId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Enrolled System</label>
                  <select
                    value={selectedUserForEdit.currentPlan}
                    onChange={(e) =>
                      setSelectedUserForEdit({
                        ...selectedUserForEdit,
                        currentPlan: e.target.value as PlanAmount,
                        plan: e.target.value === '1000' ? 'royal' : e.target.value === '500' ? 'platinum' : 'silver',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="100">System ₹100 (Silver)</option>
                    <option value="500">System ₹500 (Platinum)</option>
                    <option value="1000">System ₹1000 (Royal VIP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Status</label>
                  <select
                    value={selectedUserForEdit.verificationStatus}
                    onChange={(e) =>
                      setSelectedUserForEdit({
                        ...selectedUserForEdit,
                        verificationStatus: e.target.value as any,
                        planStatus: e.target.value === 'verified' ? 'active' : 'pending',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="verified">Verified (Active)</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedUserForEdit(null)}
                  className="flex-1 py-2.5 rounded-xl btn-3d-dark text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl btn-3d-amber text-xs font-black shadow-lg"
                >
                  Save Changes (अपडेट करें)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROOF ZOOM MODAL */}
      {previewProofImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#0B0C10] border-2 border-cyan-500/80 rounded-3xl p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Payment Screenshot Preview</span>
              <button
                onClick={() => setPreviewProofImage(null)}
                className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden max-h-[75vh] flex items-center justify-center bg-black">
              <img src={previewProofImage} alt="Payment Proof Full" className="max-h-[75vh] object-contain" />
            </div>
            <div className="text-right">
              <button
                onClick={() => setPreviewProofImage(null)}
                className="px-4 py-2 rounded-xl btn-3d-amber text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectTxnId && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0B0C10] border-2 border-rose-500/80 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white">Reject Payment Transaction</h3>
            <p className="text-xs text-slate-400">
              Please enter the reason for rejecting this transaction (e.g. UTR mismatch, invalid screenshot).
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Rejection reason..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setRejectTxnId(null)}
                className="flex-1 py-2.5 rounded-xl btn-3d-dark text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejectTxn}
                className="flex-1 py-2.5 rounded-xl btn-3d-dark text-rose-400 border border-rose-500/30 text-xs font-black"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN PREVIEW POPUP SLIDER MODAL */}
      {previewSliderModal && (
        <HomePhotoSliderModal
          isOpen={previewSliderModal}
          onClose={() => setPreviewSliderModal(false)}
          activeView="home"
        />
      )}
    </div>
  );
};
