import { RequestHandler } from "express";
import * as documentsTypes from "../services/documentsTypes";
import { z } from "zod";
import { User } from "@prisma/client";

export const getAll: RequestHandler = async (req, res) => {
    const items = await documentsTypes.getAll();
    if (items) {
        return res.json({ documents: items });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const getDocumentType: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const documentItem = await documentsTypes.getOne(parseInt(id));
    if (documentItem) {
        return res.json({ document: documentItem });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const addDocumentType: RequestHandler = async (req, res) => {
    const user = req.user as User;
    const addDocumentTypeSchema = z.object({
        name: z.string(),
        validity: z.number(),
        title: z.string(),
        expires: z.boolean(),
        has_number: z.boolean(),
        created_at: z
            .string()
            .transform((date) => new Date(date))
            .optional(),
    });
    const body = addDocumentTypeSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: "Dados inválidos!" });

    const newDocumentType = await documentsTypes.add({
        ...body.data,
        user_id: user.id,
    });
    if (newDocumentType) {
        return res.json({ document: newDocumentType });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const updateDocumentType: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const user = req.user as User;
    const updateDocumentTypeSchema = z.object({
        name: z.string().optional(),
        validity: z.number().optional(),
        title: z.string().optional(),
        expires: z.boolean().optional(),
        has_number: z.boolean().optional(),
        updated_at: z.string().transform((date) => new Date(date)),
    });
    const body = updateDocumentTypeSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: "Dados inválidos!" });

    const updatedDocumentType = await documentsTypes.update(parseInt(id), {
        ...body.data,
        last_updated_by: user.id,
    });

    if (updatedDocumentType) {
        return res.json({ document: updatedDocumentType });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const deleteDocumentType: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const deletedDocumentType = await documentsTypes.remove(parseInt(id));
    if (deletedDocumentType) {
        return res.json({ document: deletedDocumentType });
    }

    res.json({ error: "Ocorreu um erro!" });
};
