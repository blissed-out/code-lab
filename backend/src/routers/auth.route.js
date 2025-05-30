import { Router } from "express";
import {
  login,
  register,
  logout,
  verifyEmail,
  check,
} from "../controllers/auth.controller.js";
import { registrationValidation, loginValidation } from "../utils/validator.js";
import validate from "../middlewares/validation.middleware.js";
import { isLoggedIn } from "../middlewares/login.middleware.js";

const authRoute = Router();

authRoute.post("/register", registrationValidation(), validate, register);
authRoute.post("/login", loginValidation(), validate, login);
authRoute.post("/logout", isLoggedIn, validate, logout);
authRoute.get("/verifyEmail/:token", verifyEmail);
authRoute.get("/check", isLoggedIn, check);

export default authRoute;
