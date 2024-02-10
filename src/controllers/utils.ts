import { RequestHandler } from "express";
import puppeteer from "puppeteer";
export const generatePDF: RequestHandler = async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // const token = req.headers.authorization?.split(" ")[1];
    // await page.setCookie({
    //     name: "token",
    //     value: (token as string) || "",
    //     domain: "localhost", // Altere para o domínio correto
    //     path: "/", // Altere para o caminho correto, se necessário
    // });
    // Navega até uma página que requer autenticação
    await page.goto("https://www.piauidigital.pi.gov.br/home/");

    const headerTemplate = `
    <div style="font-size: 14px; text-align: center; width: 100%; color: #000; font-wheight: bold; margin-top: 23px; border-bottom: 2px solid #000;">
      Cabeçalho da Página
    </div>
  `;
    const footerTemplate = `
    <div style="font-size: 10px; text-align: center; width: 100%;">
      <span class="pageNumber">Número da Página</span>/<span class="totalPages">Total de Páginas</span>
    </div>
  `;
    // Aguarda a renderização do componente React alvo (substitua 'button' pelo seletor do seu botão)
    //await page.waitForSelector("#immprimir");

    // Gera um PDF da página atual
    const pdf = await page.pdf({
        format: "A4",
        displayHeaderFooter: true,
        headerTemplate: headerTemplate,
        footerTemplate: footerTemplate,
        margin: {
            top: "100px", // Margem superior para deixar espaço para o cabeçalho
            bottom: "50px", // Margem inferior para deixar espaço para o rodapé
            left: "2px",
            right: "2px",
        },
    });
    // Fecha o navegador
    await browser.close();
    res.contentType("application/pdf");
    return res.send(pdf);
};
