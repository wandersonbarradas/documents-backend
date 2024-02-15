-- AlterTable
ALTER TABLE "doc_document" ALTER COLUMN "last_updated_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "doc_document_type" ALTER COLUMN "last_updated_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "doc_document_type_text" ALTER COLUMN "last_updated_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "doc_user" ADD COLUMN     "created_by" INTEGER;
