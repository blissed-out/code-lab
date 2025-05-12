import jwt from "jsonwebtoken"
import ApiResponse from "../utils/api-response.js";
import { db } from "../libs/db.js";
import asyncHandler from "../utils/asyncHandler.js";

const isLoggedIn = (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json(new ApiResponse(401, null, "User not logged in"));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: "HS256" });

  // if (!decoded) {
  //   res.status(401).json(new ApiResponse(401, null, "invalid token"));
  // }
  const user = db.user.findUnique({
    where: {
      id: decoded.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      password: false,
    }
  })

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "user not found"))
  }

  // req.user = user;
  req.user = user;
  next();
}

const isAdmin = asyncHandler(async (req, res, next) => {
  // to make it robust

  const userId = req.user.id;

  const user = db.user.findUnique({
    where: {
      id: userId
    },
    select: {
      role: true
    }
  });

  if (!user || user.role !== "ADMIN") {
    return res.status(401).json(new ApiResponse(401, null, "Unauthorized access"));
  }

  next();
})

export { isLoggedIn, isAdmin }
