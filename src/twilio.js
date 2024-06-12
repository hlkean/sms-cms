import twilio from 'twilio';
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
import * as path from 'path'
import { fileURLToPath } from 'url';

const client = twilio(accountSid, authToken);
const { MessagingResponse } = twilio.twiml;

export async function sendMessage(message) {
    const response = await client.messages
        .create({
            body: message,
            from: process.env.TWILIO_PHONE,
            to: process.env.TO_PHONE,
        });
    return response;
}

export function createMessage() {
    // const twiml = new MessagingResponse();
    const response = new MessagingResponse();
    const message = response.message();
    message.body("How's this look?");
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const imgPath = `file://${path.join(__dirname, 'image-gen/test.jpg')}`;
    message.media(imgPath);

    console.log(response.toString());

    // twiml.message("How's this look?");
    // twiml.media('../test.jpg');
    return response.toString();
}

