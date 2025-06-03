import jwt from "jsonwebtoken";
import ApiResponse from "../utils/api-response.js";
import { db } from "../libs/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/api-error.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError(401, "User not logged in");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, {
    algorithms: "HS256",
  });

  // if (!decoded) {
  //   res.status(401).json(new ApiResponse(401, null, "invalid token"));
  // }
  const user = await db.user.findUnique({
    where: {
      id: decoded,
    },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      password: false,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // req.user = user;
  req.user = user;

  next();
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  // to make it robust

  const userId = req.user.id;

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    throw new ApiError(401, "Unauthorized access");
  }

  next();
});
