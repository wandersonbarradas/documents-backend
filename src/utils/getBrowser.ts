import chrome from "@sparticuz/chromium";
import puppeteer_core from "puppeteer-core";
import puppeteer from "puppeteer";

export const getBrowser = async () => {
    let browser;
    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        browser = await puppeteer_core.launch({
            args: chrome.args,
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath(),
            headless: "new",
            ignoreHTTPSErrors: true,
        });
    } else {
        browser = await puppeteer.launch();
    }
    return browser;
};
