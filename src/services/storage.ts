import {
  UserProfile,
  Transaction,
  PayoutRequest,
  NotificationItem,
  ChatMessage,
  SystemConfig,
  PlanTier,
  PlanAmount,
  PlanConfig,
  DownlineReferral,
  UserActivity,
  ContactInquiry,
} from '../types';
import { triggerCelebration, triggerMegaCelebration, sounds } from '../utils/audioCelebration';
import { generateTierFormattedId } from '../utils/idGenerator';
import {
  syncUserToFirestore,
  syncTransactionToFirestore,
  syncReferralToFirestore,
  syncPayoutToFirestore,
  syncNotificationToFirestore,
  syncMessageToFirestore,
  subscribeToFirestoreUsers,
  subscribeToFirestoreTransactions,
} from './firebase';

export const ADMIN_PASSWORD_HASH = 'RAINAKSH';

export const DEFAULT_PLANS: Record<PlanTier, PlanConfig> = {
  silver: {
    id: 'silver',
    amount: 100,
    name: 'Normal System (₹100)',
    hindiName: 'नॉर्मल बेसिक सिस्टम',
    price: 100,
    referralCommission: 65,
    badge: '💥 ₹65 INSTANT REWARD',
    themeStyle: {
      accentColor: '#66FCF1',
      borderColor: 'border-emerald-400',
      glowShadow: 'shadow-[0_0_20px_rgba(102,252,241,0.25)]',
      btn3D: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1',
    },
    features: [
      'Minimalist Neon-Border Digital ID Card',
      'Instant ₹65 Cash Reward on every invite',
      'Matte Obsidian Black theme dashboard',
      'Raw photo & locked Unique ID watermark',
      'Direct UPI Payout settled by Vikas Kumar',
      '100% Govt. Consumer Direct Selling Guidelines',
    ],
  },
  platinum: {
    id: 'platinum',
    amount: 500,
    name: 'Platinum System (₹500)',
    hindiName: 'प्लैटिनम शील्ड सिस्टम',
    price: 500,
    referralCommission: 365,
    badge: '🔥 MOST POPULAR (₹365 REWARD)',
    recommended: true,
    themeStyle: {
      accentColor: '#E2E8F0',
      borderColor: 'border-cyan-300',
      glowShadow: 'shadow-[0_0_25px_rgba(56,189,248,0.3)]',
      btn3D: 'bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1',
    },
    features: [
      'Platinum Shield Hologram Digital ID Card',
      'Instant ₹365 Cash Reward on every invite',
      'Custom Analytical Graphs (growth & downline trends)',
      'Advanced Export capabilities (CSV / PDF report)',
      'Brushed Chrome & Silver holographic foil badge',
      'Masked privacy toggles & priority control panel queue',
      'Direct 1-to-1 personal guidance tunnel with Admin',
    ],
  },
  royal: {
    id: 'royal',
    amount: 1000,
    name: 'Royal Crown VIP System (₹1000)',
    hindiName: 'रॉयल क्राउन गोल्ड सिस्टम (बेस्ट)',
    price: 1000,
    referralCommission: 765,
    badge: '👑 BEST VIP SYSTEM (₹765 REWARD)',
    themeStyle: {
      accentColor: '#F59E0B',
      borderColor: 'border-amber-400',
      glowShadow: 'shadow-[0_0_30px_rgba(245,158,11,0.4)]',
      btn3D: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 border-b-4 border-amber-700 active:border-b-0 active:translate-y-1',
    },
    features: [
      'Liquid Gold 3D Digital ID Card with Crown Seal',
      'Maximum ₹765 Instant Cash Reward per invite',
      'High-prestige Avatar Frame with 3D Crown Badge',
      'Golden Nameplate Profile Design & exclusive badges',
      'Live Scrolling Earnings Ticker & VIP Analytics',
      'Automated Payout priority directly to your UPI',
      'Lifetime validity certificate & 24/7 VIP chat',
    ],
  },
};

