const NOTIFICATION_API_URL = 'http://localhost:5000/api';

export interface NotificationPayload {
  type: 'email' | 'sms';
  to: string;
  subject?: string;  // Required for email
  body: string;
}

export const sendNotification = async (payload: NotificationPayload) => {
  try {
    const response = await fetch(`${NOTIFICATION_API_URL}/send-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send notification');
    }

    return data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}; 