import { PrismaClient } from "@prisma/client";
import { extractCertificationNumber } from "../utils/decodedNumberDocument";

const prisma = new PrismaClient();

const include = { documentType: true };

export const getAll = async () => {
    try {
        return await prisma.document.findMany({
            include,
        });
    } catch (error) {
        console.log("🚀 ~ getAll ~ error:", error);
        return false;
    }
};

export const getOne = async (id: number) => {
    try {
        return await prisma.document.findFirst({ where: { id }, include });
    } catch (error) {
        console.log("🚀 ~ getOne ~ error:", error);
        return false;
    }
};

type AddDocumentData = {
    number: string;
    text: string;
    date: Date;
    documentTypeId: number;
    documentTypeTextId: number;
};

export const add = async (data: AddDocumentData) => {
    try {
        return await prisma.document.create({
            data: {
                documentTypeTextId: data.documentTypeTextId,
                documentTypeId: data.documentTypeId,
                number: data.number,
                text: data.text,
                date: data.date,
            },
            include,
        });
    } catch (error) {
        console.log("🚀 ~ add ~ error:", error);
        return false;
    }
};

type UpdateDocumentData = {
    number?: string;
    text?: string;
    date?: Date;
    documentTypeId?: number;
    documentTypeTextId?: number;
};

export const update = async (id: number, data: UpdateDocumentData) => {
    try {
        return await prisma.document.update({
            where: { id },
            data: {
                date: data.date,
                documentTypeId: data.documentTypeId,
                documentTypeTextId: data.documentTypeTextId,
                number: data.number,
                text: data.text,
            },
            include,
        });
    } catch (error) {
        console.log("🚀 ~ add ~ error:", error);
        return false;
    }
};

export const remove = async (id: number) => {
    try {
        return await prisma.document.delete({ where: { id } });
    } catch (error) {
        console.log("🚀 ~ remove ~ error:", error);
        return false;
    }
};

export const getNextNumber = async (documentTypeId: number) => {
    const currentYear = new Date().getFullYear();
    try {
        const lastDocument = await prisma.document.findFirst({
            where: {
                AND: {
                    documentTypeId: { equals: documentTypeId },
                    number: { contains: `/${currentYear}` },
                },
            },
            orderBy: {
                number: "desc",
            },
        });
        const lastNumber = lastDocument
            ? extractCertificationNumber(lastDocument.number)
            : 0;
        const nextNumber = lastNumber + 1;
        return `${nextNumber}/${currentYear}`;
    } catch (error) {
        console.log("🚀 ~ getNextNumber ~ error:", error);
        return false;
    }
};
