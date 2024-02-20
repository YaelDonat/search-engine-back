/*
  Warnings:

  - Added the required column `imgUrl` to the `Livre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Livre" ADD COLUMN     "imgUrl" TEXT NOT NULL;
