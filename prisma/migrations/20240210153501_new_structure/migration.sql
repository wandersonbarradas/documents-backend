/*
  Warnings:

  - You are about to drop the `DocumentField` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DocumentTypeField` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DocumentField" DROP CONSTRAINT "DocumentField_documentId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentTypeField" DROP CONSTRAINT "DocumentTypeField_documentTypeId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentTypeField" DROP CONSTRAINT "DocumentTypeField_documentTypeTextId_fkey";

-- DropTable
DROP TABLE "DocumentField";

-- DropTable
DROP TABLE "DocumentTypeField";
