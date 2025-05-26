import { db } from "../libs/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import { Role } from "../generated/prisma/index.js";
import ApiResponse from "../utils/api-response.js";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { sendEmailToUser } from "../utils/mail.js";

export const register = asyncHandler(async (req, res) => {
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

  const token = crypto.randomBytes(32).toString("hex");

  // send mail to user
  await sendEmailToUser(token);

  const expiryTime = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

  const newUser = await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: Role.USER,
      emailToken: token,
      tokenExpiry: expiryTime,
    },
  });

  const data = {
    name: newUser.name,
    email: newUser.email,
  };

  res
    .status(200)
    .json(new ApiResponse(200, data, "user registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    return res
      .status(401)
      .json(new ApiResponse(401, email, "User is not registered"));
  }

  const hashedPassword = existingUser.password;

  const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json(new ApiResponse(401, email, "Incorrect credentials"));
  }

  const token = jwt.sign(
    existingUser.id,
    process.env.JWT_SECRET_KEY,
    {
      algorithm: "HS256",
    },
    { expiresIn: process.env.JWT_EXPIRY },
  );

  const cookieOption = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENVIRONMENT !== "development",
  };

  res.cookie("token", token, cookieOption);

  const data = {
    name: existingUser.name,
    email: existingUser.email,
  };

  res.status(200).json(new ApiResponse(200, data, "Login successfully"));
});

export const logout = (req, res) => {
  res.cookie("token", "", {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENVIRONMENT !== "development",
  });
  res.status(200).json(new ApiResponse(200, null, "logged out successfully"));
};

export const verifyEmail = asyncHandler(async (req, res) => {
  // get data
  // validate data
  // send response and set value isEmailVerified to true

  const { token } = req.params;

  if (!token) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid token"));
  }

  const user = await db.user.findUnique({
    where: {
      emailToken: token,
    },
    select: {
      email: true,
      name: true,
      role: true,
      emailToken: true,
      tokenExpiry: true,
    },
  });

  if (!user) {
    return res.status(403).json(new ApiResponse(403, null, "Invalid token"));
  }

  // check token expiration

  const expiryTime = Number(user.tokenExpiry);

  if (expiryTime <= Date.now()) {
    return res.status(401).json(new ApiResponse(401, null, "Token expired"));
  }

  if (token !== user.emailToken) {
    return res.status(401).json(new ApiResponse(403, null, "Invalid token"));
  }

  await db.user.update({
    where: {
      emailToken: token,
    },

    data: {
      emailToken: null,
      isEmailVerified: true,
      tokenExpiry: null,
    },
  });

  const data = {
    email: user.email,
    name: user.name,
    role: user.role,
  };

  res
    .status(200)
    .json(new ApiResponse(200, data, "User verified successfully"));
});

export const check = asyncHandler(async (req, res) => {
  const data = {
    user: user.req.user,
  };

  res
    .status(200)
    .json(new ApiResponse(200, data, "User authentication successfull"));
});
