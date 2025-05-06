import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { registrationValidation, loginValidation } from "../utils/validator.js";

const authRoute = Router();

authRoute.get("/register", registrationValidation, register);

export default authRoute;
