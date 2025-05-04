import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.get("/register", register);

export default authRoute;
