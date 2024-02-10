import { RequestHandler } from "express";
import puppeteer from "puppeteer";
export const generatePDF: RequestHandler = async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const token = req.headers.authorization?.split(" ")[1];
    await page.setCookie({
        name: "token",
        value: (token as string) || "",
        domain: "localhost", // Altere para o domínio correto
        path: "/", // Altere para o caminho correto, se necessário
    });
    // Navega até uma página que requer autenticação
    await page.goto("http://localhost:3000/documents/2/novo");

    // Aguarda a renderização do componente React alvo (substitua 'button' pelo seletor do seu botão)
    await page.waitForSelector("#immprimir");

    // Gera um PDF da página atual
    const pdf = await page.pdf({ format: "A4" });
    // Fecha o navegador
    await browser.close();
    res.contentType("application/pdf");
    return res.send(pdf);
};
