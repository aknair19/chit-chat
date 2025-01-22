import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSignUp: false,
  isLoggedIn: false,
  isUpdatedProfile: false,
  isCheckingAuth: true,
  isLoggedIn: false,
  isUpdatingProfile: false,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data, isLoggedIn: true });
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null, isLoggedIn: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
