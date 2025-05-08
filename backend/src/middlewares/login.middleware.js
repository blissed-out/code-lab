import jwt from "jsonwebtoken"
import ApiResponse from "../utils/api-response.js";
const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json(new ApiResponse(401, null, "User not logged in"));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: "HS256" });

  if (!decoded) {
    res.status(401).json(new ApiResponse(401, null, "invalid token"));
  }
  next();
}

export default isLoggedIn
