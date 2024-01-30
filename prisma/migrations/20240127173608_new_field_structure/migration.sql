/*
  Warnings:

  - You are about to drop the column `fieldName` on the `DocumentField` table. All the data in the column will be lost.
  - You are about to drop the column `fieldType` on the `DocumentField` table. All the data in the column will be lost.
  - You are about to drop the column `fieldName` on the `DocumentTypeField` table. All the data in the column will be lost.
  - You are about to drop the column `fieldType` on the `DocumentTypeField` table. All the data in the column will be lost.
  - Added the required column `name` to the `DocumentField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `DocumentField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `DocumentField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `DocumentTypeField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `DocumentTypeField` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DocumentField" DROP COLUMN "fieldName",
DROP COLUMN "fieldType",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DocumentTypeField" DROP COLUMN "fieldName",
DROP COLUMN "fieldType",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
