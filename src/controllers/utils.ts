import { RequestHandler } from "express";
import * as documents from "../services/documents";
import fs from "fs";
import { getBrowser } from "../utils/getBrowser";
import { error } from "console";
import { generatePage } from "../utils/generatePage";
export const generatePDF: RequestHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const documentItem = await documents.getOne(parseInt(id));
        if (!documentItem) {
            return res.json({ error: "Documento não encontrado!" });
        }
        const browser = await getBrowser();
        const page = await browser.newPage();
        const content = generatePage(documentItem);
        await page.setContent(content);
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
        const pdf = await page.pdf({
            format: "a4",
            displayHeaderFooter: true,
            printBackground: true,
            headerTemplate: headerTemplate,
            footerTemplate: footerTemplate,
            margin: {
                top: "130px", // Margem superior para deixar espaço para o cabeçalho
                bottom: "130px", // Margem inferior para deixar espaço para o rodapé
                left: "100px",
                right: "100px",
            },
        });
        // Fecha o navegador
        await browser.close();
        res.contentType("application/pdf");
        return res.send(pdf);
    } catch (error: any) {
        return res.json({ error: `Ocorreu um erro - ${error.message}!` });
    }
};
