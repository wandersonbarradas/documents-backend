import { RequestHandler } from "express";
import fs from "fs";
import { getBrowser } from "../utils/getBrowser";
export const generatePDF: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const browser = await getBrowser();
    const page = await browser.newPage();
    const token = req.headers.authorization?.split(" ")[1];
    await page.setCookie({
        name: "token",
        value: (token as string) || "",
        domain: "localhost", // Altere para o domínio correto
        path: "/", // Altere para o caminho correto, se necessário
    });
    // Navega até uma página que requer autenticação
    await page.goto(
        `https://docs-tributos.vercel.app/documentos-emitidos/${id}`,
        {
            waitUntil: "domcontentloaded",
        },
    );

    // await page.evaluate((selector: string) => {
    //     const elemento = document.querySelector(selector) as HTMLElement;
    //     if (elemento) {
    //         elemento.className = "";
    //     }
    // }, "body");
    // const button = "#print";
    // await page.evaluate((selector) => {
    //     const elemento = document.querySelector(selector) as HTMLElement;
    //     if (elemento) {
    //         elemento.style.display = "none";
    //     }
    // }, button);
    // const box = "#box";
    // await page.evaluate((selector) => {
    //     const elemento = document.querySelector(selector) as HTMLElement;
    //     if (elemento) {
    //         elemento.style.marginTop = "128px";
    //         elemento.style.height = "78%";
    //     }
    // }, box);

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
            top: "0", // Margem superior para deixar espaço para o cabeçalho
            bottom: "0", // Margem inferior para deixar espaço para o rodapé
            left: "110px",
            right: "110px",
        },
    });
    // Fecha o navegador
    await browser.close();
    res.contentType("application/pdf");
    return res.send(pdf);
};
