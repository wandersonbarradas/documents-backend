import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOne = async (id: number, documentTypeId?: number) => {
    try {
        return await prisma.documentTypeText.findFirst({
            where: { id, documentTypeId },
        });
    } catch (error) {
        console.log("🚀 ~ getOne ~ error:", error);
        return false;
    }
};

type AddDocumentType = {
    text: string;
    name: string;
};
export const add = async (documentTypeId: number, data: AddDocumentType) => {
    try {
        return await prisma.documentTypeText.create({
            data: { ...data, documentTypeId },
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
type UpdateDocumentType = {
    text?: string;
    name?: string;
};

export const update = async (
    filters: UpdateFilters,
    data: UpdateDocumentType,
) => {
    try {
        return await prisma.documentTypeText.update({
            where: { id: filters.id, documentTypeId: filters.documentTypeId },
            data,
        });
    } catch (error) {
        console.log("🚀 ~ add ~ error:", error);
        return false;
    }
};

export const remove = async (id: number, documentTypeId?: number) => {
    try {
        await prisma.documentTypeField.deleteMany({
            where: { documentTypeTextId: id },
        });
        return await prisma.documentTypeText.delete({
            where: { id, documentTypeId },
        });
    } catch (error) {
        console.log("🚀 ~ add ~ error:", error);
        return false;
    }
};
