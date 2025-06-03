import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis;

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    omit: {
      user: {
        password: true,
        emailToken: true,
        tokenExpiry: true,
        passwordToken: true,
        passwordTokenExpiry: true,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
