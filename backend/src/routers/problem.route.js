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

const problemRoute = Router();

problemRoute.post("/create-problem", isLoggedIn, isAdmin, createProblem);

problemRoute.get("/get-all-problems", isLoggedIn, getAllProblems);

problemRoute.get("/get-problem/:id", isLoggedIn, getProblemById);

problemRoute.post("/update-problem/:id", isLoggedIn, isAdmin, updateProblem);

problemRoute.delete("/delete-problem/:id", isLoggedIn, isAdmin, deleteProblem);

problemRoute.get("/get-solved-problem", isLoggedIn, getAllSolvedProblemsByUser);

export default problemRoute;
