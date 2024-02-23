/*
  Warnings:

  - A unique constraint covering the columns `[mot]` on the table `Mot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Mot_mot_key" ON "Mot"("mot");
