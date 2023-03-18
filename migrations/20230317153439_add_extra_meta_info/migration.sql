/*
  Warnings:

  - Added the required column `authorId` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unsplashSearchQuery` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "unsplashSearchQuery" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UnsplashAuthor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "UnsplashAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnsplashAuthor_id_key" ON "UnsplashAuthor"("id");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UnsplashAuthor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
