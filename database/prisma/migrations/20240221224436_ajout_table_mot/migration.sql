/*
  Warnings:

  - A unique constraint covering the columns `[bookid]` on the table `Livre` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Livre_bookid_key" ON "Livre"("bookid");
