import { RequestHandler } from "express";
import * as documents from "../services/documents";
import * as documents_types from "../services/documentsTypes";
import { z } from "zod";
import { User } from "@prisma/client";

export const getAll: RequestHandler = async (req, res) => {
    const { page, pageSize, orderKey, orderValue, owner, address, cpf_cnpj } =
        req.query;
    const filter = {
        page: page ? parseInt(page as string) : 1,
        pageSize: pageSize ? parseInt(pageSize as string) : 10,
        order: { [orderKey as string]: orderValue as "asc" | "desc" },
        owner: owner as string,
        cpf_cnpj: cpf_cnpj as string,
        address: address as string,
    };
    console.log("🚀 ~ constgetAll:RequestHandler= ~ filter:", filter);
    const documentsItems = await documents.getAll(filter);
    if (documentsItems) {
        return res.json(documentsItems);
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
    const user = req.user as User;
    const addDocumentSchema = z.object({
        date: z.string().transform((date) => new Date(date)),
        text: z.string(),
        html: z.string(),
        document_type_id: z.number(),
        document_type_text_id: z.number(),
        created_at: z
            .string()
            .transform((date) => new Date(date))
            .optional(),
    });

    const body = addDocumentSchema.safeParse(req.body);
    if (!body.success) {
        return res.json({ error: "Dados inválidos!" });
    }

    const document_type = await documents_types.getOne(
        body.data.document_type_id,
    );
    if (!document_type) {
        return res.json({ error: "Tipo de documento informado não existe!" });
    }

    let nextNumber: string | undefined = undefined;
    if (document_type.has_number) {
        nextNumber =
            (await documents.getNextNumber(
                body.data.document_type_id,
                body.data.date,
            )) || undefined;
    }
    const newDocument = await documents.add({
        ...body.data,
        number: nextNumber,
        user_id: user.id,
    });
    if (newDocument && typeof newDocument !== "string") {
        return res.json({ document: newDocument });
    }
    if (typeof newDocument === "string") {
        return res.json({ error: newDocument });
    }

    res.json({ error: "Ocorreu um erro!" });
};

export const updateDocument: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const user = req.user as User;
    const addDocumentSchema = z.object({
        date: z
            .string()
            .transform((date) => new Date(date))
            .optional(),
        text: z.string().optional(),
        html: z.string().optional(),
        number: z.string().optional(),
        document_type_text_id: z.number().optional(),
        updated_at: z.string().transform((date) => new Date(date)),
    });
    const body = addDocumentSchema.safeParse(req.body);
    if (!body.success) {
        return res.json({ error: "Dados inválidos!" });
    }
    const updatedDocument = await documents.update(parseInt(id), {
        ...body.data,
        last_updated_by: user.id,
    });
    if (updatedDocument && typeof updatedDocument !== "string") {
        return res.json({ document: updatedDocument });
    }
    if (typeof updatedDocument === "string") {
        return res.json({ error: updatedDocument });
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
