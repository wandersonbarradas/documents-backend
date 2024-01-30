import { isLoggedIn } from "./../controllers/auth";
import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";

let documentTypeId = 0;
let documentTypeTextId = 0;
let documentTypeFieldId = 0;
let documentId = 0;
let documentId2 = 0;
let documentFieldId = 0;
let userId = 0;
let token = "";
let email = "wandersonbarradas07@gmail.com";
let password = "12345678";

describe("Testando rotas de Auth", () => {
    it("deve registrar um novo usuario", (done) => {
        const body = {
            name: "Wanderson Barradas",
            email,
            password,
        };
        request(app)
            .post("/auth/register")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.user).toHaveProperty("id");
                expect(response.body.user.name).toBe(body.name);
                expect(response.body.user.email).toBe(body.email);
                userId = response.body.user.id;
                return done();
            });
    });

    it("não deve registrar um novo usuario com email existente", (done) => {
        const body = {
            name: "João da silva",
            email,
            password,
        };
        request(app)
            .post("/auth/register")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve registrar um novo usuario se password tiver menos de 6 caracteres", (done) => {
        const body = {
            name: "João da silva",
            email: "joãodasilva@gmail.com",
            password: "12345",
        };
        request(app)
            .post("/auth/register")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve registrar um novo usuario sem password", (done) => {
        const body = {
            name: "João da silva",
            email: "joãodasilva@gmail.com",
        };
        request(app)
            .post("/auth/register")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve registrar um novo usuario sem email", (done) => {
        const body = {
            name: "João da silva",
            password,
        };
        request(app)
            .post("/auth/register")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve registrar um novo usuario sem nome", (done) => {
        const body = {
            email: "João da silva",
            password,
        };
        request(app)
            .post("/auth/register")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve registrar um novo usuario se name for um number", (done) => {
        const body = {
            name: 69988557,
            email: "joãodasilva@gmail.com",
            password: "12345",
        };
        request(app)
            .post("/auth/register")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve registrar um novo usuario se password for um number", (done) => {
        const body = {
            name: "João da silva",
            email: "joãodasilva@gmail.com",
            password: 12345,
        };
        request(app)
            .post("/auth/register")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("deve fazer login", (done) => {
        request(app)
            .post("/auth/login")
            .send({ email, password })
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.status).toBeTruthy();
                expect(response.body.token).not.toBeUndefined();
                token = response.body.token;
                return done();
            });
    });

    it("não deve fazer login com email incorreto", (done) => {
        request(app)
            .post("/auth/login")
            .send({ email: "blabla@gmail.com", password })
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                expect(response.body.status).toBeFalsy();
                expect(response.body.token).toBeUndefined();
                return done();
            });
    });

    it("não deve fazer login com password incorreto", (done) => {
        request(app)
            .post("/auth/login")
            .send({ email, password: "dfsff565" })
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                expect(response.body.status).toBeFalsy();
                expect(response.body.token).toBeUndefined();
                return done();
            });
    });

    it("não deve fazer login sem email", (done) => {
        request(app)
            .post("/auth/login")
            .send({ password: "dfsff565" })
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                expect(response.body.status).toBeFalsy();
                expect(response.body.token).toBeUndefined();
                return done();
            });
    });

    it("não deve fazer login sem password", (done) => {
        request(app)
            .post("/auth/login")
            .send({ email })
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                expect(response.body.status).toBeFalsy();
                expect(response.body.token).toBeUndefined();
                return done();
            });
    });

    it("não deve fazer login sem password e email", (done) => {
        request(app)
            .post("/auth/login")
            .send({})
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                expect(response.body.status).toBeFalsy();
                expect(response.body.token).toBeUndefined();
                return done();
            });
    });

    it("não deve fazer login se email for inválido", (done) => {
        request(app)
            .post("/auth/login")
            .send({ email: "sfshifsfiowjei.com", password })
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                expect(response.body.status).toBeFalsy();
                expect(response.body.token).toBeUndefined();
                return done();
            });
    });

    it("não deve fazer login se password for um numero", (done) => {
        request(app)
            .post("/auth/login")
            .send({ email, password: 598998484 })
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                expect(response.body.status).toBeFalsy();
                expect(response.body.token).toBeUndefined();
                return done();
            });
    });
});

