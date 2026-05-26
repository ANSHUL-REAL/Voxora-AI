import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  type Auth,
} from "firebase/auth";

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

let analyticsPromise: Promise<Analytics | null> | null = null;

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId,
);

export const firebaseApp: FirebaseApp | null = isFirebaseConfigured
  ? getApps().length > 0
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

export const firebaseAuth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const googleProvider = new GoogleAuthProvider();

if (typeof window !== "undefined" && firebaseAuth) {
  void setPersistence(firebaseAuth, browserLocalPersistence).catch(() => {});
}

export function getFirebaseAnalytics() {
  if (typeof window === "undefined" || !firebaseApp) return Promise.resolve(null);
  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
      .catch(() => null);
  }
  return analyticsPromise;
}
