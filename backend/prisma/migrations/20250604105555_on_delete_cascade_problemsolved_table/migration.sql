-- DropForeignKey
ALTER TABLE "problemSolved" DROP CONSTRAINT "problemSolved_problemId_fkey";

-- AddForeignKey
ALTER TABLE "problemSolved" ADD CONSTRAINT "problemSolved_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
