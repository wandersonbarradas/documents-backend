import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserFromId = async (id: number) => {
    try {
        return await prisma.user.findFirst({ where: { id } });
    } catch (error) {
        console.log("🚀 ~ getUserFromId ~ error:", error);
        return false;
    }
};

export const getUserFromEmail = async (email: string) => {
    try {
        return await prisma.user.findFirst({ where: { email } });
    } catch (error) {
        console.log("🚀 ~ getUserFromId ~ error:", error);
        return false;
    }
};

type AddUser = Prisma.Args<typeof prisma.user, "create">["data"];

export const addUser = async (data: AddUser) => {
    try {
        return await prisma.user.create({
            data,
            select: { createdAt: true, email: true, name: true, id: true },
        });
    } catch (error) {
        console.log("🚀 ~ addUser ~ error:", error);
        return false;
    }
};
