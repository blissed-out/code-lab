import express from "express";
import authRoute from "./routers/auth.route.js";
import cookieParser from "cookie-parser"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoute);

export default app;
