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
      .status(409)
      .json(new ApiResponse(409, null, "Email already registered"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const token = crypto.randomBytes(32).toString("hex");

  // send mail to user
  const userEmailVerificationURL = `${process.env.HOST}:${process.env.PORT}/api/v1/auth/verifyEmail/${token}`;
  await sendEmailToUser(userEmailVerificationURL);

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

    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      password: true,
    },
  });

  if (!existingUser) {
    return res
      .status(401)
      .json(new ApiResponse(404, email, "Invalid credentials"));
    {
    }
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

  const user = {
    name: existingUser.name,
    email: existingUser.email,
    image: existingUser.image,
    role: existingUser.role,
  };

  res.status(200).json(new ApiResponse(200, user, "Login successfully"));
});

export const logout = (req, res) => {
  res.cookie("token", "", {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENVIRONMENT !== "development",
  });
  res.status(204).end();
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
    ...req.user,
  };

  res
    .status(200)
    .json(new ApiResponse(200, data, "User authentication successful"));
});

export const sendResetPassword = asyncHandler(async (req, res) => {
  // get email from user
  // check if user existingUser
  // generate token
  // send password reset link to user's email
  // save token in db

  const { email } = req.body;

  const user = await db.user.findUnique({
    where: {
      email,
    },

    select: {
      email: true,
    },
  });

  console.log("this is user found in sendResetPassword: ", user);

  if (!user) {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "User not registered"));
  }

  // generate token
  const token = crypto.randomBytes(32).toString("hex");
  const expiryTime = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

  console.log(`Token: ${token}, expiryTime: ${expiryTime}`);

  // set token in db with expiry time
  await db.user.create({
    where: {
      email,
    },

    data: {
      passwordToken: token,
      passwordTokenExpiry: expiryTime,
    },
  });

  // email the reset password link
  const passwordResetURL = `${process.env.HOST}:${process.env.PORT}/api/v1/auth/reset-password/${token}`;
  await sendEmailToUser(passwordResetURL);

  res
    .status(200)
    .json(new ApiResponse(200, email, "reset password link send successfully"));
});

export const resetPassword = asyncHandler(async (req, res) => {
  // get token from url
  // validate token (existance, expiryTime)
  // allow user to reset passsword
  // save the password
  // remove password token and tokenExpiry to null

  const { token } = req.parmas;

  console.log("token comming from resetPassword (after mail): ", token);

  if (!token) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid token"));
  }

  // check if token exists in db
  const user = await db.user.findUnique({
    where: {
      passwordToken: token,
    },

    select: {
      email: true,
      passwordTokenExpiry: true,
    },
  });

  console.log("user in resetPassword controller: ", user);

  if (!user) {
    return res.status(403).json(new ApiResponse(403, null, "Invalid token"));
  }

  // check expiryTime
  if (user.passwordTokenExpiry <= Date.now()) {
    return res.status(403).json(new ApiResponse(403, null, "Token Expired"));
  }

  // allow user to set new password
  const { newPassword, confirmPassword } = req.body;

  if (newPassword != confirmPassword) {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "password not matched"));
  }

  const hashedPassword = await bcrypt.hash(confirmPassword, 10);

  console.log("hashedPassword in reset password controller", hashedPassword);

  await db.user.update({
    where: {
      email: user.email,
    },

    data: {
      password: hashedPassword,
      passwordToken: null,
      passwordTokenExpiry: null,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, user.email, "Password reset succssful"));
});
