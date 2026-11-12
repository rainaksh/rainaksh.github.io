export type PlanAmount = '100' | '500' | '1000' | 'none';
export type PlanTier = 'silver' | 'platinum' | 'royal';

export interface PlanConfig {
  id: PlanTier;
  amount: number;
  name: string;
  hindiName: string;
  price: number;
  referralCommission: number;
  badge: string;
  themeStyle: {
    accentColor: string;
    borderColor: string;
    glowShadow: string;
    btn3D: string;
  };
  features: string[];
  recommended?: boolean;
}

export type AvatarFrame = 'none' | 'silver' | 'platinum' | 'golden_crown' | 'cyber_neon' | 'diamond';

export interface UserPrivacySettings {
  isCardPublic?: boolean;
  maskMobile?: boolean;
  maskEmail?: boolean;
  maskEarnings?: boolean;
  maskPhone?: boolean;
  maskAddress?: boolean;
}

export interface UserEarnings {
  totalEarned: number;
  pendingPayout: number;
  withdrawn: number;
}

export interface UserProfile {
  userId: string; // Official Permanent Fixed ID: RNX[Plan][Initials][Seq] (e.g. RNX1000RN01)
  id: string; // alias for userId
  sponsorId: string; // e.g. RNX1000VK01 or RNX1000RN01
  fullName: string;
  name: string; // alias
  email: string;
  mobile: string;
  phone: string; // alias
  password?: string;
  profilePic: string;
  avatarUrl: string; // alias
  avatarFrame: AvatarFrame;
  currentPlan: PlanAmount;
  plan: PlanTier; // alias
  joinDate: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  planStatus: 'active' | 'pending' | 'rejected'; // alias
  privacySettings: UserPrivacySettings;
  privacy: UserPrivacySettings; // alias
  earnings: UserEarnings;
  walletBalance: number; // alias for available withdrawal
  totalEarned: number;
  totalWithdrawn: number;
  upiId: string;
  city?: string;
  state?: string;
  nomineeName?: string;
  nomineeRelation?: string;
  bio?: string;
}

export interface DownlineReferral {
  referralId: string;
  sponsorId: string;
  referredUserId: string;
  referredUserName: string;
  referredUserPhone: string;
  referredUserPic: string;
  planSelected: PlanAmount;
  commissionAmount: number;
  payoutStatus: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export interface Transaction {
  transactionId: string;
  id: string; // alias
  userId: string;
  userName: string;
  userPhone: string;
  sponsorId: string;
  planAmount: number;
  amount: number; // alias
  plan: PlanTier;
  paymentMethod: 'UPI' | 'STRIPE';
  upiTxnRef: string;
  utrNumber: string; // alias
  proofImage?: string;
  proofImageUrl?: string; // alias
  status: 'pending' | 'success' | 'failed' | 'approved' | 'rejected';
  timestamp: string;
  createdAt: string; // alias
  rejectionReason?: string;
  commissionPaid?: boolean;
  commissionAmount?: number;
}

export interface PayoutRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  upiId: string;
  status: 'pending' | 'approved' | 'rejected';
  utrReference?: string;
  requestedAt: string;
  processedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'broadcast' | 'commission' | 'payout' | 'system' | 'welcome';
  targetUserId?: string; // empty means all users
  createdAt: string;
  read?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string; // 'admin' or userId
  senderName: string;
  receiverId: string; // userId or 'admin'
  message: string;
  timestamp: string;
  read: boolean;
}

export interface PopupSlidePhoto {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  linkUrl?: string;
  linkText?: string;
  enabled: boolean;
  createdAt: string;
  order: number;
}

export interface SystemConfig {
  platformName: string;
  upiId: string;
  receiverName: string;
  supportPhone: string;
  supportEmail: string;
  silverPrice: number;
  silverCommission: number;
  platinumPrice: number;
  platinumCommission: number;
  royalPrice: number;
  royalCommission: number;
  announcementTicker: string;
  enableStripe: boolean;
  isMaintenanceMode: boolean;
  popupSlidesEnabled?: boolean;
  popupSlides?: PopupSlidePhoto[];
  popupTargetPages?: string[]; // e.g. ['home', 'plans', 'guide', 'faq', 'dashboard']
}

export interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  action:
    | 'JOIN'
    | 'PLAN_PURCHASE'
    | 'PROFILE_UPDATE'
    | 'PASSWORD_UPDATE'
    | 'AVATAR_UPDATE'
    | 'AVATAR_REMOVE'
    | 'PROOF_UPLOAD'
    | 'PAYOUT_REQUEST'
    | 'CONTACT_FORM';
  description: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  timestamp: string;
  status: 'new' | 'replied' | 'archived';
}
