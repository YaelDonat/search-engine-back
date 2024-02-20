-- CreateTable
CREATE TABLE "Livre" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "txtUrl" TEXT NOT NULL,

    CONSTRAINT "Livre_pkey" PRIMARY KEY ("id")
);
