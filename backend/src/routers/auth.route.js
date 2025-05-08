import { Router } from "express";
import { login, register, logout } from "../controllers/auth.controller.js";
import { registrationValidation, loginValidation } from "../utils/validator.js";
import validate from "../middlewares/validation.middleware.js";

const authRoute = Router();

authRoute.post("/register", registrationValidation(), validate, register);
authRoute.post("/login", loginValidation(), validate, login);
authRoute.get("/logout", loginValidation(), validate, logout);

export default authRoute;
