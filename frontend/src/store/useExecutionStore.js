import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  submission: null,
  execution: null,

  submitCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId,
  ) => {
    try {
      set({ isExecuting: true });
      // console.log(
      //   "Submission in submitCode function:",
      //   JSON.stringify({
      //     source_code,
      //     language_id,
      //     stdin,
      //     expected_outputs,
      //     problemId,
      //   }),
      // );
      const res = await axiosInstance.post("/submission/submit-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });

      set({ submission: res.data.data });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error executing code", error);
      toast.error("Error executing code");
    } finally {
      set({ isExecuting: false });
    }
  },

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
      console.error("error huh");
    } finally {
      set({ isExecuting: false });
    }
  },
}));
