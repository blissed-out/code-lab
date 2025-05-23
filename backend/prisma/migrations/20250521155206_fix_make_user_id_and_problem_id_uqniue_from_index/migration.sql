/*
  Warnings:

  - A unique constraint covering the columns `[userId,problemId]` on the table `problemSolved` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "problemSolved_userId_problemId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "problemSolved_userId_problemId_key" ON "problemSolved"("userId", "problemId");
