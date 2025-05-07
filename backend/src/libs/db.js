import { PrismaClient } from "../generated/prisma/client.js";

const globalForPrisma = globalThis;

export const db = new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;
