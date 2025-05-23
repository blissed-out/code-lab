/*
  Warnings:

  - You are about to drop the column `example` on the `Problem` table. All the data in the column will be lost.
  - The primary key for the `TokenBlackList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `examples` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "example",
ADD COLUMN     "examples" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "TokenBlackList" DROP CONSTRAINT "TokenBlackList_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TokenBlackList_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TokenBlackList_id_seq";
