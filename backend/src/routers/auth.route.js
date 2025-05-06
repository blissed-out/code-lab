import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { registrationValidation, loginValidation } from "../utils/validator.js";
import validate from "../middlewares/validation.middleware.js";

const authRoute = Router();

authRoute.get("/register", registrationValidation, validate, register);
authRoute.get("/login", loginValidation, validate, login);

export default authRoute;
