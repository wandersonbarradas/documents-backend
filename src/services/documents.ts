import { Prisma, PrismaClient } from "@prisma/client";
import { extractCertificationNumber } from "../utils/decodedNumberDocument";
import { getErrorFromPrisma } from "../utils/getErrorFromPrisma";

const prisma = new PrismaClient();

const include = { document_type: true };
type Filters = {
    page: number;
    pageSize: number;
    order?: { [key: string]: "asc" | "desc" };
    owner?: string;
    cpf_cnpj?: string;
    address?: string;
};
export const getAll = async (filters: Filters) => {
    try {
        const totalCount = await prisma.document.count({
            where: {
                AND: [
                    {
                        text: {
                            contains: filters.owner,
                            mode: "insensitive",
                        },
                    },
                    {
                        text: {
                            contains: filters.cpf_cnpj,
                            mode: "insensitive",
                        },
                    },
                    {
                        text: {
                            contains: filters.address,
                            mode: "insensitive",
                        },
                    },
                ],
            },
        });
        const documents = await prisma.document.findMany({
            take: filters.pageSize,
            skip: (filters.page - 1) * filters.pageSize,
            where: {
                AND: [
                    {
                        text: {
                            contains: filters.owner,
                            mode: "insensitive",
                        },
                    },
                    {
                        text: {
                            contains: filters.cpf_cnpj,
                            mode: "insensitive",
                        },
                    },
                    {
                        text: {
                            contains: filters.address,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            include,
            orderBy: filters.order,
        });
        return {
            documents,
            totalCount,
        };
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
        return getErrorFromPrisma(error);
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
        return getErrorFromPrisma(error);
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

export const getNextNumber = async (documentTypeId: number, date: Date) => {
    const currentYear = date.getFullYear();
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
