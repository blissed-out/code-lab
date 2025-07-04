import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  execution: null,

  runCode: async (source_code, language_id, stdin, expected_outputs) => {
    try {
      set({ isExecuting: true });

      const res = await axiosInstance.post("/execute-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
      });

      set({ execution: res.data.data });
    } catch (error) {
      console.error("Error executing code:", error);
      toast.error("Failed to execute code. Please try again.");
    } finally {
      set({ isExecuting: false });
    }
  },
  clearExecutionResult: async () =>
    set({
      isExecuting: false,
      execution: null,
    }),
}));
