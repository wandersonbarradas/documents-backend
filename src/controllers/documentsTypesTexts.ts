import { RequestHandler } from "express";
import { z } from "zod";
import * as documentsTypesTexts from "../services/documentsTypesTexts";

export const getAll: RequestHandler = async (req, res) => {
    const { id_document_type } = req.params;
    const items = await documentsTypesTexts.getAllByDocumentType(
        parseInt(id_document_type),
    );
    if (items) {
        return res.json({ documentsTypesTexts: items });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const getDocumentTypeText: RequestHandler = async (req, res) => {
    const { id, id_document_type } = req.params;
    const documentTypeTextItem = await documentsTypesTexts.getOne(
        parseInt(id),
        parseInt(id_document_type),
    );
    if (documentTypeTextItem) {
        return res.json({ documentTypeText: documentTypeTextItem });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const addDocumentTypeText: RequestHandler = async (req, res) => {
    const { id_document_type } = req.params;
    const addDocumentTypeTextSchema = z.object({
        text: z.string(),
        name: z.string(),
    });
    const body = addDocumentTypeTextSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: "Dados inválidos!" });

    const newDocumentTypeText = await documentsTypesTexts.add(
        parseInt(id_document_type),
        body.data,
    );
    if (newDocumentTypeText) {
        return res.json({ documentTypeText: newDocumentTypeText });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const updateDocumentTypeText: RequestHandler = async (req, res) => {
    const { id, id_document_type } = req.params;
    const updateDocumentTypeTextSchema = z.object({
        text: z.string().optional(),
        name: z.string().optional(),
    });
    const body = updateDocumentTypeTextSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: "Dados inválidos!" });

    const updatedDocumentTypeText = await documentsTypesTexts.update(
        { id: parseInt(id), documentTypeId: parseInt(id_document_type) },
        req.body,
    );
    if (updatedDocumentTypeText) {
        return res.json({ documentTypeText: updatedDocumentTypeText });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const deleteDocumentTypeText: RequestHandler = async (req, res) => {
    const { id, id_document_type } = req.params;
    const deletedDocumentTypeText = await documentsTypesTexts.remove(
        parseInt(id),
        parseInt(id_document_type),
    );
    if (deletedDocumentTypeText) {
        return res.json({ documentTypeText: deletedDocumentTypeText });
    }

    res.json({ error: "Ocorreu um erro!" });
};
