/*
  Warnings:

  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `User` table. All the data in the column will be lost.
  - Added the required column `file` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content",
DROP COLUMN "imageUrl",
ADD COLUMN     "file" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "imageUrl",
ALTER COLUMN "name" SET NOT NULL;
