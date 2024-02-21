import pdfPuppeteer from "pdf-puppeteer";
import fs from "fs";
import { RequestHandler } from "express";
export const generatePDF: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const pageContent = `
        <html>
        <head>
            <title>Documento Emitido</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
            <h1 class="text-red-600">Documento Emitido #${id}</h1>
            <p>Este é um exemplo de conteúdo HTML que seria puxado do navegador.</p>
        </body>
        </html>
    `;
    // Lê a imagem como base64
    const imageData = fs.readFileSync("public/img/Imagem1.jpg", "base64");
    const dataUri = `data:image/jpg;base64,${imageData}`;
    const headerTemplate = `
    <div style="width: 100%; display: flex; justify-content: center; margin: 23px 110px 0 110px; border-bottom: solid 2px #000; padding-bottom: 6px; position: relative">
      <img src="${dataUri}" style="width: 428px; height: 73px; margin-left: -10px">
      <div style="position: absolute; top: 5px; left: 0; right: 0; height: 80px; background-color: #FFF; opacity: 0.5"></div>
    </div>
  `;
    const footerTemplate = `
    <div style="width: 100%; border-top: solid 2px #000; margin: 0px 110px 16px 110px; text-align: center; background-color: red; font-size: 14px; font-weight: bold; position: relative;">
        <p style="text-align: center; margin: 0px">COORDENAÇÃO MUNICIPAL DE TRIBUTOS</p>
        <p style="text-align: center; margin: 0px">AVENIDA PADRE JOAQUIM NONATO, 132 – BAIRRO CENTRO – CEP: 64390-000</p>
        <p style="text-align: center; margin: 0px">EMAIL: tributospmdl@gmail.com</p>
        <p style="text-align: center; margin: 0px">CNPJ: 06.544.885/0001-57</p>
        <div style="position: absolute; bottom: 0px; left: 0; right: 0; height: 80px; background-color: #FFF; opacity: 0.5"></div>
    </div>
  `;

    // Gera um PDF da página atual
    var callback = function (pdf: any) {
        // do something with the PDF like send it as the response
        res.setHeader("Content-Type", "application/pdf");
        res.send(pdf);
    };
    try {
        const pdfBuffer = await pdfPuppeteer(pageContent, callback, {
            format: "A4",
            displayHeaderFooter: true,
            margin: {
                top: "20mm",
                right: "20mm",
                bottom: "20mm",
                left: "20mm",
            },
            headerTemplate: headerTemplate,
            footerTemplate: footerTemplate,
        });
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        res.status(500).send("Erro ao gerar PDF");
    }
};
