import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { signUpSchema } from "../schemas";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSignUp: false,
  isLoggedIn: false,
  isCheckingAuth: true,

  isUpdatedProfile: false,

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

  signUp: async (data) => {
    set({ isSignUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      console.log(res.data, "account created successfully");
    } catch (error) {
      console.log("Error in signUp", error);
      toast.error(error.response.data.message);
      set({ isSignUp: false });
    } finally {
      set({ isSignUp: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Error in logout", error);
      toast.error(error.response.data.message);
    }
  },
  login: async (data) => {
    set({ isLoggedIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      console.log("Error in login", error);
      toast.error(error.response.data.message);
      set({ isLoggedIn: false });
    }
  },
}));
