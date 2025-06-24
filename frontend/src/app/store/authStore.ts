import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean | null;
  login: (username: string, password: string) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: null,
  login: async (email, password) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        credentials: "include", // 🧠 Important for cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        set({ isAuthenticated: true });
        return true;
      } else {
        set({ isAuthenticated: false });
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      set({ isAuthenticated: false });
      return false;
    }
  },
  checkAuth: async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/authorized", {
        credentials: "include",
      });
      set({ isAuthenticated: res.ok });
    } catch {
      set({ isAuthenticated: false });
    }
  },
  logout: async () => {
    // Optional: call /logout endpoint if you have one
      const res = await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    if(res.ok) {
    set({ isAuthenticated: false });
    }
    else {

    }
  },
}));
