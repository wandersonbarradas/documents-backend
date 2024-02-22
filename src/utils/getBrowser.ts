import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import path from "path";

export const getBrowser = async () => {
    const browser = puppeteer.launch({
        executablePath:
            process.env.NODE_ENV !== "development"
                ? await chromium.executablePath
                : path.join(
                      "C:\\",
                      "Program Files",
                      "Google",
                      "Chrome",
                      "Application",
                      "chrome.exe",
                  ),
        headless:
            process.env.NODE_ENV !== "development" ? chromium.headless : true,
    });
    return browser;
};
