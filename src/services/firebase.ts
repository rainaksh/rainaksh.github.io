import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import { UserProfile, Transaction, DownlineReferral, PayoutRequest, NotificationItem, ChatMessage } from '../types';
import firebaseConfigRaw from '../../firebase-applet-config.json';

export const firebaseConfig = firebaseConfigRaw;

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore with specific database ID if present
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test connection on boot per Firebase skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing cloud connection.');
    }
  }
}
testConnection();

// Cloud sync helpers for multi-device support
export async function syncUserToFirestore(user: UserProfile) {
  try {
    const docId = user.userId || user.id;
    if (!docId) return;
    await setDoc(doc(db, 'users', docId), user, { merge: true });
  } catch (err) {
    console.error('Failed to sync user to Firestore:', err);
  }
}

export async function syncTransactionToFirestore(txn: Transaction) {
  try {
    const docId = txn.transactionId || txn.id;
    if (!docId) return;
    await setDoc(doc(db, 'transactions', docId), txn, { merge: true });
  } catch (err) {
    console.error('Failed to sync transaction to Firestore:', err);
  }
}

export async function syncReferralToFirestore(ref: DownlineReferral) {
  try {
    const docId = ref.referralId;
    if (!docId) return;
    await setDoc(doc(db, 'referrals', docId), ref, { merge: true });
  } catch (err) {
    console.error('Failed to sync referral to Firestore:', err);
  }
}

export async function syncPayoutToFirestore(payout: PayoutRequest) {
  try {
    await setDoc(doc(db, 'payouts', payout.id), payout, { merge: true });
  } catch (err) {
    console.error('Failed to sync payout to Firestore:', err);
  }
}

export async function syncNotificationToFirestore(notif: NotificationItem) {
  try {
    await setDoc(doc(db, 'notifications', notif.id), notif, { merge: true });
  } catch (err) {
    console.error('Failed to sync notification to Firestore:', err);
  }
}

export async function syncMessageToFirestore(msg: ChatMessage) {
  try {
    await setDoc(doc(db, 'messages', msg.id), msg, { merge: true });
  } catch (err) {
    console.error('Failed to sync message to Firestore:', err);
  }
}

// Multi-device realtime listener setup
export function subscribeToFirestoreUsers(onUsersUpdated: (users: UserProfile[]) => void) {
  try {
    return onSnapshot(collection(db, 'users'), (snapshot) => {
      const users: UserProfile[] = [];
      snapshot.forEach((docSnap) => {
        users.push(docSnap.data() as UserProfile);
      });
      if (users.length > 0) {
        onUsersUpdated(users);
      }
    }, (error) => {
      console.warn('Firestore users subscription notice:', error.message);
    });
  } catch {
    return () => {};
  }
}

export function subscribeToFirestoreTransactions(onTxnsUpdated: (txns: Transaction[]) => void) {
  try {
    return onSnapshot(collection(db, 'transactions'), (snapshot) => {
      const txns: Transaction[] = [];
      snapshot.forEach((docSnap) => {
        txns.push(docSnap.data() as Transaction);
      });
      if (txns.length > 0) {
        onTxnsUpdated(txns);
      }
    }, (error) => {
      console.warn('Firestore transactions subscription notice:', error.message);
    });
  } catch {
    return () => {};
  }
}
