import { Router } from "express";
import { isAdmin, isLoggedIn } from "../middlewares/login.middleware.js";
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllSolvedProblemsByUser,
} from "../controllers/problem.controller.js";

const authRoute = Router();

authRoute.post("/create-problem", isLoggedIn, isAdmin, createProblem);

authRoute.get("/get-all-problems", isLoggedIn, getAllProblems);

authRoute.get("/get-problem/:id", isLoggedIn, getProblemById);

authRoute.post("/update-problem/:id", isLoggedIn, isAdmin, updateProblem);

authRoute.delete("/delete-problem/:id", isLoggedIn, isAdmin, deleteProblem);

authRoute.get("/get-solved-problem", isLoggedIn, getAllSolvedProblemsByUser);

export default authRoute;
