import express from "express";
import authRoute from "./routers/auth.route.js";

const app = express();

// import all kind of middlewares to use project wise

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/auth", authRoute);

export default app;
