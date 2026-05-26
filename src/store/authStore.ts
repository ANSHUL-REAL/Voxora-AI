import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { VoxoraUser } from "@/services/auth/firebaseAuth";

type Mode = "demo" | "launching-soon" | "real";
type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type AuthState = {
  user: VoxoraUser | null;
  mode: Mode;
  status: AuthStatus;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  setMode: (mode: Mode) => void;
  continueAsDemo: () => void;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => () => void;
};

const demoUser: VoxoraUser = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@voxora.ai",
  role: "demo",
  provider: "demo",
};

let unsubscribeAuth: (() => void) | null = null;

function authError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Authentication failed. Please try again.";
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      mode: "demo",
      status: "checking",
      loading: false,
      error: null,
      initialized: false,
      setMode: (mode) =>
        set({ mode: mode === "real" ? "launching-soon" : mode }),
      continueAsDemo: () =>
        set({
          user: demoUser,
          mode: "demo",
          status: "authenticated",
          loading: false,
          error: null,
          initialized: true,
        }),
      signInEmail: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { signInWithEmail } = await import(
            "@/services/auth/firebaseAuth"
          );
          const user = await signInWithEmail(email, password);
          set({
            user,
            mode: "demo",
            status: "authenticated",
            loading: false,
            initialized: true,
          });
        } catch (error) {
          set({ loading: false, error: authError(error) });
          throw error;
        }
      },
      signUpEmail: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const { signUpWithEmail } = await import(
            "@/services/auth/firebaseAuth"
          );
          const user = await signUpWithEmail(name, email, password);
          set({
            user,
            mode: "demo",
            status: "authenticated",
            loading: false,
            initialized: true,
          });
        } catch (error) {
          set({ loading: false, error: authError(error) });
          throw error;
        }
      },
      signInGoogle: async () => {
        set({ loading: true, error: null });
        try {
          const { signInWithGoogle } = await import(
            "@/services/auth/firebaseAuth"
          );
          const user = await signInWithGoogle();
          if (user) {
            set({
              user,
              mode: "demo",
              status: "authenticated",
              loading: false,
              initialized: true,
            });
          } else {
            set({
              loading: true,
              status: "checking",
              initialized: true,
            });
          }
        } catch (error) {
          set({ loading: false, error: authError(error) });
          throw error;
        }
      },
      resetPassword: async (email) => {
        set({ loading: true, error: null });
        try {
          const { resetPassword } = await import("@/services/auth/firebaseAuth");
          await resetPassword(email);
          set({ loading: false });
        } catch (error) {
          set({ loading: false, error: authError(error) });
          throw error;
        }
      },
      signOut: async () => {
        const current = get().user;
        set({ loading: true, error: null });
        try {
          if (current?.provider === "firebase") {
            const { firebaseLogout } = await import(
              "@/services/auth/firebaseAuth"
            );
            await firebaseLogout();
          }
        } finally {
          set({
            user: null,
            mode: "demo",
            status: "unauthenticated",
            loading: false,
            error: null,
          });
        }
      },
      initializeAuth: () => {
        if (unsubscribeAuth) return unsubscribeAuth;
        if (get().mode === "real") set({ mode: "launching-soon" });
        set({ initialized: true });
        import("@/services/auth/firebaseAuth")
          .then(async ({ getGoogleRedirectUser, subscribeToFirebaseAuth }) => {
            const redirectUser = await getGoogleRedirectUser().catch(
              () => null,
            );
            if (redirectUser) {
              set({
                user: redirectUser,
                mode: "demo",
                status: "authenticated",
                loading: false,
                initialized: true,
              });
            }
            unsubscribeAuth = subscribeToFirebaseAuth((firebaseUser) => {
              const current = get().user;
              if (current?.provider === "demo") {
                set({ status: "authenticated" });
                return;
              }
              set({
                user: firebaseUser,
                mode: firebaseUser ? "demo" : get().mode,
                status: firebaseUser ? "authenticated" : "unauthenticated",
                loading: false,
              });
            });
          })
          .catch(() => {
            if (!get().user) {
              set({ status: "unauthenticated", loading: false });
            }
          });
        return () => {
          unsubscribeAuth?.();
          unsubscribeAuth = null;
        };
      },
    }),
    {
      name: "voxora-auth",
      partialize: (state) => ({
        user: state.user,
        mode: state.mode === "real" ? "launching-soon" : state.mode,
        status:
          state.user && state.status === "authenticated"
            ? state.status
            : "unauthenticated",
      }),
    },
  ),
);
