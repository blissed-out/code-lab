import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useSubmissionStore = create((set, get) => ({
  allSubmissionsForProblem: [],
  latestSubmissionForProblem: null,
  allSubmissionsOfUser: [],
  submissionCount: null,
  solvedSubmissionsCount: null,

  loading: {
    submitCode: false,
    allSubmissionsForProblem: false,
    allSubmissionsOfUser: false,
  },

  submitCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId,
  ) => {
    try {
      set((state) => ({
        loading: {
          ...state.loading,
          submitCode: true,
        },
      }));

      const res = await axiosInstance.post("/submission/submit-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });

      set({ latestSubmissionForProblem: res.data.data });

      toast.success(res.data.message);
    } catch (error) {
      console.error("Error executing code", error);
      toast.error("Error executing code");
    } finally {
      set((state) => ({
        loading: {
          ...state.loading,
          submitCode: false,
        },
      }));
    }
  },

  getAllSubmissions: async () => {
    try {
      set((state) => ({
        loading: {
          ...state.loading,
          getAllSubmissions: true,
        },
      }));
      const res = await axiosInstance.get("/submission/get-all-submissions");

      set({ allSubmissionsOfUser: res.data.data });

      toast.success(res.data.message);
    } catch (error) {
      console.error("Error getting all submissions", error);
      toast.error("Error getting all submissions");
    } finally {
      set((state) => ({
        loading: {
          ...state.loading,
          getAllSubmissions: false,
        },
      }));
    }
  },

  getSubmissionsForProblem: async (problemId) => {
    try {
      set((state) => ({
        loading: {
          ...state.loading,
          getSubmissionsForProblem: true,
        },
      }));

      const res = await axiosInstance.get(
        `/submission/get-submission/${problemId}`,
      );

      set({ allSubmissionsForProblem: res.data.data });
      console.log("allSubmissionsForProblem", res.data.data);
    } catch (error) {
      console.error("Error getting submissions for problem", error);

      toast.error("Error getting submissions for problem");
    } finally {
      set((state) => ({
        loading: {
          ...state.loading,
          getSubmissionsForProblem: true,
        },
      }));
    }
  },

  getSubmissionCountForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submissions-count/${problemId}`,
      );

      set({ submissionCount: res.data.data });
    } catch (error) {
      console.error("Error getting submission count for problem", error);
      toast.error("Error getting submission count for problem");
    }
  },

  getSolvedSubmissions: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-solved-submissions/${problemId}`,
      );
      console.log("solved submissions data: ", res.data.data);
      set({ solvedSubmissionsCount: res.data.data.length });
    } catch (error) {
      console.error("Error getting submission success rate", error);
      toast.error("Error getting submission success rate");
    }
  },
}));
