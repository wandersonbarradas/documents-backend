import { RequestHandler } from "express";

import * as documentsTypesFields from "../services/documentsTypesFields";
import { z } from "zod";

export const getAll: RequestHandler = async (req, res) => {
    const { id_text, id_document_type } = req.params;
    const items = await documentsTypesFields.getAll(
        parseInt(id_text),
        parseInt(id_document_type),
    );
    if (items) {
        return res.json({ fields: items });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const addDocumentTypeField: RequestHandler = async (req, res) => {
    const { id_text, id_document_type } = req.params;
    const addFieldSchema = z.object({
        name: z.string(),
        type: z.string(),
        identifier: z.string(),
    });
    const body = addFieldSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: "Dados inválidos!" });

    const field = await documentsTypesFields.add({
        ...body.data,
        documentTypeId: parseInt(id_document_type),
        documentTypeTextId: parseInt(id_text),
    });
    if (field) {
        return res.json({ field });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const updateDocumentTypeField: RequestHandler = async (req, res) => {
    const { id, id_document_type, id_text } = req.params;
    const updateFieldSchema = z.object({
        name: z.string().optional(),
        type: z.string().optional(),
        identifier: z.string().optional(),
    });
    const body = updateFieldSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: "Dados inválidos!" });

    const updatedField = await documentsTypesFields.update(
        {
            documentTypeId: parseInt(id_document_type),
            documentTypeTextId: parseInt(id_text),
            id: parseInt(id),
        },
        body.data,
    );
    if (updatedField) {
        return res.json({ field: updatedField });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const deleteDocumentTypeField: RequestHandler = async (req, res) => {
    const { id, id_document_type, id_text } = req.params;
    const deletedDocumentField = await documentsTypesFields.remove({
        id: parseInt(id),
        documentTypeId: parseInt(id_document_type),
        documentTypeTextId: parseInt(id_text),
    });
    if (deletedDocumentField) {
        return res.json({ field: deletedDocumentField });
    }

    res.json({ error: "Ocorreu um erro!" });
};
