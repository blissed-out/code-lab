import { Router } from "express";
import { get, update } from "../controllers/profile.controller.js";
import { isLoggedIn } from "../middlewares/login.middleware.js";

const profileRouter = Router();

profileRouter.get("/", isLoggedIn, get);
profileRouter.put("/update", isLoggedIn, update);

export default profileRouter;
