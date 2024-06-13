import puppeteer from 'puppeteer';
import * as path from 'path'
import { fileURLToPath } from 'url';
import { intents, phrases } from '../constants.js';
import { createMessage } from '../twilio.js';

export async function makeImage(content) {
    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setViewport({
        width: 500,
        height: 500
    });

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
            if (items.length > 1) {
                let list = '';
                items.forEach((item) => {
                    item = item.trim();
                    list += `<li>${item.charAt(0).toUpperCase() + item.slice(1)}</li>`;
                }, list);
                await page.evaluate((list)=>{
                    document.querySelector('section.menu').innerHTML = `<ul>${list}</ul>`;
                }, list)
            } else {
                await page.evaluate((content)=>{
                    document.querySelector('section.menu').innerHTML = `<p>${content}</p>`;
                }, content)
            }
        }
    } catch (error) {
        page.close();
        throw new Error(error);
    }

    const data = await page.screenshot({
        path: path.join(__dirname, 'test.jpg')
    });

    page.close();
}

export async function makeImageResponse(req, res) {
    await makeImage(req.body.Body.toString()).then(() => {
        console.log('image created, sending message');
        const body = `How's this look? Please reply '${phrases.approve}' to approve and post, or send revised content to remake the image`
        const media = 'https://907e-71-187-203-142.ngrok-free.app/my/image'
        const message = createMessage({body, media});
        if(req.session.intent !== intents.imageUpdate) {
            req.session.intent = intents.imageMade;
        }
        res.type('text/xml').send(message);
    }).catch((error) => {
        console.log('got an error: ', error);
        res.send('got an error: ', error);
    })
}