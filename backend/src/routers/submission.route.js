import { Router } from "express";
import { isLoggedIn } from "../middlewares/login.middleware.js";
import {
  getAllSubmission,
  getAllTheSolvedProblemForProblem,
  getAllTheSubmissionsForProblem,
  getSubmissionsForProblem,
  submitCode,
} from "../controllers/submission.controller.js";

const submissionRoute = Router();

submissionRoute.post("/submit-code", isLoggedIn, submitCode);

submissionRoute.get("/get-all-submissions", isLoggedIn, getAllSubmission);

submissionRoute.get(
  "/get-submission/:problemId",
  isLoggedIn,
  getSubmissionsForProblem,
);

submissionRoute.get(
  "/get-submissions-count/:problemId",
  isLoggedIn,
  getAllTheSubmissionsForProblem,
);

submissionRoute.get(
  "/get-solved-submissions/:problemId",
  isLoggedIn,
  getAllTheSolvedProblemForProblem,
);

export default submissionRoute;
