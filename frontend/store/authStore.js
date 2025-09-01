// store/authStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  access: null,
  refresh: null,

  // Initialize from localStorage if available
  init: () => {
    if (typeof window === "undefined") return; // ⬅️ prevents SSR crash

    const storedUser = localStorage.getItem("user");
    const storedAccess = localStorage.getItem("access_token");
    const storedRefresh = localStorage.getItem("refresh_token");

    if (storedUser && storedAccess) {
      set({
        user: JSON.parse(storedUser),
        access: storedAccess,
        refresh: storedRefresh,
      });
    }
  },

  // Save login details
  login: (user, access, refresh) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("access_token", access);
      if (refresh) {
        localStorage.setItem("refresh_token", refresh);
      }
    }
    set({ user, access, refresh });
  },

  // Clear everything
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    set({ user: null, access: null, refresh: null });
  },

  // Helper
  isAuthenticated: () => {
    if (typeof window === "undefined") return false; // ⬅️ guard
    return !!localStorage.getItem("access_token");
  },
}));

export default useAuthStore;
