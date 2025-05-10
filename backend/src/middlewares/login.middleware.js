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
  })

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "user not found"))
  }

  // req.user = user;
  req.user = {
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  }

  next();
}

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const userRole = db.user.findUnique({ email }).role;

  if (userRole !== "ADMIN") {
    return res.status(401).json(new ApiResponse(401, userRole, "user is not admin"));
  }

  next();
})

export { isLoggedIn, isAdmin }
