import { create } from "zustand";
import { UserInput } from "@/lib/schemas/userSchema";

type AuthState = {
  isAuthenticated: boolean | null;
  user: UserInput | null;
  login: (username: string, password: string) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  logout: () => void;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL 

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: null,
  user: null,

  login: async (email, password) => {
    try {
      const res = await fetch( backendUrl + "/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json(); // assuming the response returns user info
        set({ isAuthenticated: true, user: data.user  });
        return true;
      } else {
        set({ isAuthenticated: false, user: null });
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      set({ isAuthenticated: false, user: null });
      return false;
    }
  },

  checkAuth: async () => {
    try {
      const res = await fetch(backendUrl + "/api/auth/authorized", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json(); // assuming it returns user info
        set({ isAuthenticated: true, user: data.user });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch {
      set({ isAuthenticated: false, user: null });
    }
  },

  logout: async () => {
    const res = await fetch(backendUrl + "/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      set({ isAuthenticated: false, user: null });
    }
  },
}));