export const DEFAULT_CONFIG: SystemConfig = {
  platformName: 'RainAksh Network',
  upiId: '8877490845@spicepay',
  receiverName: 'Vikas Kumar',
  supportPhone: '+91 8877490845',
  supportEmail: 'accaiwork@gmail.com',
  silverPrice: 100,
  silverCommission: 65,
  platinumPrice: 500,
  platinumCommission: 365,
  royalPrice: 1000,
  royalCommission: 765,
  announcementTicker: '⚡ RainAksh Network (Govt. Direct Selling 2021 Compliant) • क्या है? भारत का अग्रणी 3-सिस्टम डिजिटल पहचान पत्र व एफिलिएट रेवेन्यू शेयरिंग प्लैटफॉर्म • कितने सिस्टम हैं? 3 सिस्टम्स (₹100 नॉर्मल, ₹500 प्लैटिनम शील्ड, ₹1000 रॉयल VIP) • क्या मिलेगा? सरकार-मान्य डिजिटल आईडी कार्ड, QR सत्यापन, प्राइवेसी प्रोटेक्शन व 1-ऑन-1 पर्सनल सपोर्ट • कितना मिलेगा? ₹100 पर ₹65 (65%), ₹500 पर ₹365 (73%), ₹1000 पर ₹765 (76.5%) डायरेक्ट कमीशन • कब मिलेगा? 10-30 मिनट में सत्यापन के बाद सीधा आपके बैंक UPI पर • अधिकृत भुगतान UPI: 8877490845@spicepay (विकास कुमार) • 0% कटौती • Telegram: @rainaksh • Email: accaiwork@gmail.com',
  enableStripe: true,
  isMaintenanceMode: false,
};

// Seed Users per blueprint: Only Founder Admin Vikas Kumar, no dummy/demo users
const SEED_USERS: UserProfile[] = [
  {
    userId: 'RX_MAIN_001',
    id: 'RX_MAIN_001',
    sponsorId: 'RX_SYSTEM',
    fullName: 'Vikas Kumar',
    name: 'Vikas Kumar',
    email: 'accaiwork@gmail.com',
    mobile: '8877490845',
    phone: '8877490845',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    avatarFrame: 'golden_crown',
    currentPlan: '1000',
    plan: 'royal',
    joinDate: '2026-01-01',
    verificationStatus: 'verified',
    planStatus: 'active',
    privacySettings: {
      isCardPublic: true,
      maskMobile: true,
      maskEmail: true,
      maskEarnings: false,
    },
    privacy: {
      isCardPublic: true,
      maskPhone: true,
      maskEmail: true,
      maskAddress: false,
    },
    earnings: {
      totalEarned: 0,
      pendingPayout: 0,
      withdrawn: 0,
    },
    walletBalance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    upiId: '8877490845@spicepay',
    city: 'Patna',
    state: 'Bihar',
    nomineeName: 'Priya Kumari',
    nomineeRelation: 'Spouse',
    bio: 'Founder & National Architect of RainAksh Network.',
  },
];

const SEED_TRANSACTIONS: Transaction[] = [];

const SEED_REFERRALS: DownlineReferral[] = [];

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '👑 Welcome to RainAksh Network',
    message: 'Aapka official account aur Digital ID Card portal active hai. Refer karein aur instant UPI par 76.5% tak commission kamayein!',
    type: 'broadcast',
    createdAt: '2026-03-01 10:00 AM',
  },
];

const SEED_MESSAGES: ChatMessage[] = [];

const SEED_ACTIVITIES: UserActivity[] = [
  {
    id: 'act-seed-1',
    userId: 'RX_MAIN_001',
    userName: 'Vikas Kumar',
    userPhone: '8877490845',
    action: 'JOIN',
    description: 'System Founder Vikas Kumar established the RainAksh Network Master Account with Royal Crown VIP System (₹1000).',
    details: {
      system: 'royal',
      planAmount: 1000,
      upiId: '8877490845@spicepay',
      role: 'Master Admin & National Architect',
    },
    timestamp: '01/01/2026, 10:00:00 AM',
  },
];

const SEED_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq-seed-1',
    name: 'Rohan Sharma',
    phone: '9876543210',
    message: 'Namaste Vikas Kumar ji! Mujhe Royal Crown VIP System join karna hai aur team build karni hai.',
    timestamp: '05/03/2026, 02:30:00 PM',
    status: 'new',
  },
];

export function generateUserId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const char = chars.charAt(Math.floor(Math.random() * chars.length));
  const num = Math.floor(1000 + Math.random() * 9000);
  return `RX_2026_${num}${char}`;
}

