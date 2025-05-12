import express from "express";
import authRoute from "./routers/auth.route.js";
import problemRoute from "./routers/problem.route.js"
import cookieParser from "cookie-parser"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/problem", problemRoute);

export default app;
