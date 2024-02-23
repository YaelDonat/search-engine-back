-- CreateTable
CREATE TABLE "Mot" (
    "id" SERIAL NOT NULL,
    "mot" TEXT NOT NULL,
    "nbOccurrences" INTEGER NOT NULL,
    "livreId" INTEGER NOT NULL,

    CONSTRAINT "Mot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mot" ADD CONSTRAINT "Mot_livreId_fkey" FOREIGN KEY ("livreId") REFERENCES "Livre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
