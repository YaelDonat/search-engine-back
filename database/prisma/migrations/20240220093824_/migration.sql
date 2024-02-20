/*
  Warnings:

  - You are about to drop the column `txtUrl` on the `Livre` table. All the data in the column will be lost.
  - Added the required column `bookid` to the `Livre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Livre" DROP COLUMN "txtUrl",
ADD COLUMN     "bookid" TEXT NOT NULL;
