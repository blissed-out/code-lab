import { Router } from "express"
import { isLoggedIn } from "../middlewares/login.middleware.js";
import { getAllSubmission, getAllTheSubmissionsForProblem, getSubmissionForProblem } from "../controllers/submission.controller.js";

const submissionRoute = Router();

submissionRoute.get("/get-all-submission", isLoggedIn, getAllSubmission);

submissionRoute.get("/get-submission/:problemId", isLoggedIn, getSubmissionForProblem);

submissionRoute.get("/get-submission-count/:problemId", isLoggedIn, getAllTheSubmissionsForProblem);

export default submissionRoute;
