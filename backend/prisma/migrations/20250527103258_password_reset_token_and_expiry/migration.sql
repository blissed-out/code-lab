/*
  Warnings:

  - A unique constraint covering the columns `[passwordToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordToken" TEXT,
ADD COLUMN     "passwordTokenExpiry" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "User_passwordToken_key" ON "User"("passwordToken");
