import twilio from 'twilio';
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

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

export function createMessage({body, media}) {
    const response = new MessagingResponse();
    const message = response.message();
    if(body) {
        message.body(body);
    }
    if(media) {
        message.media('https://a3db-71-187-203-142.ngrok-free.app/my/image');
    }
    console.log(response.toString());
    return response.toString();
}