export function generateTxnId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `TXN_${num}`;
}

const STORAGE_KEYS = {
  USERS: 'rainaksh_users_v4',
  CURRENT_USER: 'rainaksh_curr_user_v4',
  TRANSACTIONS: 'rainaksh_txns_v4',
  REFERRALS: 'rainaksh_referrals_v4',
  PAYOUTS: 'rainaksh_payouts_v4',
  NOTIFICATIONS: 'rainaksh_notifs_v4',
  MESSAGES: 'rainaksh_messages_v4',
  ACTIVITIES: 'rainaksh_activities_v4',
  INQUIRIES: 'rainaksh_inquiries_v4',
  CONFIG: 'rainaksh_config_v4',
};

class StorageService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    try {
      ['v1', 'v2', 'v3'].forEach((v) => {
        ['users', 'curr_user', 'txns', 'referrals', 'payouts', 'notifs', 'messages', 'config'].forEach((k) => {
          localStorage.removeItem(`rainaksh_${k}_${v}`);
        });
      });
    } catch {
      // ignore
    }
    this.init();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', () => this.notify());
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('Storage notify error:', e);
      }
    });
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REFERRALS)) {
      localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(SEED_REFERRALS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(SEED_MESSAGES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(SEED_INQUIRIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYOUTS)) {
      localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
    }

    // Subscribe to Firestore cloud updates for multi-device sync
    subscribeToFirestoreUsers((cloudUsers) => {
      const localUsers = this.getUsers();
      let changed = false;
      cloudUsers.forEach((cu) => {
        const idx = localUsers.findIndex((u) => u.userId === cu.userId || u.id === cu.id);
        if (idx >= 0) {
          localUsers[idx] = { ...localUsers[idx], ...cu };
          changed = true;
        } else {
          localUsers.push(cu);
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(localUsers));
        this.notify();
      }
    });

    subscribeToFirestoreTransactions((cloudTxns) => {
      const localTxns = this.getTransactions();
      let changed = false;
      cloudTxns.forEach((ct) => {
        const idx = localTxns.findIndex((t) => t.id === ct.id || t.transactionId === ct.transactionId);
        if (idx >= 0) {
          localTxns[idx] = { ...localTxns[idx], ...ct };
          changed = true;
        } else {
          localTxns.unshift(ct);
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(localTxns));
        this.notify();
      }
    });
  }

  // Config
  public getConfig(): SystemConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) return DEFAULT_CONFIG;
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  public updateConfig(newConfig: Partial<SystemConfig>) {
    const current = this.getConfig();
    const updated = { ...current, ...newConfig };
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
    this.notify();
    return updated;
  }

  // Users
  public getUsers(): UserProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) return SEED_USERS;
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_USERS;
    }
  }

  public getUserById(id: string): UserProfile | undefined {
    const clean = id.trim().toLowerCase();
    return this.getUsers().find(
      (u) => (u.userId && u.userId.toLowerCase() === clean) || (u.id && u.id.toLowerCase() === clean)
    );
  }

  public getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      const fresh = this.getUserById(parsed.userId || parsed.id);
      return fresh || parsed;
    } catch {
      return null;
    }
  }

  public setCurrentUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    this.notify();
  }

  public saveUser(user: UserProfile): UserProfile {
    // Keep aliases synced
    const normalized: UserProfile = {
      ...user,
      id: user.userId || user.id,
      userId: user.userId || user.id,
      name: user.fullName || user.name,
      fullName: user.fullName || user.name,
      phone: user.mobile || user.phone,
      mobile: user.mobile || user.phone,
      avatarUrl: user.profilePic || user.avatarUrl,
      profilePic: user.profilePic || user.avatarUrl,
      plan: user.currentPlan === '1000' ? 'royal' : user.currentPlan === '500' ? 'platinum' : 'silver',
      planStatus: user.verificationStatus === 'verified' ? 'active' : user.verificationStatus,
      privacy: {
        isCardPublic: user.privacySettings?.isCardPublic ?? true,
        maskPhone: user.privacySettings?.maskMobile ?? true,
        maskEmail: user.privacySettings?.maskEmail ?? true,
        maskAddress: false,
      },
      walletBalance: user.earnings?.totalEarned ? user.earnings.totalEarned - (user.earnings.withdrawn || 0) : user.walletBalance || 0,
      totalEarned: user.earnings?.totalEarned || user.totalEarned || 0,
      totalWithdrawn: user.earnings?.withdrawn || user.totalWithdrawn || 0,
    };

    const users = this.getUsers();
    const index = users.findIndex((u) => u.userId === normalized.userId || u.id === normalized.id);
    const existing = index >= 0 ? users[index] : null;

    if (index >= 0) {
      users[index] = normalized;
    } else {
      users.push(normalized);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const current = this.getCurrentUser();
    if (current && (current.userId === normalized.userId || current.id === normalized.id)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(normalized));
    }
    this.notify();
    // Cloud sync for multi-device support
    syncUserToFirestore(normalized);

    // Audit Log recording
    if (!existing) {
      this.logActivity({
        userId: normalized.userId,
        userName: normalized.fullName,
        userPhone: normalized.mobile,
        action: 'JOIN',
        description: `Member joined & submitted registration form: ${normalized.fullName} (${normalized.userId}) in System ₹${normalized.currentPlan || '100'}.`,
        details: {
          sponsorId: normalized.sponsorId,
          plan: normalized.currentPlan,
          city: normalized.city,
          state: normalized.state,
          upiId: normalized.upiId,
          nominee: normalized.nomineeName,
          password: normalized.password,
        },
      });
    } else {
      if (normalized.password && existing.password && normalized.password !== existing.password) {
        this.logActivity({
          userId: normalized.userId,
          userName: normalized.fullName,
          userPhone: normalized.mobile,
          action: 'PASSWORD_UPDATE',
          description: `Password updated for ${normalized.fullName} (${normalized.userId}).`,
          details: {
            oldPassword: existing.password,
            newPassword: normalized.password,
          },
        });
      }
      if (normalized.profilePic !== existing.profilePic) {
        this.logActivity({
          userId: normalized.userId,
          userName: normalized.fullName,
          userPhone: normalized.mobile,
          action: normalized.profilePic ? 'AVATAR_UPDATE' : 'AVATAR_REMOVE',
          description: normalized.profilePic
            ? `Profile picture uploaded/changed by ${normalized.fullName}.`
            : `Profile picture removed by ${normalized.fullName}.`,
          details: {
            avatar: normalized.profilePic || 'Default avatar',
          },
        });
      }
      if (
        normalized.fullName !== existing.fullName ||
        normalized.mobile !== existing.mobile ||
        normalized.email !== existing.email ||
        normalized.upiId !== existing.upiId ||
        normalized.city !== existing.city ||
        normalized.state !== existing.state ||
        normalized.nomineeName !== existing.nomineeName
      ) {
        this.logActivity({
          userId: normalized.userId,
          userName: normalized.fullName,
          userPhone: normalized.mobile,
          action: 'PROFILE_UPDATE',
          description: `Profile information updated by ${normalized.fullName} (${normalized.userId}).`,
          details: {
            name: normalized.fullName,
            phone: normalized.mobile,
            email: normalized.email,
            upiId: normalized.upiId,
            city: normalized.city,
            state: normalized.state,
            nominee: normalized.nomineeName,
          },
        });
      }
    }

    return normalized;
  }

  // Transactions
  public getTransactions(): Transaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) return SEED_TRANSACTIONS;
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_TRANSACTIONS;
    }
  }

  public addTransaction(txn: Transaction): Transaction {
    const txns = this.getTransactions();
    txns.unshift(txn);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
    this.notify();
    // Cloud sync for multi-device support
    syncTransactionToFirestore(txn);

    this.logActivity({
      userId: txn.userId,
      userName: txn.userName,
      userPhone: txn.userPhone,
      action: 'PLAN_PURCHASE',
      description: `Payment Form Response submitted for System ${txn.plan} (₹${txn.planAmount}). UTR: ${txn.upiTxnRef || 'N/A'}${txn.proofImage ? ' (Payment screenshot uploaded)' : ''}.`,
      details: {
        txnId: txn.transactionId,
        amount: txn.planAmount,
        paymentMethod: txn.paymentMethod,
        utr: txn.upiTxnRef,
        hasProof: Boolean(txn.proofImage),
      },
    });

    return txn;
  }

  // Referrals
  public getReferrals(): DownlineReferral[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REFERRALS);
    if (!raw) return SEED_REFERRALS;
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_REFERRALS;
    }
  }

  public approveTransaction(txnId: string, reviewedByAdmin: string = 'Vikas Kumar'): boolean {
    const txns = this.getTransactions();
    const txn = txns.find((t) => t.id === txnId || t.transactionId === txnId);
    if (!txn || txn.status === 'approved' || txn.status === 'success') return false;

    txn.status = 'approved';

    // 1. Activate buyer's plan & card
    const user = this.getUserById(txn.userId);
    if (user) {
      user.verificationStatus = 'verified';
      user.planStatus = 'active';
      user.currentPlan = txn.planAmount.toString() as PlanAmount;
      user.plan = txn.plan;
      user.avatarFrame = txn.plan === 'royal' ? 'golden_crown' : txn.plan === 'platinum' ? 'platinum' : 'silver';

      // Assign official tier-encoded unique ID (RX_2026_XXXXX) upon approval
      if (user.userId !== 'RX_MAIN_001') {
        const approvedTierId = generateTierFormattedId(txn.plan);
        const prevId = user.userId;
        user.userId = approvedTierId;
        user.id = approvedTierId;
        txn.userId = approvedTierId;

        // Update referrals target reference
        const allReferrals = this.getReferrals();
        allReferrals.forEach((r) => {
          if (r.referredUserId === prevId) {
            r.referredUserId = approvedTierId;
          }
        });
        localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(allReferrals));
      }

      this.saveUser(user);

      this.addNotification({
        id: `notif-${Date.now()}`,
        title: '🎉 Payment Verified - Account Active!',
        message: `Aapka ₹${txn.planAmount} Plan approve ho gaya hai. Aapka official ID (${user.userId}) aur Digital ID Card unlock ho chuka hai!`,
        type: 'welcome',
        targetUserId: user.userId,
        createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      });
    }

    // 2. Auto-credit Sponsor
    const config = this.getConfig();
    let commission = config.silverCommission;
    if (txn.planAmount === 500 || txn.plan === 'platinum') commission = config.platinumCommission;
    if (txn.planAmount === 1000 || txn.plan === 'royal') commission = config.royalCommission;

    txn.commissionPaid = true;
    txn.commissionAmount = commission;

    if (txn.sponsorId && txn.sponsorId !== 'RX_SYSTEM' && txn.sponsorId !== 'NONE') {
      const sponsor = this.getUserById(txn.sponsorId);
      if (sponsor) {
        if (!sponsor.earnings) {
          sponsor.earnings = { totalEarned: 0, pendingPayout: 0, withdrawn: 0 };
        }
        sponsor.earnings.totalEarned = (sponsor.earnings.totalEarned || 0) + commission;
        sponsor.walletBalance = (sponsor.walletBalance || 0) + commission;
        sponsor.totalEarned = (sponsor.totalEarned || 0) + commission;
        this.saveUser(sponsor);

        // Record referral row
        const referrals = this.getReferrals();
        referrals.unshift({
          referralId: `REF_${Math.floor(10000 + Math.random() * 90000)}`,
          sponsorId: sponsor.userId,
          referredUserId: txn.userId,
          referredUserName: txn.userName,
          referredUserPhone: txn.userPhone,
          referredUserPic: user?.profilePic || '',
          planSelected: txn.planAmount.toString() as PlanAmount,
          commissionAmount: commission,
          payoutStatus: 'approved',
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        });
        localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));

        // Push alert to sponsor
        this.addNotification({
          id: `notif-${Date.now() + 1}`,
          title: `💰 Instant Commission: ₹${commission} Credited!`,
          message: `Badhai ho! Aapke referral ${txn.userName} ke ₹${txn.planAmount} plan join karne par ₹${commission} aapke wallet me add ho gaye hain.`,
          type: 'commission',
          targetUserId: sponsor.userId,
          createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        });
      }
    }

    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
    this.notify();
    triggerMegaCelebration();
    return true;
  }

  public rejectTransaction(txnId: string, reason: string): boolean {
    const txns = this.getTransactions();
    const txn = txns.find((t) => t.id === txnId || t.transactionId === txnId);
    if (!txn) return false;

    txn.status = 'rejected';
    txn.rejectionReason = reason;

    const user = this.getUserById(txn.userId);
    if (user) {
      user.verificationStatus = 'rejected';
      user.planStatus = 'rejected';
      this.saveUser(user);

      this.addNotification({
        id: `notif-${Date.now()}`,
        title: '❌ Verification Rejected',
        message: `Aapka UTR (${txn.upiTxnRef || txn.utrNumber}) verify nahi ho saka. Karan: ${reason}. Kripya sahi screenshot & UTR re-submit karein.`,
        type: 'system',
        targetUserId: user.userId,
        createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      });
    }

    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
    this.notify();
    return true;
  }

  // Payouts
  public getPayouts(): PayoutRequest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYOUTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public requestPayout(userId: string, amount: number, upiId: string): { success: boolean; message: string } {
    const user = this.getUserById(userId);
    if (!user) return { success: false, message: 'User not found' };
    if (amount <= 0 || (user.walletBalance || 0) < amount) {
      return { success: false, message: 'Insufficient wallet balance' };
    }

    user.walletBalance -= amount;
    if (user.earnings) {
      user.earnings.pendingPayout = (user.earnings.pendingPayout || 0) + amount;
    }
    this.saveUser(user);

    const payout: PayoutRequest = {
      id: `PAY-${Date.now()}`,
      userId: user.userId,
      userName: user.fullName,
      amount,
      upiId,
      status: 'pending',
      requestedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    const payouts = this.getPayouts();
    payouts.unshift(payout);
    localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(payouts));

    // Cloud sync for multi-device support
    syncPayoutToFirestore(payout);

    this.addNotification({
      id: `notif-${Date.now()}`,
      title: `⏳ Payout Request Submitted: ₹${amount}`,
      message: `Aapka ₹${amount} withdrawal request receive ho gaya hai. Admin Vikas Kumar jald hi ${upiId} par transfer kar denge.`,
      type: 'payout',
      targetUserId: user.userId,
      createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    });

    this.notify();
    triggerCelebration();
    return { success: true, message: 'Payout request placed successfully' };
  }

  public approvePayout(payoutId: string, utrReference: string): boolean {
    const payouts = this.getPayouts();
    const item = payouts.find((p) => p.id === payoutId);
    if (!item || item.status === 'approved') return false;

    item.status = 'approved';
    item.utrReference = utrReference;
    item.processedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const user = this.getUserById(item.userId);
    if (user) {
      user.totalWithdrawn = (user.totalWithdrawn || 0) + item.amount;
      if (user.earnings) {
        user.earnings.withdrawn = (user.earnings.withdrawn || 0) + item.amount;
        user.earnings.pendingPayout = Math.max(0, (user.earnings.pendingPayout || 0) - item.amount);
      }
      this.saveUser(user);

      this.addNotification({
        id: `notif-${Date.now()}`,
        title: `🎉 Payout Transferred: ₹${item.amount}`,
        message: `Mubarak ho! ₹${item.amount} aapke UPI (${item.upiId}) par transfer kar diya gaya hai. Bank UTR / Ref No: ${utrReference}.`,
        type: 'payout',
        targetUserId: user.userId,
        createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      });
    }

    localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(payouts));
    this.notify();
    triggerMegaCelebration();
    return true;
  }

  public rejectPayout(payoutId: string, reason: string): boolean {
    const payouts = this.getPayouts();
    const item = payouts.find((p) => p.id === payoutId);
    if (!item) return false;

    item.status = 'rejected';
    item.processedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const user = this.getUserById(item.userId);
    if (user) {
      user.walletBalance = (user.walletBalance || 0) + item.amount;
      if (user.earnings) {
        user.earnings.pendingPayout = Math.max(0, (user.earnings.pendingPayout || 0) - item.amount);
      }
      this.saveUser(user);

      this.addNotification({
        id: `notif-${Date.now()}`,
        title: '❌ Payout Request Rejected',
        message: `₹${item.amount} ka payout cancel hua (Karan: ${reason}). Balance aapke wallet me wapas credit ho gaya hai.`,
        type: 'payout',
        targetUserId: user.userId,
        createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      });
    }

    localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(payouts));
    this.notify();
    return true;
  }

  // Notifications
  public getNotifications(userId?: string): NotificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    let items: NotificationItem[] = [];
    if (raw) {
      try {
        items = JSON.parse(raw);
      } catch {
        items = SEED_NOTIFICATIONS;
      }
    } else {
      items = SEED_NOTIFICATIONS;
    }
    if (!userId) return items;
    return items.filter((n) => !n.targetUserId || n.targetUserId === userId);
  }

  public addNotification(item: NotificationItem) {
    const items = this.getNotifications();
    items.unshift(item);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(items));
    this.notify();
    // Cloud sync for multi-device support
    syncNotificationToFirestore(item);
  }

  public sendBroadcastNotification(title: string, message: string) {
    const notif: NotificationItem = {
      id: `bc-${Date.now()}`,
      title,
      message,
      type: 'broadcast',
      createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };
    this.addNotification(notif);
    triggerCelebration();
  }

  // Chat
  public getMessages(): ChatMessage[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!raw) return SEED_MESSAGES;
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_MESSAGES;
    }
  }

  public getConversationWithUser(userId: string): ChatMessage[] {
    const all = this.getMessages();
    return all.filter(
      (m) =>
        (m.senderId === userId && m.receiverId === 'admin') ||
        (m.senderId === 'admin' && m.receiverId === userId)
    );
  }

  public sendMessage(msg: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>): ChatMessage {
    const all = this.getMessages();
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    all.push(newMsg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));
    this.notify();
    sounds.playClick();
    // Cloud sync for multi-device support
    syncMessageToFirestore(newMsg);
    return newMsg;
  }

  // Downlines
  public getDownlines(sponsorId: string): UserProfile[] {
    const users = this.getUsers();
    return users.filter((u) => u.sponsorId.toLowerCase() === sponsorId.toLowerCase());
  }

  // User Activities & Audit Logs
  public getActivities(): UserActivity[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) return SEED_ACTIVITIES;
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_ACTIVITIES;
    }
  }

  public logActivity(act: Omit<UserActivity, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): UserActivity {
    const activities = this.getActivities();
    const newAct: UserActivity = {
      ...act,
      id: act.id || `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: act.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };
    activities.unshift(newAct);
    // Keep max 200 logs
    const trimmed = activities.slice(0, 200);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(trimmed));
    this.notify();
    return newAct;
  }

  public clearActivities(): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify([]));
    this.notify();
  }

  // Contact Inquiries (Helpdesk Messages)
  public getInquiries(): ContactInquiry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (!raw) return SEED_INQUIRIES;
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_INQUIRIES;
    }
  }

  public addInquiry(inq: Omit<ContactInquiry, 'id' | 'timestamp' | 'status'>): ContactInquiry {
    const inquiries = this.getInquiries();
    const newInq: ContactInquiry = {
      ...inq,
      id: `inq-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      status: 'new',
    };
    inquiries.unshift(newInq);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    this.logActivity({
      userId: inq.phone,
      userName: inq.name,
      userPhone: inq.phone,
      action: 'CONTACT_FORM',
      description: `Help Desk message received from ${inq.name} (${inq.phone}): "${inq.message.slice(0, 60)}..."`,
      details: { message: inq.message },
    });
    this.notify();
    return newInq;
  }

  public updateInquiryStatus(id: string, status: 'new' | 'replied' | 'archived') {
    const inquiries = this.getInquiries();
    const target = inquiries.find((i) => i.id === id);
    if (target) {
      target.status = status;
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
      this.notify();
    }
  }

  // Delete User from Control Panel
  public deleteUser(userId: string): boolean {
    const users = this.getUsers().filter((u) => u.userId !== userId && u.id !== userId);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.logActivity({
      userId: userId,
      userName: 'Deleted User',
      action: 'PROFILE_UPDATE',
      description: `Member ${userId} was removed from the database by Control Panel Administrator.`,
    });
    this.notify();
    return true;
  }

  // Delete Transaction from Control Panel
  public deleteTransaction(txnId: string): boolean {
    const txns = this.getTransactions().filter((t) => t.id !== txnId && t.transactionId !== txnId);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
    this.notify();
    return true;
  }

  public resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(SEED_REFERRALS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(SEED_MESSAGES));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(SEED_INQUIRIES));
    localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
    this.notify();
    triggerCelebration();
  }
}

export const storage = new StorageService();
