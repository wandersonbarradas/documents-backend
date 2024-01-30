-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_documentTypeTextId_fkey" FOREIGN KEY ("documentTypeTextId") REFERENCES "DocumentTypeText"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