it("Deve retornar true", (done) => {
    request(app)
        .get("/auth/isLoggedIn")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .set("Authorization", `Bearer ${token}`)
        .then((response) => {
            expect(response.body.error).toBeUndefined();
            expect(response.body.status).toBeTruthy();
            return done();
        });
});

describe("Testando rotas de DocumentType", () => {
    // beforeAll(async () => {
    //     const prisma = new PrismaClient();
    //     await prisma.documentField.deleteMany();
    //     await prisma.document.deleteMany();
    //     await prisma.documentTypeField.deleteMany();
    //     await prisma.documentTypeText.deleteMany();
    //     await prisma.documentType.deleteMany();
    // });

    //addDocumentType
    it("Deve criar um DocumentType", (done) => {
        const body = {
            name: "Certidão negativa",
            title: "Certidão Negativa de Débitos",
            validityPeriod: 60,
        };
        request(app)
            .post("/documents-types")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.document).toHaveProperty("id");
                expect(response.body.document).toHaveProperty("name");
                expect(response.body.document).toHaveProperty("title");
                expect(response.body.document).toHaveProperty("validityPeriod");
                documentTypeId = response.body.document.id;
                return done();
            });
    });

    it("não deve permitir registro sem quaisquer dados", (done) => {
        request(app)
            .post("/documents-types")
            .send("")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve permitir registro sem name", (done) => {
        request(app)
            .post("/documents-types")
            .send({
                title: "Certidão Negativa de Débitos",
                validityPeriod: 60,
            })
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve permitir registro sem title", (done) => {
        request(app)
            .post("/documents-types")
            .send({
                name: "Certidão negativa",
                validityPeriod: 60,
            })
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve permitir registro sem validityPeriod", (done) => {
        request(app)
            .post("/documents-types")
            .send({
                title: "Certidão Negativa de Débitos",
                name: "Certidão negativa",
            })
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve permitir em que validityPeriod não seja um number", (done) => {
        request(app)
            .post("/documents-types")
            .send({
                title: "Certidão Negativa de Débitos",
                name: "Certidão negativa",
                validityPeriod: "60",
            })
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    //getAll
    it("deve obter uma lista de Documents-Types", (done) => {
        request(app)
            .get("/documents-types")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                const documents = response.body.documents;
                expect(response.body.error).toBeUndefined();
                expect(documents.length).toBeGreaterThanOrEqual(1);
                for (let i in documents) {
                    expect(documents[i]).toHaveProperty("id");
                }
                return done();
            });
    });

    //getOne
    it("deve obter um unico item de Documents-Types", (done) => {
        request(app)
            .get(`/documents-Types/${documentTypeId}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.document).toHaveProperty("id");
                return done();
            });
    });

    it("não deve obter um item de Documents-Types com id inexistente", (done) => {
        request(app)
            .get(`/documents-Types/${0}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    //updateDocumentType
    it("Deve atualizar um DocumentType", (done) => {
        const body = {
            name: "Certidão negativa Atualizada",
            title: "Certidão Negativa de Débitos Atualizada",
            validityPeriod: 90,
        };
        request(app)
            .put(`/documents-types/${documentTypeId}`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.document).toHaveProperty("id");
                expect(response.body.document.name).toBe(body.name);
                expect(response.body.document.title).toBe(body.title);
                expect(response.body.document.validityPeriod).toBe(
                    body.validityPeriod,
                );
                return done();
            });
    });

    it("Não deve atualizar um DocumentType com id inexistente", (done) => {
        const body = {
            name: "Certidão negativa Atualizada",
            title: "Certidão Negativa de Débitos Atualizada",
            validityPeriod: 90,
        };
        request(app)
            .put(`/documents-types/${0}`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um DocumentType em que validityPeriod não seja um number", (done) => {
        const body = {
            name: "Certidão negativa Atualizada",
            title: "Certidão Negativa de Débitos Atualizada",
            validityPeriod: "90",
        };
        request(app)
            .put(`/documents-types/${documentTypeId}`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                expect(response.body.error).toBe("Dados inválidos!");
                return done();
            });
    });
});

