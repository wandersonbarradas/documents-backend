import { Prisma, PrismaClient } from "@prisma/client";
import { extractCertificationNumber } from "../utils/decodedNumberDocument";

const prisma = new PrismaClient();

const include = { document_type: true };

export const getAll = async () => {
    try {
        return await prisma.document.findMany({
            // where: {
            //     text: {
            //         contains: "wanDerSon",
            //         mode: "insensitive",
            //     },
            // },
            include,
            orderBy: {
                id: "asc",
            },
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

type AddDocumentData = Prisma.Args<typeof prisma.document, "create">["data"];

export const add = async (data: AddDocumentData) => {
    try {
        return await prisma.document.create({
            data,
            include,
        });
    } catch (error) {
        console.log("🚀 ~ add ~ error:", error);
        return false;
    }
};

type UpdateDocumentData = Prisma.Args<typeof prisma.document, "update">["data"];

export const update = async (id: number, data: UpdateDocumentData) => {
    try {
        return await prisma.document.update({
            where: { id },
            data,
            include,
        });
    } catch (error) {
        console.log("🚀 ~ update ~ error:", error);
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
                    document_type_id: { equals: documentTypeId },
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
