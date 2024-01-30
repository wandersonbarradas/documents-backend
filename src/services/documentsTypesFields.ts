import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getAll = async (
    documentTypeTextId?: number,
    documentTypeId?: number,
) => {
    try {
        return await prisma.documentTypeField.findMany({
            where: { documentTypeTextId, documentTypeId },
        });
    } catch (error) {
        console.log("🚀 ~ getAll ~ error:", error);
        return false;
    }
};

type AddFieldData = Prisma.Args<
    typeof prisma.documentTypeField,
    "create"
>["data"];

export const add = async (data: AddFieldData) => {
    try {
        return await prisma.documentTypeField.create({
            data: data,
        });
    } catch (error) {
        console.log("🚀 ~ add ~ error:", error);
        return false;
    }
};

type UpdateFilters = {
    id: number;
    documentTypeId: number;
    documentTypeTextId: number;
};

type UpdateFieldData = Prisma.Args<
    typeof prisma.documentTypeField,
    "update"
>["data"];

export const update = async (filters: UpdateFilters, data: UpdateFieldData) => {
    try {
        return await prisma.documentTypeField.update({
            where: filters,
            data: data,
        });
    } catch (error) {
        console.log("🚀 ~ add ~ error:", error);
        return false;
    }
};

export const remove = async (filters: UpdateFilters) => {
    try {
        return await prisma.documentTypeField.delete({
            where: filters,
        });
    } catch (error) {
        console.log("🚀 ~ remove ~ error:", error);
        return false;
    }
};
