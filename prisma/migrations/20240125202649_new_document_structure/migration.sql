/*
  Warnings:

  - You are about to drop the column `data` on the `Document` table. All the data in the column will be lost.
  - Added the required column `documentTypeTextId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "data",
ADD COLUMN     "documentTypeTextId" INTEGER NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;
