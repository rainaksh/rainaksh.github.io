import React, { useState, useMemo } from 'react';
import {
  Users,
  ChevronDown,
  ChevronRight,
  Search,
  Sparkles,
  Crown,
  Shield,
  Award,
  Layers,
  Share2,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  TrendingUp,
  DollarSign,
  UserCheck,
  Eye,
  X,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { UserProfile } from '../types';
import { storage } from '../services/storage';
import { sounds } from '../utils/audioCelebration';

interface TreeNodeData {
  user: UserProfile;
  level: number;
  children: TreeNodeData[];
  commissionFromNode: number;
}

interface DownlineNetworkTreeProps {
  currentUser: UserProfile;
  onOpenJoinModal?: (plan?: 'silver' | 'platinum' | 'royal') => void;
  onShareWhatsApp?: () => void;
}

// Helper to construct fully compliant sample UserProfile objects
const createSampleUser = (
  base: {
    userId: string;
    fullName: string;
    sponsorId: string;
    currentPlan: '100' | '500' | '1000';
    plan: 'silver' | 'platinum' | 'royal';
    avatarFrame: 'silver' | 'platinum' | 'golden_crown';
    profilePic: string;
    joinDate: string;
    mobile: string;
    email?: string;
  }
): UserProfile => ({
  userId: base.userId,
  id: base.userId,
  fullName: base.fullName,
  name: base.fullName,
  phone: base.mobile,
  mobile: base.mobile,
  email: base.email || `${base.userId.toLowerCase()}@example.com`,
  profilePic: base.profilePic,
  avatarUrl: base.profilePic,
  avatarFrame: base.avatarFrame,
  currentPlan: base.currentPlan,
  plan: base.plan,
  sponsorId: base.sponsorId,
  joinDate: base.joinDate,
  verificationStatus: 'verified',
  planStatus: 'active',
  privacySettings: { isCardPublic: true, maskMobile: true, maskEmail: true },
  privacy: { isCardPublic: true, maskMobile: true, maskEmail: true },
  earnings: { totalEarned: 0, pendingPayout: 0, withdrawn: 0 },
  walletBalance: 0,
  totalEarned: 0,
  totalWithdrawn: 0,
  upiId: `${base.mobile}@upi`,
});

// Sample demo network to demonstrate visual tree growth when user is new or tests preview
const SAMPLE_GROWTH_TREE_USERS: UserProfile[] = [
  createSampleUser({
    userId: 'RNX1000RN01',
    sponsorId: 'CURRENT_USER',
    fullName: 'RainAksh Nityam',
    email: 'nityam@rainaksh.network',
    mobile: '9876543210',
    profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'golden_crown',
    currentPlan: '1000',
    plan: 'royal',
    joinDate: '2026-03-01',
  }),
  createSampleUser({
    userId: 'RNX500PV01',
    sponsorId: 'CURRENT_USER',
    fullName: 'Pooja Verma',
    email: 'pooja.v@example.com',
    mobile: '9822334455',
    profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'platinum',
    currentPlan: '500',
    plan: 'platinum',
    joinDate: '2026-03-02',
  }),
  createSampleUser({
    userId: 'RNX100AP01',
    sponsorId: 'CURRENT_USER',
    fullName: 'Amit Patel',
    email: 'amit.p@example.com',
    mobile: '9811223344',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'silver',
    currentPlan: '100',
    plan: 'silver',
    joinDate: '2026-03-03',
  }),
  // Level 2 under RainAksh Nityam
  createSampleUser({
    userId: 'RNX500DY02',
    sponsorId: 'RNX1000RN01',
    fullName: 'Deepak Yadav',
    email: 'deepak.y@example.com',
    mobile: '9711223344',
    profilePic: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'platinum',
    currentPlan: '500',
    plan: 'platinum',
    joinDate: '2026-03-04',
  }),
  createSampleUser({
    userId: 'RNX100NG02',
    sponsorId: 'RNX1000RN01',
    fullName: 'Neha Gupta',
    email: 'neha.g@example.com',
    mobile: '9611223344',
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'silver',
    currentPlan: '100',
    plan: 'silver',
    joinDate: '2026-03-05',
  }),
  // Level 2 under Pooja Verma
  createSampleUser({
    userId: 'RNX1000AS02',
    sponsorId: 'RNX500PV01',
    fullName: 'Anjali Singh',
    email: 'anjali.s@example.com',
    mobile: '9511223344',
    profilePic: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'golden_crown',
    currentPlan: '1000',
    plan: 'royal',
    joinDate: '2026-03-06',
  }),
  // Level 3 under Deepak Yadav
  createSampleUser({
    userId: 'RNX100SM03',
    sponsorId: 'RNX500DY02',
    fullName: 'Suresh Maurya',
    email: 'suresh.m@example.com',
    mobile: '9411223344',
    profilePic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    avatarFrame: 'silver',
    currentPlan: '100',
    plan: 'silver',
    joinDate: '2026-03-07',
  }),
];

export const DownlineNetworkTree: React.FC<DownlineNetworkTreeProps> = ({
  currentUser,
  onShareWhatsApp,
}) => {
  const [useSamplePreview, setUseSamplePreview] = useState<boolean>(false);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [planFilter, setPlanFilter] = useState<'all' | 'royal' | 'platinum' | 'silver'>('all');
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const myId = currentUser.userId || currentUser.id;

  // Real users from storage
  const realUsers = storage.getUsers();
  const realDirects = storage.getDownlines(myId);

  // If user has zero direct referrals, default sample preview to true so they can interact immediately
  const hasZeroDirects = realDirects.length === 0;
  const isPreviewActive = useSamplePreview || hasZeroDirects;

  // Active pool of users
  const activeUserPool = useMemo(() => {
    if (isPreviewActive) {
      const sampleMapped = SAMPLE_GROWTH_TREE_USERS.map((u) => ({
        ...u,
        sponsorId: u.sponsorId === 'CURRENT_USER' ? myId : u.sponsorId,
      }));
      return [currentUser, ...sampleMapped];
    }
    return realUsers;
  }, [isPreviewActive, myId, currentUser, realUsers]);

  // Build recursive tree structure starting from currentUser
  const rootTree = useMemo<TreeNodeData>(() => {
    const buildSubtree = (parentId: string, currentLevel: number): TreeNodeData[] => {
      const children = activeUserPool.filter(
        (u) =>
          u.sponsorId &&
          u.sponsorId.toLowerCase() === parentId.toLowerCase() &&
          (u.userId !== parentId && u.id !== parentId)
      );

      return children.map((child) => {
        const childId = child.userId || child.id;
        const commission =
          child.currentPlan === '1000' || child.plan === 'royal'
            ? 765
            : child.currentPlan === '500' || child.plan === 'platinum'
            ? 365
            : 65;

        return {
          user: child,
          level: currentLevel,
          commissionFromNode: commission,
          children: buildSubtree(childId, currentLevel + 1),
        };
      });
    };

    return {
      user: currentUser,
      level: 0,
      commissionFromNode: 0,
      children: buildSubtree(myId, 1),
    };
  }, [activeUserPool, currentUser, myId]);

  // Calculate network metrics
  const metrics = useMemo(() => {
    let totalNodes = 0;
    let level1Count = 0;
    let level2PlusCount = 0;
    let totalCommissionGenerated = 0;
    let maxDepth = 0;

    const traverse = (node: TreeNodeData) => {
      if (node.level > 0) {
        totalNodes += 1;
        totalCommissionGenerated += node.commissionFromNode;
        if (node.level === 1) level1Count += 1;
        else level2PlusCount += 1;
        if (node.level > maxDepth) maxDepth = node.level;
      }
      node.children.forEach(traverse);
    };

    traverse(rootTree);

    return {
      totalNodes,
      level1Count,
      level2PlusCount,
      totalCommissionGenerated,
      maxDepth,
    };
  }, [rootTree]);

  // Toggle node expansion
  const toggleNode = (nodeId: string) => {
    sounds.playClick();
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Expand / Collapse all
  const expandAll = () => {
    sounds.playClick();
    setCollapsedNodes(new Set());
  };

  const collapseAll = () => {
    sounds.playClick();
    const allIds = new Set<string>();
    const collect = (node: TreeNodeData) => {
      allIds.add(node.user.userId || node.user.id);
      node.children.forEach(collect);
    };
    collect(rootTree);
    setCollapsedNodes(allIds);
  };

  const handleCopy = (text: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Plan styling helper
  const getPlanBadge = (u: UserProfile) => {
    const plan = u.currentPlan === '1000' || u.plan === 'royal' ? 'royal' : u.currentPlan === '500' || u.plan === 'platinum' ? 'platinum' : 'silver';
    if (plan === 'royal') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]">
          <Crown className="w-2.5 h-2.5" />
          <span>₹1000 Royal</span>
        </span>
      );
    }
    if (plan === 'platinum') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(56,189,248,0.25)]">
          <Shield className="w-2.5 h-2.5" />
          <span>₹500 Platinum</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
        <Award className="w-2.5 h-2.5" />
        <span>₹100 Normal</span>
      </span>
    );
  };

  // Check if a node matches search or plan filter
  const isNodeMatching = (node: TreeNodeData): boolean => {
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = !q || (node.user.fullName || node.user.name || '').toLowerCase().includes(q) || (node.user.userId || '').toLowerCase().includes(q);
    const plan = node.user.currentPlan === '1000' || node.user.plan === 'royal' ? 'royal' : node.user.currentPlan === '500' || node.user.plan === 'platinum' ? 'platinum' : 'silver';
    const planMatch = planFilter === 'all' || plan === planFilter;
    return nameMatch && planMatch;
  };

  // Render individual tree branch recursively
  const renderTreeNode = (node: TreeNodeData, isLastChild: boolean = false, parentCollapsed: boolean = false): React.ReactNode => {
    if (parentCollapsed) return null;

    const nodeId = node.user.userId || node.user.id;
    const isRoot = node.level === 0;
    const isCollapsed = collapsedNodes.has(nodeId);
    const hasChildren = node.children.length > 0;
    const matchesSearch = searchQuery.trim() !== '' && isNodeMatching(node);

    // Plan styling
    const plan = node.user.currentPlan === '1000' || node.user.plan === 'royal' ? 'royal' : node.user.currentPlan === '500' || node.user.plan === 'platinum' ? 'platinum' : 'silver';
    const ringColor = isRoot
      ? 'ring-2 ring-amber-400'
      : plan === 'royal'
      ? 'ring-2 ring-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
      : plan === 'platinum'
      ? 'ring-2 ring-cyan-400/80 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
      : 'ring-1 ring-emerald-400/60';

    return (
      <div key={nodeId} className="relative flex flex-col items-center">
        {/* Node Card */}
        <div
          className={`relative z-10 transition-all duration-200 group ${
            matchesSearch ? 'scale-105' : ''
          }`}
        >
          <div
            className={`flex flex-col p-3 rounded-2xl border text-left min-w-[210px] max-w-[240px] cursor-pointer transition-all ${
              isRoot
                ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/60 shadow-lg shadow-amber-500/10'
                : matchesSearch
                ? 'bg-slate-900 border-amber-400 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400 animate-pulse'
                : 'bg-slate-950/90 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md'
            }`}
            onClick={() => {
              sounds.playClick();
              setSelectedMember(node.user);
            }}
          >
            {/* Header: Level Pill & Children count */}
            <div className="flex items-center justify-between gap-1 mb-2">
              <span
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md font-mono ${
                  isRoot
                    ? 'bg-amber-400 text-slate-950'
                    : node.level === 1
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isRoot ? '★ YOU (ROOT)' : `Level ${node.level} Direct`}
              </span>

              {hasChildren && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNode(nodeId);
                  }}
                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
                    isCollapsed
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title={isCollapsed ? 'Click to expand' : 'Click to collapse'}
                >
                  {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  <span>{node.children.length} Team</span>
                </button>
              )}
            </div>

            {/* Member Info Row */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={
                    node.user.profilePic ||
                    node.user.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={node.user.fullName || node.user.name}
                  className={`w-10 h-10 rounded-full object-cover bg-slate-800 ${ringColor}`}
                />
                {plan === 'royal' && (
                  <Crown className="w-3.5 h-3.5 text-amber-400 absolute -top-1.5 -right-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white truncate flex items-center gap-1">
                  <span>{node.user.fullName || node.user.name}</span>
                  {node.user.verificationStatus === 'verified' && (
                    <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  )}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-mono text-slate-400 truncate font-semibold">
                    {nodeId}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(nodeId);
                    }}
                    className="text-slate-500 hover:text-amber-400 transition"
                    title="Copy User ID"
                  >
                    {copiedId === nodeId ? (
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-2.5 h-2.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Row: Plan Badge & Direct Commission */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <div>{getPlanBadge(node.user)}</div>

              {!isRoot && (
                <div className="font-black text-emerald-400 font-mono flex items-center">
                  <span>+₹{node.commissionFromNode}</span>
                </div>
              )}
            </div>
          </div>

          {/* Toggle Expand/Collapse Handle at Bottom of Node */}
          {hasChildren && (
            <div className="flex justify-center -mb-3 mt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(nodeId);
                }}
                className={`w-6 h-6 rounded-full flex items-center justify-center border text-[11px] font-bold shadow-md transition-transform hover:scale-110 ${
                  isCollapsed
                    ? 'bg-amber-500 border-amber-300 text-slate-950 font-black'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
                title={isCollapsed ? 'Expand branch' : 'Collapse branch'}
              >
                {isCollapsed ? '+' : '−'}
              </button>
            </div>
          )}
        </div>

        {/* Children Branches */}
        {hasChildren && !isCollapsed && (
          <div className="relative pt-6 flex flex-col items-center">
            {/* Vertical connector line from parent to horizontal rail */}
            <div className="w-0.5 h-6 bg-gradient-to-b from-amber-500/80 to-slate-700" />

            <div className="relative flex items-start justify-center gap-6 pt-2">
              {/* Horizontal Connecting Rail between siblings */}
              {node.children.length > 1 && (
                <div
                  className="absolute top-2 h-0.5 bg-slate-700/80"
                  style={{
                    left: 'calc(105px)',
                    right: 'calc(105px)',
                  }}
                />
              )}

              {/* Render each child */}
              {node.children.map((child, index) => (
                <div key={child.user.userId || child.user.id} className="relative flex flex-col items-center">
                  {/* Vertical drop line to child */}
                  <div className="w-0.5 h-4 bg-slate-700 -mt-2 mb-2" />
                  {renderTreeNode(child, index === node.children.length - 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Controls & Network Stats */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0B0C10] border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>Downline Growth Tree</span>
                  {isPreviewActive && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      Sample Growth Simulation
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400">
                  Interactive multi-tier downline structure. Click any node or branch button (+ / −) to expand and explore network depth.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions & Sample Toggle */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {hasZeroDirects && !useSamplePreview && (
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Showing sample structure until your first referral registers
              </span>
            )}

            {!hasZeroDirects && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setUseSamplePreview(!useSamplePreview);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                  useSamplePreview
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{useSamplePreview ? 'Switch to Live Network' : 'Preview Growth Potential'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={expandAll}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1"
              title="Expand All Nodes"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expand All</span>
            </button>

            <button
              type="button"
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1"
              title="Collapse All Nodes"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Collapse All</span>
            </button>

            {onShareWhatsApp && (
              <button
                type="button"
                onClick={onShareWhatsApp}
                className="btn-3d-emerald px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 ml-auto lg:ml-0"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Invite Members</span>
              </button>
            )}
          </div>
        </div>

        {/* Network Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Total Network Team</span>
            </div>
            <p className="text-xl font-black text-white mt-1 font-mono">
              {metrics.totalNodes} <span className="text-xs text-slate-400 font-sans font-normal">members</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Level 1 (Directs)</span>
            </div>
            <p className="text-xl font-black text-emerald-400 mt-1 font-mono">
              {metrics.level1Count}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              <span>Level 2+ (Indirects)</span>
            </div>
            <p className="text-xl font-black text-purple-400 mt-1 font-mono">
              {metrics.level2PlusCount}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Volume Commission</span>
            </div>
            <p className="text-xl font-black text-amber-400 mt-1 font-mono">
              ₹{metrics.totalCommissionGenerated.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-slate-800/60">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member name or User ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Tier Pills */}
          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'royal', 'platinum', 'silver'] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setPlanFilter(tier);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition shrink-0 ${
                  planFilter === tier
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tier === 'all'
                  ? 'All Tiers'
                  : tier === 'royal'
                  ? '₹1000 Royal'
                  : tier === 'platinum'
                  ? '₹500 Platinum'
                  : '₹100 Normal'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Canvas Area with Pan/Scroll */}
      <div className="relative rounded-3xl bg-[#07090E] border border-slate-800/80 p-6 overflow-x-auto min-h-[500px] flex justify-center shadow-inner">
        {/* Subtle Guilloche Grid Background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38BDF8 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Tree Root Container */}
        <div className="relative z-10 py-6 min-w-max flex flex-col items-center">
          {renderTreeNode(rootTree)}
        </div>
      </div>

      {/* Member Details Drawer Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={
                  selectedMember.profilePic ||
                  selectedMember.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                }
                alt={selectedMember.fullName || selectedMember.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400"
              />
              <div>
                <h4 className="text-base font-black text-white flex items-center gap-1.5">
                  <span>{selectedMember.fullName || selectedMember.name}</span>
                  {selectedMember.verificationStatus === 'verified' && (
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                  )}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-xs text-amber-400 font-bold">
                    {selectedMember.userId || selectedMember.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedMember.userId || selectedMember.id)}
                    className="text-slate-400 hover:text-amber-400"
                    title="Copy ID"
                  >
                    {copiedId === (selectedMember.userId || selectedMember.id) ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Plan Tier</span>
                <div>{getPlanBadge(selectedMember)}</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Join Date</span>
                <p className="font-mono font-bold text-white">{selectedMember.joinDate || 'Active'}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Sponsor ID</span>
                <p className="font-mono font-bold text-cyan-400 truncate">
                  {selectedMember.sponsorId || 'Direct'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Commission Value</span>
                <p className="font-mono font-bold text-emerald-400">
                  ₹
                  {selectedMember.currentPlan === '1000' || selectedMember.plan === 'royal'
                    ? '765'
                    : selectedMember.currentPlan === '500' || selectedMember.plan === 'platinum'
                    ? '365'
                    : '65'}
                </p>
              </div>
            </div>

            {selectedMember.mobile && (
              <div className="pt-2 flex gap-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=91${selectedMember.mobile.replace(/\D/g, '')}&text=Hello%20${encodeURIComponent(
                    selectedMember.fullName || selectedMember.name
                  )}!%20Connecting%20from%20RainAksh%20Network.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 btn-3d-emerald py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
                <a
                  href={`tel:${selectedMember.mobile}`}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>Call</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
