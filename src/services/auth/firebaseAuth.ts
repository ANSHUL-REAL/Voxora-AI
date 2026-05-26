import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { firebaseAuth, googleProvider, isFirebaseConfigured } from "@/config/firebase";

export type VoxoraUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "demo" | "user" | "admin";
  provider: "demo" | "firebase";
};

export function mapFirebaseUser(user: FirebaseUser): VoxoraUser {
  return {
    id: user.uid,
    name: user.displayName || user.email?.split("@")[0] || "Voxora User",
    email: user.email || "user@voxora.ai",
    avatar: user.photoURL || undefined,
    role: "user",
    provider: "firebase",
  };
}

export function subscribeToFirebaseAuth(
  callback: (user: VoxoraUser | null) => void,
) {
  if (!isFirebaseConfigured || !firebaseAuth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(firebaseAuth, (user) => {
    callback(user ? mapFirebaseUser(user) : null);
  });
}

export async function signInWithEmail(email: string, password: string) {
  if (!firebaseAuth) throw new Error("Firebase is not configured. Continue as Demo User for public evaluation.");
  const credential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  return mapFirebaseUser(credential.user);
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
) {
  if (!firebaseAuth) throw new Error("Firebase is not configured. Continue as Demo User for public evaluation.");
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  if (name.trim()) {
    await updateProfile(credential.user, { displayName: name.trim() });
  }
  return mapFirebaseUser(credential.user);
}

export async function signInWithGoogle() {
  if (!firebaseAuth) throw new Error("Firebase is not configured. Continue as Demo User for public evaluation.");
  try {
    const credential = await signInWithPopup(firebaseAuth, googleProvider);
    return mapFirebaseUser(credential.user);
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (
      code === "auth/popup-blocked" ||
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request"
    ) {
      await signInWithRedirect(firebaseAuth, googleProvider);
      return null;
    }
    throw error;
  }
}

export async function getGoogleRedirectUser() {
  if (!firebaseAuth) return null;
  const result = await getRedirectResult(firebaseAuth);
  return result?.user ? mapFirebaseUser(result.user) : null;
}

export async function resetPassword(email: string) {
  if (!firebaseAuth) throw new Error("Firebase is not configured. Continue as Demo User for public evaluation.");
  await sendPasswordResetEmail(firebaseAuth, email);
}

export async function firebaseLogout() {
  if (!firebaseAuth) return;
  await signOut(firebaseAuth);
}
