import { RequestHandler } from "express";
import * as users from "../services/users";
import { z } from "zod";
import bcrypt from "bcrypt";
import { generateToken } from "../config/passport";

export const register: RequestHandler = async (req, res) => {
    const registerSchema = z.object({
        email: z.string().email(),
        password: z
            .string()
            .min(6)
            .transform((pass) => bcrypt.hashSync(pass, 10)),
        name: z.string(),
    });
    const body = registerSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: "Dados inválidos!" });

    const newUser = await users.addUser({
        ...body.data,
        createdAt: new Date(),
    });
    if (newUser) {
        return res.json({ user: newUser });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const login: RequestHandler = async (req, res) => {
    const authSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });
    const body = authSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: "Dados inválidos!" });
    const user = await users.getUserFromEmail(body.data.email);
    if (!user) return res.json({ error: "Usuário não encontrado!" });
    bcrypt.compare(body.data.password, user.password, (err, hash) => {
        if (hash) {
            const token = generateToken({ id: user.id, email: user.email });
            return res.json({ token, status: true });
        } else {
            if (err) {
                console.log(
                    "🚀 ~ file: auth.ts:46 ~ bcrypt.compare ~ err:",
                    err,
                );
            }
            res.status(401);
            return res.json({
                error: "Senha Incorreta!",
                status: false,
            });
        }
    });
};

export const isLoggedIn: RequestHandler = (req, res) => {
    res.json({ status: true });
};
