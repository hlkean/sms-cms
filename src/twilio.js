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
            to: process.env.TO_PHONE
        });
    return response;
}

export function createMessage(message) {
    const twiml = new MessagingResponse();

    twiml.message('The Robots are coming! Head for the hills!');
    return twiml.toString();
}

