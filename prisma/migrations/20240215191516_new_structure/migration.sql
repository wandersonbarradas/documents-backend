-- CreateTable
CREATE TABLE "doc_user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doc_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doc_document_type" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "validity" INTEGER NOT NULL,
    "expires" BOOLEAN NOT NULL,
    "has_number" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,

    CONSTRAINT "doc_document_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doc_document_type_text" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "document_type_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,

    CONSTRAINT "doc_document_type_text_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doc_document" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "document_type_id" INTEGER NOT NULL,
    "document_type_text_id" INTEGER NOT NULL,
    "number" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_by" INTEGER NOT NULL,

    CONSTRAINT "doc_document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doc_user_email_key" ON "doc_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doc_document_type_name_key" ON "doc_document_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "doc_document_type_text_name_document_type_id_key" ON "doc_document_type_text"("name", "document_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "doc_document_number_document_type_id_key" ON "doc_document"("number", "document_type_id");

-- AddForeignKey
ALTER TABLE "doc_document_type" ADD CONSTRAINT "doc_document_type_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "doc_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_document_type_text" ADD CONSTRAINT "doc_document_type_text_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "doc_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_document_type_text" ADD CONSTRAINT "doc_document_type_text_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "doc_document_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_document" ADD CONSTRAINT "doc_document_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "doc_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_document" ADD CONSTRAINT "doc_document_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "doc_document_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_document" ADD CONSTRAINT "doc_document_document_type_text_id_fkey" FOREIGN KEY ("document_type_text_id") REFERENCES "doc_document_type_text"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
