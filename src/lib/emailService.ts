import { supabase } from "@/integrations/supabase/client";

export const sendReminderEmail = async (userEmail: string, receiverName: string, eventType: string, eventDate: string) => {
  const { error } = await supabase.functions.invoke('send-email', {
    body: {
      to: userEmail,
      subject: `Upcoming ${eventType} Reminder`,
      html: `
        <h2>Upcoming ${eventType} Reminder</h2>
        <p>Hello,</p>
        <p>This is a reminder that ${receiverName}'s ${eventType} is coming up on ${eventDate}.</p>
        <p>Don't forget to send your wishes!</p>
        <p>Best regards,<br>DearMinder Team</p>
      `
    }
  });

  if (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendWishEmail = async (userEmail: string, receiverName: string, eventType: string, customMessage?: string) => {
  const { error } = await supabase.functions.invoke('send-email', {
    body: {
      to: userEmail,
      subject: `Happy ${eventType}!`,
      html: `
        <h2>Happy ${eventType}!</h2>
        <p>Hello,</p>
        <p>This is a reminder that today is ${receiverName}'s ${eventType}.</p>
        ${customMessage ? `<p>Your custom message: ${customMessage}</p>` : ''}
        <p>Best regards,<br>DearMinder Team</p>
      `
    }
  });

  if (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}; 