describe("Testando rotas de DocumentTypeText", () => {
    //addDocumentTypeText
    it("Deve criar um DocumentTypeText", (done) => {
        const body = {
            text: "Olá, {{nome}}",
            name: "Padrão Certidão Negativa de Débitos",
        };
        request(app)
            .post(`/documents-types/${documentTypeId}/texts`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.documentTypeText).toHaveProperty("id");
                expect(response.body.documentTypeText.name).toBe(body.name);
                expect(response.body.documentTypeText.text).toBe(body.text);
                expect(response.body.documentTypeText.documentTypeId).toBe(
                    documentTypeId,
                );
                documentTypeTextId = response.body.documentTypeText.id;
                return done();
            });
    });

    it("não deve permitir criar um registro de DocumentTypeText sem quaisquer dados", (done) => {
        request(app)
            .post(`/documents-types/${documentTypeId}/texts`)
            .send("")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve permitir registro sem name", (done) => {
        const body = {
            text: "Olá, {{nome}}",
        };
        request(app)
            .post(`/documents-types/${documentTypeId}/texts`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve permitir registro sem text", (done) => {
        const body = {
            name: "Padrão Certidão Negativa de Débitos",
        };
        request(app)
            .post(`/documents-types/${documentTypeId}/texts`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve permitir registro com um documentTypeId inexistente", (done) => {
        const body = {
            text: "Olá, {{nome}}",
            name: "Padrão Certidão Negativa de Débitos",
        };
        request(app)
            .post(`/documents-types/${0}/texts`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    //getOne
    it("deve obter um unico item de documentsTypesTexts", (done) => {
        request(app)
            .get(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}`,
            )
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.documentTypeText).toHaveProperty("id");
                expect(response.body.documentTypeText.documentTypeId).toBe(
                    documentTypeId,
                );
                expect(response.body.documentTypeText).toHaveProperty("text");
                return done();
            });
    });

    //updateDocumentType
    it("Deve atualizar um documentTypeText", (done) => {
        const body = {
            text: "Olá, {{sobrenome}}",
            name: "Padrão Certidão Negativa de Débitos ATUALIZADA",
        };
        request(app)
            .put(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}`,
            )
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.documentTypeText).toHaveProperty("id");
                expect(response.body.documentTypeText.id).toBe(
                    documentTypeTextId,
                );
                expect(response.body.documentTypeText.name).toBe(body.name);
                expect(response.body.documentTypeText.text).toBe(body.text);
                return done();
            });
    });

    it("Não deve atualizar um documentTypeText com id inexistente", (done) => {
        const body = {
            text: "Olá, {{nome}}",
            name: "Padrão Certidão Negativa de Débitos ATUALIZADA",
        };
        request(app)
            .put(`/documents-types/${documentTypeId}/texts/${0}`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um documentTypeText com text sendo um numero", (done) => {
        const body = {
            text: 2000,
            name: "Padrão Certidão Negativa de Débitos ATUALIZADA",
        };
        request(app)
            .put(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}`,
            )
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um documentTypeText com name sendo um numero", (done) => {
        const body = {
            text: "Olá, {{nome}}",
            name: 1234,
        };
        request(app)
            .put(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}`,
            )
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });
});

