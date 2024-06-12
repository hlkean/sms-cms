import puppeteer from 'puppeteer';
import * as path from 'path'
import { fileURLToPath } from 'url';

export async function makeImage(content) {
    const browser = await puppeteer.launch({
        headless: true
    });
    // const browser = await puppeteer.launch({
    //     headless: true,
    //     ignoreHTTPSErrors: true,
    //     executablePath: browserPath,
    //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
    //     dumpio: true,
    // });

    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setViewport({
        width: 500,
        height: 500
    });
    // await page.setViewport({
    //     width: 500,
    //     height: 500,
    //     deviceScaleFactor,
    // });
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const url = path.join(__dirname, 'test.html');
    try {
        const result = await page.goto(`file://${url}`, {
            waitUntil: 'load',
        });

        if (result.status() !== 200) {
        page.close();
        throw new PageNotFoundError(`Incorrect status page ${result.status()}`);
        } else {
            const items = content.toString().split(',');
            await page.evaluate((items)=>{
                let list;
                items.forEach(item => {
                    list += `<li>${item}</li>`;
                });
                document.body.innerHTML += list;
            }, items)
        }
    } catch (error) {
        page.close();
        throw new Error(error);
    }

    // const data = await page.screenshot({
    //     type: imageType,
    //     quality: imageQuality,
    //     encoding: 'binary',
    //     path: 
    // });
    const data = await page.screenshot({
        path: path.join(__dirname, 'test.jpg')
    });

    page.close();
}