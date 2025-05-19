import express from "express";
import authRoute from "./routers/auth.route.js";
import problemRoute from "./routers/problem.route.js"
import executionRoute from "./routers/executeCode.route.js";
import cookieParser from "cookie-parser"
import submissionRoute from "./routers/submission.route.js";
import playlistRouter from "./routers/playlist.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/problem", problemRoute);
app.use("/api/v1/execute-code", executionRoute);
app.use("/api/v1/submission", submissionRoute);
app.use("/api/v1/playlist", playlistRouter);

export default app;
