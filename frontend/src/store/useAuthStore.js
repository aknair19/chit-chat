import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSignUp: false,
  isLoggedIn: false,
  isUpdatedProfile: false,
  isCheckingAuth: true,
  checkAuth: async () => {},
}));