describe("Testando rotas de DocumentTypeField", () => {
    //addDocumentTypeField
    it("Deve criar um DocumentTypeField", (done) => {
        const body = {
            name: "Nome",
            type: "text",
            identifier: "{{nome}}",
        };
        request(app)
            .post(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}/fields`,
            )
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.field).toHaveProperty("id");
                expect(response.body.field.name).toBe(body.name);
                expect(response.body.field.type).toBe(body.type);
                expect(response.body.field.identifier).toBe(body.identifier);
                expect(response.body.field.documentTypeId).toBe(documentTypeId);
                expect(response.body.field.documentTypeTextId).toBe(
                    documentTypeTextId,
                );
                documentTypeFieldId = response.body.field.id;
                return done();
            });
    });

    it("não deve permitir criar um registro de DocumentTypeField sem quaisquer dados", (done) => {
        request(app)
            .post(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}/fields`,
            )
            .send("")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve permitir registro sem name", (done) => {
        const body = {
            type: "text",
            identifier: "{{nome}}",
        };
        request(app)
            .post(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}/fields`,
            )
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve permitir registro sem type", (done) => {
        const body = {
            name: "Nome",
            identifier: "{{nome}}",
        };
        request(app)
            .post(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}/fields`,
            )
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve permitir registro sem identifier", (done) => {
        const body = {
            name: "Nome",
            type: "text",
        };
        request(app)
            .post(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}/fields`,
            )
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve permitir registro com um documentTypeId inexistente", (done) => {
        const body = {
            name: "Nome",
            type: "text",
            identifier: "{{nome}}",
        };
        request(app)
            .post(`/documents-types/${0}/texts/${documentTypeTextId}/fields`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("não deve permitir registro com um documentTypeTextId inexistente", (done) => {
        const body = {
            name: "Nome",
            type: "text",
            identifier: "{{nome}}",
        };
        request(app)
            .post(`/documents-types/${documentTypeId}/texts/${0}/fields`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    //getAll
    it("deve obter uma lista de documentsTypesFields", (done) => {
        request(app)
            .get(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}/fields`,
            )
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                const fields = response.body.fields;
                expect(fields.length).toBeGreaterThanOrEqual(1);
                for (let i in fields) {
                    expect(fields[i]).toHaveProperty("id");
                    expect(fields[i]).toHaveProperty("name");
                    expect(fields[i]).toHaveProperty("type");
                    expect(fields[i]).toHaveProperty("identifier");
                    expect(fields[i].documentTypeId).toBe(documentTypeId);
                    expect(fields[i].documentTypeTextId).toBe(
                        documentTypeTextId,
                    );
                }

                return done();
            });
    });

    it("deve obter uma lista vazia de documentsTypesFields se documentType não existir", (done) => {
        request(app)
            .get(`/documents-types/${0}/texts/${documentTypeTextId}/fields`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.fields.length).toBe(0);
                return done();
            });
    });

    it("não deve obter uma lista de documentsTypesFields se documentTypeTextId não existir", (done) => {
        request(app)
            .get(`/documents-types/${documentTypeId}/texts/${0}/fields`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.fields.length).toBe(0);
                return done();
            });
    });

    //updateDocumentType
    it("Deve atualizar um documentTypeField", (done) => {
        const body = {
            name: "Sobrenome",
            type: "number",
            identifier: "{{sobrenome}}",
        };
        request(app)
            .put(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}/fields/${documentTypeFieldId}`,
            )
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.field).toHaveProperty("id");
                expect(response.body.field.id).toBe(documentTypeFieldId);
                expect(response.body.field.name).toBe(body.name);
                expect(response.body.field.type).toBe(body.type);
                expect(response.body.field.identifier).toBe(body.identifier);
                expect(response.body.field.documentTypeId).toBe(documentTypeId);
                expect(response.body.field.documentTypeTextId).toBe(
                    documentTypeTextId,
                );
                return done();
            });
    });

    it("Deve atualizar um documentTypeField mandando somente type", (done) => {
        const body = {
            type: "text",
        };
        request(app)
            .put(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}/fields/${documentTypeFieldId}`,
            )
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.field).toHaveProperty("id");
                expect(response.body.field.id).toBe(documentTypeFieldId);
                expect(response.body.field.type).toBe(body.type);
                expect(response.body.field.documentTypeId).toBe(documentTypeId);
                expect(response.body.field.documentTypeTextId).toBe(
                    documentTypeTextId,
                );
                return done();
            });
    });

    it("Não deve atualizar um documentTypeField se name for um numero", (done) => {
        const body = {
            name: 100,
            type: "number",
            identifier: "{{sobrenome}}",
        };
        request(app)
            .put(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}/fields/${documentTypeFieldId}`,
            )
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um documentTypeField se type for um numero", (done) => {
        const body = {
            name: "SobreNome",
            type: 1234,
            identifier: "{{sobrenome}}",
        };
        request(app)
            .put(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}/fields/${documentTypeFieldId}`,
            )
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um documentTypeField se identifier for um numero", (done) => {
        const body = {
            name: "SobreNome",
            type: "text",
            identifier: 1234,
        };
        request(app)
            .put(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}/fields/${documentTypeFieldId}`,
            )
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um documentTypeField com id inexistente", (done) => {
        const body = {
            name: "Sobrenome",
            type: "text",
            identifier: "{{sobrenome}}",
        };
        request(app)
            .put(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}/fields/${0}`,
            )
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um documentTypeField com documentTypeId inexistente", (done) => {
        const body = {
            name: "Sobrenome",
            type: "text",
            identifier: "{{sobrenome}}",
        };
        request(app)
            .put(
                `/documents-types/${0}/texts/${documentTypeTextId}/fields/${documentTypeFieldId}`,
            )
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um documentTypeField com documentTypeTextId inexistente", (done) => {
        const body = {
            name: "Sobrenome",
            type: "text",
            identifier: "{{sobrenome}}",
        };
        request(app)
            .put(
                `/documents-types/${documentTypeId}/texts/${0}/fields/${documentTypeFieldId}`,
            )
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });
});

