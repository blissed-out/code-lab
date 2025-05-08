import { db } from "../libs/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import { Role } from "../generated/prisma/index.js";
import ApiResponse from "../utils/api-response.js";
import jwt from "jsonwebtoken"

const register = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    const data = {
      email: existingUser.email,
    };

    return res
      .status(401)
      .json(new ApiResponse(401, data, "User already registered"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: Role.USER,
    },
  });


  const data = {
    name: newUser.name,
    email: newUser.email,
  };

  res.status(200).json(new ApiResponse(200, data, "user registered successfully")
  );

});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    }
  })

  const data = {
    name: existingUser.name,
    email: existingUser.email,
  }

  if (!existingUser) {
    return res.status(401).json(new ApiResponse(401, data, "User is not registered"))
  }

  const hashedPassword = existingUser.password;

  const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

  if (!isPasswordCorrect) {
    return res.status(401).json(new ApiResponse(401, data.email, "Incorrect credentials"));
  }

  const token = jwt.sign(existingUser.id, process.env.JWT_SECRET_KEY, {
    algorithm: "SHA-256",
  }, { expiresIn: process.env.JWT_EXPIRY });

  res.cookie("token", token);

  res.status(200).json(new ApiResponse(200, data, "Login successfully"));

});

const logout = (req, res) => {
  res.cookie(token, "");
  res.status(200).json(new ApiResponse(200, null, "logged out successfully"))
};


export { register, login, logout };
