import { Document, DocumentType } from "@prisma/client";
import Formatter from "./formatter";
import extenso from "extenso";
import fs from "fs";
type documentPrit = Document & {
    document_type: DocumentType;
};

export const generatePage = (document: documentPrit) => {
    const size = document.text.length;
    const imageData = fs.readFileSync("public/img/imagem2.jpg", "base64");
    const dataUri = `data:image/jpg;base64,${imageData}`;
    const content = `
        <html>
    <head>
        <title>Exemplo de PDF</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="px-4 text-black">
        <div class="min-h-screen bg-[url(${dataUri})] bg-no-repeat bg-contain bg-center relative">
                <div
                    id="box"
                    class="absolute top-0 left-0 right-0 bottom-0 text-black ${
                        size > 700 ? "pt-20" : "pt-44"
                    } text-center bg-white/90"
                >
                    <div class="w-full max-w-xl mx-auto">
                        <div class="mb-20 text-sm">
                            <b> ${document.document_type.title} ${
        document.document_type.has_number
            ? Formatter.number(document.number as string)
            : ""
    }
                            </b>
                        </div>
                        <div class="text-justify">
                            ${document.text}
                        </div>
                        ${
                            document.document_type.expires
                                ? `<p class="text-sm">
                                    O presente Documento tem validade de 
                                    ${document.document_type.validity} (
                                    ${extenso(document.document_type.validity)})
                                    dias.
                                </p>`
                                : ""
                        }
                        <div class="text-sm mt-10">
                            Demerval Lobão ${Formatter.formatarDataPorExtenso(
                                new Date(document.date),
                            )}
                        </div>
                    </div>
                </div>
            </div>
    </body>
    </html>
    `;

    return content;
};
