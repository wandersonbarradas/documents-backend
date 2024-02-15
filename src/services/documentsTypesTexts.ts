import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllByDocumentType = async (documentTypeId: number) => {
    try {
        return await prisma.documentTypeText.findMany({
            where: { document_type_id: documentTypeId },
        });
    } catch (error) {
        console.log("🚀 ~ getAll ~ error:", error);
        return false;
    }
};

export const getOne = async (id: number, documentTypeId?: number) => {
    try {
        return await prisma.documentTypeText.findFirst({
            where: { id, document_type_id: documentTypeId },
        });
    } catch (error) {
        console.log("🚀 ~ getOne ~ error:", error);
        return false;
    }
};

type AddDocumentTypeTextData = Prisma.Args<
    typeof prisma.documentTypeText,
    "create"
>["data"];
export const add = async (data: AddDocumentTypeTextData) => {
    try {
        return await prisma.documentTypeText.create({
            data,
        });
    } catch (error) {
        console.log("🚀 ~ add ~ error:", error);
        return false;
    }
};

type UpdateFilters = {
    id: number;
    documentTypeId?: number;
};
type UpdateDocumentTypeTextData = Prisma.Args<
    typeof prisma.documentTypeText,
    "update"
>["data"];

export const update = async (
    filters: UpdateFilters,
    data: UpdateDocumentTypeTextData,
) => {
    try {
        return await prisma.documentTypeText.update({
            where: { id: filters.id, document_type_id: filters.documentTypeId },
            data,
        });
    } catch (error) {
        console.log("🚀 ~ add ~ error:", error);
        return false;
    }
};

export const remove = async (id: number, documentTypeId?: number) => {
    try {
        return await prisma.documentTypeText.delete({
            where: { id, document_type_id: documentTypeId },
        });
    } catch (error) {
        console.log("🚀 ~ add ~ error:", error);
        return false;
    }
};
