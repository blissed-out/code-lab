import { Router } from "express";
import {
  login,
  register,
  logout,
  verifyEmail,
  check,
  sendResetPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import {
  registrationValidation,
  loginValidation,
  resetPasswordValidation,
} from "../utils/validator.js";
import validate from "../middlewares/validation.middleware.js";
import { isLoggedIn } from "../middlewares/login.middleware.js";

const authRoute = Router();

authRoute.post("/register", registrationValidation(), validate, register);
authRoute.post("/login", loginValidation(), validate, login);
authRoute.post("/logout", isLoggedIn, validate, logout);
authRoute.get("/verifyEmail/:token", verifyEmail);
authRoute.get("/check", isLoggedIn, check);

authRoute.post(
  "/reset-password",
  resetPasswordValidation(),
  validate,
  sendResetPassword,
);
authRoute.get("/reset-password/:token", resetPassword);

export default authRoute;
