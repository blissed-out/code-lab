import express from "express";
import authRoute from "./routers/auth.route.js";
import problemRoute from "./routers/problem.route.js";
import executionRoute from "./routers/executeCode.route.js";
import cookieParser from "cookie-parser";
import submissionRoute from "./routers/submission.route.js";
import playlistRouter from "./routers/playlist.route.js";
import profileRouter from "./routers/profile.route.js";
import dotenv from "dotenv";

dotenv.config("../");

import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.HOST,
    credentials: true,
  }),
);

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/problems", problemRoute);
app.use("/api/v1/execute-code", executionRoute);
app.use("/api/v1/submission", submissionRoute);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/profile", profileRouter);

export default app;
