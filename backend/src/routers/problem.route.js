import { Router } from "express";
import { isAdmin, isLoggedIn } from "../middlewares/login.middleware";
import { createProblem } from "../controllers/problem.controller";

const route = Router()

route.post("/create-problem", isLoggedIn, isAdmin, createProblem)

route.get("/get-all-problems", isLoggedIn, getAllProblems)

route.get("/get-problem/:id", isLoggedIn, getProblem)

route.post("/update-problem/:id", isLoggedIn, isAdmin, updateProblem)

route.delete("/delete-problem/:id", isLoggedIn, isAdmin, deleteProblem)

route.get("/get-solved-problem", isLoggedIn, getSolvedProblem)
