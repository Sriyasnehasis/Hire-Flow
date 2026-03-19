import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: any | null;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token:
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
      ? window.localStorage.getItem("token")
      : null,
  user: null,
  setToken: (token: string) => {
    if (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    ) {
      window.localStorage.setItem("token", token);
    }
    set({ token });
  },
  setUser: (user: any) => set({ user }),
  logout: () => {
    if (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    ) {
      window.localStorage.removeItem("token");
    }
    set({ token: null, user: null });
  },
}));
