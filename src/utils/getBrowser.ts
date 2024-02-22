import chromium from "chrome-aws-lambda";
import puppeteer_core from "puppeteer-core";
import puppeteerLib from "puppeteer";

export const getBrowser = async () => {
    let chrome = {};
    let puppeteer;
    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        chrome = chromium;
        puppeteer = puppeteer_core;
    } else {
        puppeteer = puppeteerLib;
    }
    let options = {};

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        options = {
            args: [
                ...chromium.args,
                "--hide-scrollbars",
                "--disable-web-security",
            ],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        };
    }
    const browser = puppeteer.launch(options);
    return browser;
};
