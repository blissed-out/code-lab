import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data.data });
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);

      toast.success(res.data?.message || "Signup Successful");
    } catch (error) {
      console.error("Error signing up", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({ authUser: res.data.data });

      toast.success(`Welcome back, ${res?.data?.data?.name || "User"}!`);
    } catch (error) {
      console.error("Error logging in", error);

      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again later.";
      toast.error(message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out", error);
      toast.error("Error logging out");
    }
  },
}));
