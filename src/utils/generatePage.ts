import { Document, DocumentType } from "@prisma/client";
import Formatter from "./formatter";
import extenso from "extenso";
import fs from "fs";
type documentPrit = Document & {
    document_type: DocumentType;
};

export const generatePage = (document: documentPrit) => {
    const size = document.text.length;
    const regex = /font-size:\s*([\d.]+)px/;
    const match = regex.exec(document.text) as RegExpExecArray;
    console.log(/font-family:\s*([^;]+)/.exec(document.text));
    let fontSize = "text-sm";
    if (match[1]) {
        fontSize = `text-[${match[1]}px]`;
    }
    console.log(fontSize);
    const imageData = fs.readFileSync("public/img/imagem2.jpg", "base64");
    const dataUri = `data:image/jpg;base64,${imageData}`;
    const content = `
        <html>
    <head>
        <title>Exemplo de PDF</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    </head>
    <body style="font-family: Roboto, sans-serif !important" class="px-4 text-black">
        <div class="min-h-screen bg-[url(${dataUri})] bg-no-repeat bg-contain bg-center relative">
                <div
                    id="box"
                    class="absolute top-0 left-0 right-0 bottom-0 text-black ${
                        size > 800 ? "pt-20" : "pt-44"
                    } text-center bg-white/90"
                >
                    <div style="font-family: Roboto, sans-serif !important" class="w-full max-w-xl mx-auto">
                        <div class="mb-20 ${fontSize}">
                            <b> ${document.document_type.title} ${
        document.document_type.has_number
            ? "Nº " + Formatter.number(document.number as string)
            : ""
    }
                            </b>
                        </div>
                        <p style="font-family: Roboto, sans-serif !important" class="text-justify">
                            ${document.html}
                        </p>
                        ${
                            document.document_type.expires
                                ? `<p class="${fontSize}">
                                    O presente Documento tem validade de 
                                    ${document.document_type.validity} (
                                    ${extenso(document.document_type.validity)})
                                    dias.
                                </p>`
                                : ""
                        }
                        <div style="font-family: Roboto, sans-serif !important" class="${fontSize} mt-10">
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
