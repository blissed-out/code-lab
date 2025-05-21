import { Router } from "express";
import { isLoggedIn } from "../middlewares/login.middleware.js";
import { executeCode } from "../controllers/executeCode.controller.js";

const executionRoute = Router();

executionRoute.post("/", isLoggedIn, executeCode);

export default executionRoute;
