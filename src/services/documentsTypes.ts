import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getAll = async () => {
    try {
        return await prisma.documentType.findMany();
    } catch (error) {
        console.log("🚀 ~ getAll ~ error:", error);
        return false;
    }
};

export const getOne = async (id: number) => {
    try {
        return await prisma.documentType.findFirst({
            where: { id },
            include: { texts: true },
        });
    } catch (error) {
        console.log("🚀 ~ getOne ~ error:", error);
        return false;
    }
};

type AddDocumentData = Prisma.Args<
    typeof prisma.documentType,
    "create"
>["data"];
export const add = async (data: AddDocumentData) => {
    try {
        return await prisma.documentType.create({
            data,
        });
    } catch (error) {
        console.log("🚀 ~ add ~ error:", error);
        return false;
    }
};

type UpdateDocumentData = Prisma.Args<
    typeof prisma.documentType,
    "update"
>["data"];
export const update = async (id: number, data: UpdateDocumentData) => {
    try {
        return await prisma.documentType.update({
            where: { id },
            data,
        });
    } catch (error) {
        console.log("🚀 ~ add ~ error:", error);
        return false;
    }
};

export const remove = async (id: number) => {
    try {
        await prisma.documentTypeText.deleteMany({
            where: { document_type_id: id },
        });
        return await prisma.documentType.delete({ where: { id } });
    } catch (error) {
        console.log("🚀 ~ remove ~ error:", error);
        return false;
    }
};