describe("Testando rotas de Document", () => {
    //addDocument
    it("Deve criar um Document", (done) => {
        const body = {
            date: "2024-01-27T15:30:00.000Z",
            text: "Olá {{sobrenome}}",
            documentTypeId,
            documentTypeTextId,
            fields: [
                {
                    name: "Sobrenome",
                    value: "Barradas",
                    type: "text",
                    identifier: "{{sobrenome}}",
                },
            ],
        };
        request(app)
            .post("/documents")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.document).toHaveProperty("id");
                expect(response.body.document).toHaveProperty("number");
                expect(response.body.document.documentTypeId).toBe(
                    documentTypeId,
                );
                expect(response.body.document.documentTypeTextId).toBe(
                    documentTypeTextId,
                );
                expect(response.body.document.documentType).toHaveProperty(
                    "id",
                );
                expect(response.body.document.documentType).toHaveProperty(
                    "name",
                );
                expect(response.body.document.documentType).toHaveProperty(
                    "title",
                );
                expect(response.body.document.documentType).toHaveProperty(
                    "validityPeriod",
                );
                const fields = response.body.document.fields;
                expect(fields.length).toBeGreaterThanOrEqual(1);
                for (let i in fields) {
                    expect(fields[i]).toHaveProperty("id");
                    expect(fields[i]).toHaveProperty("name");
                    expect(fields[i]).toHaveProperty("type");
                    expect(fields[i]).toHaveProperty("identifier");
                    expect(fields[i]).toHaveProperty("value");
                    documentFieldId = fields[i].id;
                }
                documentId = response.body.document.id;
                return done();
            });
    });

    it("Deve criar um Document sem campos", (done) => {
        const body = {
            date: "2024-01-27T15:30:00.000Z",
            text: "Olá {{sobrenome}}",
            documentTypeId,
            documentTypeTextId,
        };
        request(app)
            .post("/documents")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.document).toHaveProperty("id");
                expect(response.body.document).toHaveProperty("number");
                expect(response.body.document.documentTypeId).toBe(
                    documentTypeId,
                );
                expect(response.body.document.documentTypeTextId).toBe(
                    documentTypeTextId,
                );
                expect(response.body.document.documentType).toHaveProperty(
                    "id",
                );
                expect(response.body.document.documentType).toHaveProperty(
                    "name",
                );
                expect(response.body.document.documentType).toHaveProperty(
                    "title",
                );
                expect(response.body.document.documentType).toHaveProperty(
                    "validityPeriod",
                );
                const fields = response.body.document.fields;
                expect(fields.length).toBe(0);
                documentId2 = response.body.document.id;
                return done();
            });
    });

    it("não deve criar um Document sem quaisquer dados", (done) => {
        const body = {};
        request(app)
            .post("/documents")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve criar um Document sem data", (done) => {
        const body = {
            text: "Olá {{sobrenome}}",
            documentTypeId,
            documentTypeTextId,
        };
        request(app)
            .post("/documents")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve criar um Document se a data for inválida", (done) => {
        const body = {
            data: 6953,
            text: "Olá {{sobrenome}}",
            documentTypeId,
            documentTypeTextId,
        };
        request(app)
            .post("/documents")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve criar um Document sem texto", (done) => {
        const body = {
            date: "2024-01-27T15:30:00.000Z",
            documentTypeId,
            documentTypeTextId,
        };
        request(app)
            .post("/documents")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve criar um Document se o texto for um numero", (done) => {
        const body = {
            date: "2024-01-27T15:30:00.000Z",
            text: 6494984,
            documentTypeId,
            documentTypeTextId,
        };
        request(app)
            .post("/documents")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve criar um Document sem documentTypeId", (done) => {
        const body = {
            date: "2024-01-27T15:30:00.000Z",
            text: "Olá {{sobrenome}}",
            documentTypeTextId,
        };
        request(app)
            .post("/documents")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve criar um Document sem documentTypeTextId", (done) => {
        const body = {
            date: "2024-01-27T15:30:00.000Z",
            text: "Olá {{sobrenome}}",
            documentTypeId,
        };
        request(app)
            .post("/documents")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve criar um Document se documentTypeId for invalido", (done) => {
        const body = {
            date: "2024-01-27T15:30:00.000Z",
            text: "Olá {{sobrenome}}",
            documentTypeTextId,
            documentTypeId: 0,
        };
        request(app)
            .post("/documents")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve criar um Document se documentTypeTextId for invalido", (done) => {
        const body = {
            date: "2024-01-27T15:30:00.000Z",
            text: "Olá {{sobrenome}}",
            documentTypeTextId: 0,
            documentTypeId,
        };
        request(app)
            .post("/documents")
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve criar um Document se field.name for um numero", (done) => {
        const body = {
            date: "2024-01-27T15:30:00.000Z",
            text: "Olá {{sobrenome}}",
            documentTypeId,
            documentTypeTextId,
            fields: [
                {
                    name: 598526,
                    value: "Barradas",
                    type: "text",
                    identifier: "{{sobrenome}}",
                },
            ],
        };
        request(app)
            .post(`/documents`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve criar um Document se field.value for um numero", (done) => {
        const body = {
            date: "2024-01-27T15:30:00.000Z",
            text: "Olá {{sobrenome}}",
            documentTypeId,
            documentTypeTextId,
            fields: [
                {
                    name: "Sobrenome",
                    value: 599985,
                    type: "text",
                    identifier: "{{sobrenome}}",
                },
            ],
        };
        request(app)
            .post(`/documents`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve criar um Document se field.type for um numero", (done) => {
        const body = {
            date: "2024-01-27T15:30:00.000Z",
            text: "Olá {{sobrenome}}",
            documentTypeId,
            documentTypeTextId,
            fields: [
                {
                    name: "Sobrenome",
                    value: "Barradas",
                    type: 59595959,
                    identifier: "{{sobrenome}}",
                },
            ],
        };
        request(app)
            .post(`/documents`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve criar um Document se field.identifier for um numero", (done) => {
        const body = {
            date: "2024-01-27T15:30:00.000Z",
            text: "Olá {{sobrenome}}",
            documentTypeId,
            documentTypeTextId,
            fields: [
                {
                    name: "Sobrenome",
                    value: "Barradas",
                    type: "text",
                    identifier: 569956,
                },
            ],
        };
        request(app)
            .post(`/documents`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    //getAll
    it("deve obter uma lista de documents", (done) => {
        request(app)
            .get("/documents")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                const documents = response.body.documents;
                expect(documents.length).toBeGreaterThanOrEqual(1);
                for (let i in documents) {
                    expect(documents[i]).toHaveProperty("id");
                    expect(documents[i]).toHaveProperty("number");
                    expect(documents[i].documentTypeId).toBe(documentTypeId);
                    expect(documents[i].documentTypeTextId).toBe(
                        documentTypeTextId,
                    );
                    expect(documents[i]).toHaveProperty("fields");
                    expect(documents[i].documentType).toHaveProperty("id");
                    expect(documents[i].documentType).toHaveProperty("name");
                    expect(documents[i].documentType).toHaveProperty("title");
                    expect(documents[i].documentType).toHaveProperty(
                        "validityPeriod",
                    );
                }
                return done();
            });
    });

    //getOne
    it("deve obter um unico documents", (done) => {
        request(app)
            .get(`/documents/${documentId}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.document).toHaveProperty("id");
                expect(response.body.document).toHaveProperty("number");
                expect(response.body.document.documentTypeId).toBe(
                    documentTypeId,
                );
                expect(response.body.document.documentTypeTextId).toBe(
                    documentTypeTextId,
                );
                expect(response.body.document).toHaveProperty("fields");
                expect(response.body.document.documentType).toHaveProperty(
                    "id",
                );
                expect(response.body.document.documentType).toHaveProperty(
                    "name",
                );
                expect(response.body.document.documentType).toHaveProperty(
                    "title",
                );
                expect(response.body.document.documentType).toHaveProperty(
                    "validityPeriod",
                );
                return done();
            });
    });

    it("não deve obter um documents com id inexistente", (done) => {
        request(app)
            .get(`/documents/${0}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    //updateDocumentType
    it("Deve atualizar um document e seus campos (caso tenha)", (done) => {
        const body = {
            date: "2024-01-29T17:10:00.000Z",
            fields: [
                {
                    id: documentFieldId,
                    value: "Morais",
                },
            ],
        };
        request(app)
            .put(`/documents/${documentId}`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.document.id).toBe(documentId);
                expect(response.body.document.date).toBe(body.date);
                const fields = response.body.document.fields;
                expect(fields.length).toBeGreaterThanOrEqual(1);
                expect(fields[0].id).toBe(documentFieldId);
                expect(fields[0].value).toBe("Morais");
                return done();
            });
    });

    it("Não deve atualizar um document e fields for um array vazio", (done) => {
        const body = {
            fields: [],
        };
        request(app)
            .put(`/documents/${documentId}`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um document se o id não existir", (done) => {
        const body = {
            fields: [],
        };
        request(app)
            .put(`/documents/${0}`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um Document se a data for inválida", (done) => {
        const body = {
            data: 6953,
        };
        request(app)
            .put(`/documents/${documentId}`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um Document se o texto for um numero", (done) => {
        const body = {
            text: 6494984,
        };
        request(app)
            .put(`/documents/${documentId}`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um Document se documentTypeId for invalido", (done) => {
        const body = {
            documentTypeId: 0,
        };
        request(app)
            .put(`/documents/${documentId}`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um Document se documentTypeTextId for invalido", (done) => {
        const body = {
            documentTypeTextId: 0,
        };
        request(app)
            .put(`/documents/${documentId}`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um Document se field.name for um numero", (done) => {
        const body = {
            fields: [
                {
                    id: documentId,
                    name: 598526,
                },
            ],
        };
        request(app)
            .put(`/documents/${documentId}`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um Document se field.value for um numero", (done) => {
        const body = {
            fields: [
                {
                    value: 599985,
                },
            ],
        };
        request(app)
            .put(`/documents/${documentId}`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um Document se field.type for um numero", (done) => {
        const body = {
            fields: [
                {
                    id: documentId,
                    type: 59595959,
                },
            ],
        };
        request(app)
            .put(`/documents/${documentId}`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });

    it("Não deve atualizar um Document se field.identifier for um numero", (done) => {
        const body = {
            fields: [
                {
                    id: documentId,
                    identifier: 569956,
                },
            ],
        };
        request(app)
            .put(`/documents/${documentId}`)
            .send(body)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                return done();
            });
    });
});

describe("Testando as exclusões", () => {
    ///Deletar Document
    it("deve deletar um Document ", (done) => {
        request(app)
            .delete(`/documents/${documentId}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.document).toHaveProperty("id");
                expect(response.body.document.id).toBe(documentId);
                return done();
            });
    });

    it("deve deletar um Document 2", (done) => {
        request(app)
            .delete(`/documents/${documentId2}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.document).toHaveProperty("id");
                expect(response.body.document.id).toBe(documentId2);
                return done();
            });
    });

    it("Não deve deletar um document com id inexistente", (done) => {
        request(app)
            .delete(`/documents/${0}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                expect(response.body.document).toBeUndefined();
                return done();
            });
    });

    //Deletar DocumentTypeField
    it("deve deletar um DocumentTypeField", (done) => {
        request(app)
            .delete(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}/fields/${documentTypeFieldId}`,
            )
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.field).toHaveProperty("id");
                expect(response.body.field.id).toBe(documentTypeFieldId);
                return done();
            });
    });

    it("não deve deletar um DocumentTypeField com id inexistente", (done) => {
        request(app)
            .delete(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}/fields/${0}`,
            )
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                expect(response.body.field).toBeUndefined();
                return done();
            });
    });

    it("não deve deletar um DocumentTypeField com documentTypeId inexistente", (done) => {
        request(app)
            .delete(
                `/documents-types/${0}/texts/${documentTypeTextId}/fields/${documentTypeFieldId}`,
            )
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                expect(response.body.field).toBeUndefined();
                return done();
            });
    });

    it("não deve deletar um DocumentTypeField com documentTypeTextId inexistente", (done) => {
        request(app)
            .delete(
                `/documents-types/${documentTypeId}/texts/${0}/fields/${documentTypeFieldId}`,
            )
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                expect(response.body.field).toBeUndefined();
                return done();
            });
    });

    //Deletar DocumentTypeText
    it("deve deletar um DocumentTypeText", (done) => {
        request(app)
            .delete(
                `/documents-types/${documentTypeId}/texts/${documentTypeTextId}`,
            )
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.documentTypeText).toHaveProperty("id");
                expect(response.body.documentTypeText.id).toBe(
                    documentTypeTextId,
                );
                return done();
            });
    });

    it("não deve deletar um DocumentTypeText com id inexistente", (done) => {
        request(app)
            .delete(`/documents-types/${documentTypeId}/texts/${0}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                expect(response.body.DocumentTypeText).toBeUndefined();
                return done();
            });
    });

    it("não deve deletar um DocumentTypeText com documentTypeId inexistente", (done) => {
        request(app)
            .delete(`/documents-types/${0}/texts/${documentTypeTextId}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                expect(response.body.DocumentTypeText).toBeUndefined();
                return done();
            });
    });

    //Deletar DocumentType
    it("deve deletar um DocumentType", (done) => {
        request(app)
            .delete(`/documents-types/${documentTypeId}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).toBeUndefined();
                expect(response.body.document).toHaveProperty("id");
                expect(response.body.document.id).toBe(documentTypeId);
                return done();
            });
    });

    it("não deve deletar um DocumentType com id inexistente", (done) => {
        request(app)
            .delete(`/documents-types/${0}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .then((response) => {
                expect(response.body.error).not.toBeUndefined();
                expect(response.body.document).toBeUndefined();
                return done();
            });
    });
});
