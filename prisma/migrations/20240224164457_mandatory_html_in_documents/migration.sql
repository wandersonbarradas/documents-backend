/*
  Warnings:

  - Made the column `html` on table `doc_document` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "doc_document" ALTER COLUMN "html" SET NOT NULL;
