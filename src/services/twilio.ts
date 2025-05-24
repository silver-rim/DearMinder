import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_WHATSAPP_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  throw new Error('Missing Twilio configuration. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_NUMBER environment variables.');
}

const client = twilio(accountSid, authToken);

export interface WhatsAppMessage {
  to: string;
  body: string;
}

export class TwilioService {
  static async sendWhatsAppMessage({ to, body }: WhatsAppMessage) {
    try {
      // Format the 'to' number for WhatsApp
      const formattedTo = `whatsapp:${to}`;
      const formattedFrom = `whatsapp:${twilioPhoneNumber}`;

      const message = await client.messages.create({
        body,
        from: formattedFrom,
        to: formattedTo,
      });

      return {
        success: true,
        messageId: message.sid,
      };
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }
} 