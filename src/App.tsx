import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import { UserProfile, Transaction, PlanTier } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { PaymentModal } from './components/PaymentModal';
import { ThankYouModal } from './components/ThankYouModal';
import { VerifyCardModal } from './components/VerifyCardModal';
import { AnnouncementModal } from './components/AnnouncementModal';
import { LoginModal } from './components/LoginModal';
import { ReferralMarketingModal } from './components/ReferralMarketingModal';
import { ThreeSystemsModal } from './components/ThreeSystemsModal';
import { SponsorCardModal } from './components/SponsorCardModal';
import { FloatingAiChat } from './components/FloatingAiChat';
import { HomeView } from './views/HomeView';
import { DashboardView } from './views/DashboardView';
import { AdminView } from './views/AdminView';
import { GuideView } from './views/GuideView';
import { FaqView } from './views/FaqView';
import { LegalView } from './views/LegalView';
import { ContactView } from './views/ContactView';
import { sounds } from './utils/audioCelebration';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    storage.getCurrentUser()
  );
  const [activeView, setActiveView] = useState<string>('home');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Referral & Marketing Studio Modal State
  const [referralModalOpen, setReferralModalOpen] = useState(false);

  // 3-Systems interactive pop-up options modal state
  const [threeSystemsModalOpen, setThreeSystemsModalOpen] = useState(false);

  // Sponsor Masked Digital ID Card modal state
  const [sponsorCardModalOpen, setSponsorCardModalOpen] = useState(false);
  const [hasSponsorRef, setHasSponsorRef] = useState<boolean>(false);

  // Modal states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<PlanTier>('platinum');
  const [sponsorIdForPayment, setSponsorIdForPayment] = useState<string>('RNX1000RN01');

  // Announcement modal state
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);

  // Login modal state
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Thank You modal state
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [lastRegisteredUser, setLastRegisteredUser] = useState<UserProfile | null>(null);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  // Verify Card modal state
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyTargetUserId, setVerifyTargetUserId] = useState<string>('');

  // Admin View
  const [adminViewOpen, setAdminViewOpen] = useState(false);

  // Subscribe to storage updates
  useEffect(() => {
    const unsub = storage.subscribe(() => {
      setCurrentUser(storage.getCurrentUser());
    });
    return unsub;
  }, []);

  // Check URL params on load for ?ref=, ?sponsor=, ?verify= or /super-admin-rainaksh
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref') || params.get('sponsor');
      if (ref) {
        const cleanRef = ref.trim().toUpperCase();
        setSponsorIdForPayment(cleanRef);
        setHasSponsorRef(true);
        // User explicitly asked: "sponcer link se aaye to Sponcer card dikhao"
        setSponsorCardModalOpen(true);
      }
      const verify = params.get('verify');
      if (verify) {
        setVerifyTargetUserId(verify.trim());
        setVerifyModalOpen(true);
      }
      // Check if URL pathname or query asks for admin
      if (
        window.location.pathname.includes('super-admin-rainaksh') ||
        params.get('admin') === 'true'
      ) {
        setAdminViewOpen(true);
      }
    }
  }, []);

  const handleOpenJoinModal = (plan: PlanTier = 'platinum') => {
    sounds.playClick();
    setSelectedPlanForPayment(plan);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (user: UserProfile, txn: Transaction) => {
    setPaymentModalOpen(false);
    setLastRegisteredUser(user);
    setLastTransaction(txn);
    setThankYouOpen(true);
    setCurrentUser(user);
  };

  const handleGoToDashboard = () => {
    sounds.playClick();
    setThankYouOpen(false);
    setActiveView('dashboard');
  };

  const handleOpenVerifyModal = (userId: string = '') => {
    sounds.playClick();
    setVerifyTargetUserId(userId);
    setVerifyModalOpen(true);
  };

  const unreadNotifsCount = currentUser
    ? storage.getNotifications(currentUser.userId || currentUser.id).filter((n) => !n.read).length
    : 0;

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col font-sans transition-colors duration-200 ${
      darkMode ? 'bg-[#0B0C10] text-slate-100' : 'bg-slate-900 text-slate-100'
    }`}>
      {/* Navbar Header */}
      <Navbar
        currentUser={currentUser}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenJoinModal={handleOpenJoinModal}
        onOpenAdmin={() => {
          sounds.playClick();
          setAdminViewOpen(true);
        }}
        onOpenVerify={() => handleOpenVerifyModal('')}
        onOpenAnnouncementModal={() => {
          sounds.playClick();
          setAnnouncementModalOpen(true);
        }}
        onOpenReferralStudio={() => {
          sounds.playClick();
          setReferralModalOpen(true);
        }}
        onOpenLogin={() => {
          sounds.playClick();
          setLoginModalOpen(true);
        }}
        onOpenPlansModal={() => {
          sounds.playClick();
          setThreeSystemsModalOpen(true);
        }}
        onOpenSponsorCard={() => {
          sounds.playClick();
          setSponsorCardModalOpen(true);
        }}
        unreadNotifsCount={unreadNotifsCount}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sponsorId={sponsorIdForPayment}
        hasSponsorRef={hasSponsorRef}
      />

      {/* Main Page Body (with clearance for fixed bottom navigation on mobile) */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-24 lg:pb-0">
        {activeView === 'home' && (
          <HomeView
            onSelectPlan={handleOpenJoinModal}
            onOpenVerify={() => handleOpenVerifyModal('')}
            setActiveView={setActiveView}
            onOpenAnnouncementModal={() => {
              sounds.playClick();
              setAnnouncementModalOpen(true);
            }}
            onOpenReferralStudio={() => {
              sounds.playClick();
              setReferralModalOpen(true);
            }}
          />
        )}

        {activeView === 'plans' && (
          <HomeView
            onSelectPlan={handleOpenJoinModal}
            onOpenVerify={() => handleOpenVerifyModal('')}
            setActiveView={setActiveView}
            onOpenAnnouncementModal={() => {
              sounds.playClick();
              setAnnouncementModalOpen(true);
            }}
            onOpenReferralStudio={() => {
              sounds.playClick();
              setReferralModalOpen(true);
            }}
          />
        )}

        {activeView === 'dashboard' && (
          currentUser ? (
            <DashboardView
              currentUser={currentUser}
              onSelectPlan={handleOpenJoinModal}
              onOpenVerify={() => handleOpenVerifyModal(currentUser.userId || currentUser.id)}
              onOpenReferralStudio={() => {
                sounds.playClick();
                setReferralModalOpen(true);
              }}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-[#0B0C10] rounded-3xl border border-slate-800 text-center space-y-4 shadow-2xl">
              <h2 className="text-xl font-black text-white">Member Access / मल्टी-डिवाइस लॉगिन</h2>
              <p className="text-xs text-slate-400">
                Aapka dashboard aur Digital ID passport access karne ke liye apne existing account se login karein ya naya membership plan join karein.
              </p>
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setLoginModalOpen(true);
                  }}
                  className="btn-3d-cyan w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
                >
                  <span>📱 Existing Member Log In (Multi-Device)</span>
                </button>
                <button
                  onClick={() => handleOpenJoinModal('platinum')}
                  className="btn-3d-amber w-full py-3.5 rounded-2xl text-xs font-black"
                >
                  <span>✨ Join Plan Now (Starts ₹100)</span>
                </button>
              </div>
            </div>
          )
        )}

        {activeView === 'guide' && <GuideView onSelectPlan={handleOpenJoinModal} />}

        {activeView === 'faq' && <FaqView />}

        {activeView === 'legal' && <LegalView />}

        {activeView === 'contact' && <ContactView />}
      </main>

      {/* Footer */}
      <Footer
        setActiveView={setActiveView}
        onOpenAdmin={() => {
          sounds.playClick();
          setAdminViewOpen(true);
        }}
        onOpenJoinModal={handleOpenJoinModal}
        onOpenVerify={() => handleOpenVerifyModal('')}
        onOpenReferralStudio={() => {
          sounds.playClick();
          setReferralModalOpen(true);
        }}
      />

      {/* Mobile Floating Bottom Nav */}
      <BottomNav
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
        onOpenJoinModal={() => handleOpenJoinModal('platinum')}
        onOpenAdmin={() => {
          sounds.playClick();
          setAdminViewOpen(true);
        }}
        onOpenPlansModal={() => {
          sounds.playClick();
          setThreeSystemsModalOpen(true);
        }}
        onOpenSponsorCard={() => {
          sounds.playClick();
          setSponsorCardModalOpen(true);
        }}
        unreadCount={unreadNotifsCount}
      />

      {/* Official Announcement Modal detailing highlights and rewards breakdown */}
      <AnnouncementModal
        isOpen={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
        onSelectPlan={handleOpenJoinModal}
      />

      {/* Multi-Device Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={(u) => {
          setCurrentUser(u);
          setActiveView('dashboard');
        }}
        onSwitchToRegister={() => handleOpenJoinModal('platinum')}
      />

      {/* Payment / Registration Modal */}
      <PaymentModal
        initialPlan={selectedPlanForPayment}
        initialSponsorId={sponsorIdForPayment}
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        onOpenFullSponsorCard={(id) => {
          if (id) setSponsorIdForPayment(id);
          setSponsorCardModalOpen(true);
        }}
      />

      {/* Thank You Celebration Modal with Chime */}
      {lastRegisteredUser && lastTransaction && (
        <ThankYouModal
          user={lastRegisteredUser}
          transaction={lastTransaction}
          isOpen={thankYouOpen}
          onClose={() => setThankYouOpen(false)}
          onGoToDashboard={handleGoToDashboard}
        />
      )}

      {/* Public Verify Card Modal */}
      <VerifyCardModal
        initialUserId={verifyTargetUserId}
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
      />

      {/* Master Admin Modal (Gatekeeper: RAINAKSH) */}
      {adminViewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-2xl">
          <AdminView
            onClose={() => setAdminViewOpen(false)}
            onOpenVerify={() => handleOpenVerifyModal('')}
          />
        </div>
      )}

      {/* Floating 3D Pulse AI Support & Guidance Launcher */}
      <FloatingAiChat
        currentUser={currentUser}
        onSelectPlan={handleOpenJoinModal}
        onOpenVerify={() => handleOpenVerifyModal('')}
        onOpenReferralStudio={() => setReferralModalOpen(true)}
      />

      {/* Referral & Marketing Promotion Studio Popup Modal */}
      <ReferralMarketingModal
        isOpen={referralModalOpen}
        onClose={() => setReferralModalOpen(false)}
        currentUser={currentUser}
        onSelectPlan={handleOpenJoinModal}
      />

      {/* 3-Systems Interactive Plan Options Modal Pop-up */}
      <ThreeSystemsModal
        isOpen={threeSystemsModalOpen}
        onClose={() => setThreeSystemsModalOpen(false)}
        onSelectPlan={handleOpenJoinModal}
      />

      {/* Sponsor Masked Digital ID Card Pop-up Modal */}
      <SponsorCardModal
        isOpen={sponsorCardModalOpen}
        initialSponsorId={sponsorIdForPayment}
        onClose={() => setSponsorCardModalOpen(false)}
        onOpenJoinModal={(plan, sponsorId) => {
          if (sponsorId) {
            setSponsorIdForPayment(sponsorId);
          }
          handleOpenJoinModal(plan || 'platinum');
        }}
        onOpenLogin={() => {
          setSponsorCardModalOpen(false);
          setLoginModalOpen(true);
        }}
        onOpenVerifyModal={() => {
          setSponsorCardModalOpen(false);
          handleOpenVerifyModal('');
        }}
      />
    </div>
  );
}
