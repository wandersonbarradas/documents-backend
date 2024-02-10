import { RequestHandler } from "express";
import * as documents from "../services/documents";
import { z } from "zod";

export const getAll: RequestHandler = async (req, res) => {
    const documentsItems = await documents.getAll();
    if (documentsItems) {
        return res.json({ documents: documentsItems });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const getDocument: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const documentItem = await documents.getOne(parseInt(id));
    if (documentItem) {
        return res.json({ document: documentItem });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const addDocument: RequestHandler = async (req, res) => {
    const addDocumentSchema = z.object({
        date: z.string().transform((date) => new Date(date)),
        text: z.string(),
        documentTypeId: z.number(),
        documentTypeTextId: z.number(),
    });

    const body = addDocumentSchema.safeParse(req.body);
    if (!body.success) {
        return res.json({ error: "Dados inválidos!" });
    }

    const nextNumber = await documents.getNextNumber(body.data.documentTypeId);
    if (nextNumber) {
        const newDocument = await documents.add({
            ...body.data,
            number: nextNumber,
        });
        if (newDocument) {
            return res.json({ document: newDocument });
        }
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const updateDocument: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const addDocumentSchema = z.object({
        date: z.string().transform((date) => new Date(date)),
        text: z.string().optional(),
        documentTypeId: z.number().optional(),
        number: z.string().optional(),
        documentTypeTextId: z.number().optional(),
    });
    const body = addDocumentSchema.safeParse(req.body);
    if (!body.success) {
        return res.json({ error: "Dados inválidos!" });
    }

    const updatedDocument = await documents.update(parseInt(id), body.data);
    if (updatedDocument) {
        return res.json({ document: updatedDocument });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const deleteDocument: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const deletedDocument = await documents.remove(parseInt(id));
    if (deletedDocument) {
        return res.json({ document: deletedDocument });
    }

    res.json({ error: "Ocorreu um erro!" });
};
