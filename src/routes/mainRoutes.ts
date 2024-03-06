import { Request, Response, Router } from "express";
import * as documentsTypes from "../controllers/documentsTypes";
import * as documents from "../controllers/documents";
import * as documentsTypesTexts from "../controllers/documentsTypesTexts";
import * as auth from "../controllers/auth";
import * as utils from "../controllers/utils";
import { privateRouter } from "../config/passport";
const router = Router();

router.get("/ping", (req: Request, res: Response) => {
    res.json({ pong: true });
});

router.get("/documents/pdf/:id", privateRouter, utils.generatePDF);

//Auth
router.post("/auth/register", privateRouter, auth.register);
router.post("/auth/login", auth.login);
router.get("/auth/isLoggedIn", privateRouter, auth.isLoggedIn);
//Documents types
router.get("/documents-types", privateRouter, documentsTypes.getAll);
router.get(
    "/documents-types/:id",
    privateRouter,
    documentsTypes.getDocumentType,
);
router.post("/documents-types/", privateRouter, documentsTypes.addDocumentType);
router.put(
    "/documents-types/:id",
    privateRouter,
    documentsTypes.updateDocumentType,
);
router.delete(
    "/documents-types/:id",
    privateRouter,
    documentsTypes.deleteDocumentType,
);
//Texts
router.get(
    "/documents-types/:id_document_type/texts/",
    privateRouter,
    documentsTypesTexts.getAll,
);
router.get(
    "/documents-types/:id_document_type/texts/:id",
    privateRouter,
    documentsTypesTexts.getDocumentTypeText,
);
router.post(
    "/documents-types/:id_document_type/texts",
    privateRouter,
    documentsTypesTexts.addDocumentTypeText,
);
router.put(
    "/documents-types/:id_document_type/texts/:id",
    privateRouter,
    documentsTypesTexts.updateDocumentTypeText,
);
router.delete(
    "/documents-types/:id_document_type/texts/:id",
    privateRouter,
    documentsTypesTexts.deleteDocumentTypeText,
);
//Documents
router.get("/documents", privateRouter, documents.getAll);
router.get("/documents", privateRouter, documents.getAll);
router.get("/documents/:id", privateRouter, documents.getDocument);
router.post("/documents", privateRouter, documents.addDocument);
router.put("/documents/:id", privateRouter, documents.updateDocument);
router.delete("/documents/:id", privateRouter, documents.deleteDocument);

export default router;
