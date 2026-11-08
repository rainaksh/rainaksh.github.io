import React, { useState } from 'react';
import { X, Search, ShieldCheck, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { storage } from '../services/storage';
import { UserProfile } from '../types';
import { DigitalIdCard } from './DigitalIdCard';
import { sounds, triggerCelebration } from '../utils/audioCelebration';

interface VerifyCardModalProps {
  initialUserId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VerifyCardModal: React.FC<VerifyCardModalProps> = ({
  initialUserId = '',
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialUserId);
  const [targetUser, setTargetUser] = useState<UserProfile | null>(() => {
    if (initialUserId) {
      return storage.getUserById(initialUserId) || null;
    }
    return null;
  });
  const [searched, setSearched] = useState(Boolean(initialUserId));

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    if (!searchQuery.trim()) return;
    const found = storage.getUserById(searchQuery.trim());
    setTargetUser(found || null);
    setSearched(true);
    if (found) {
      triggerCelebration();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0B0C10] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-black text-white">RainAksh Public ID Verification</h3>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter User ID (e.g. RNX1000RN01)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-amber-300 font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="btn-3d-amber px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Verify</span>
            </button>
          </form>

          {targetUser ? (
            <div>
              {targetUser.privacySettings?.isCardPublic === false ? (
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Card Privacy Protected</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Is member ({targetUser.userId || targetUser.id}) ne apne Digital ID card ko Private set kiya hua hai.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs px-1 text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Govt. Direct Selling Verified Record</span>
                    </span>
                    <span className="font-mono text-cyan-300 font-black">{targetUser.userId || targetUser.id}</span>
                  </div>

                  <DigitalIdCard user={targetUser} isPublicView={true} allowDownload={false} />
                </div>
              )}
            </div>
          ) : searched ? (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
              <p className="text-sm font-bold text-slate-200">User ID Not Found</p>
              <p className="text-xs text-slate-400">
                "{searchQuery}" se judi koi verified membership nahi mili.
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-400">त्वरित सत्यापन के लिए नीचे क्लिक करें:</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSearchQuery('RNX1000RN01');
                    const u = storage.getUserById('RNX1000RN01');
                    setTargetUser(u || null);
                    setSearched(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold hover:bg-slate-800"
                >
                  RNX1000RN01 (RainAksh Nityam)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSearchQuery('RNX1000VK01');
                    const u = storage.getUserById('RNX1000VK01');
                    setTargetUser(u || null);
                    setSearched(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold hover:bg-slate-800"
                >
                  RNX1000VK01 (Vikas Kumar)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
