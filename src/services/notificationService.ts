const NOTIFICATION_API_URL = 'http://localhost:5000/api';

export interface NotificationPayload {
  type: 'email' | 'sms';
  to: string;
  subject?: string;  // Required for email
  body: string;
}

export const sendNotification = async (payload: NotificationPayload) => {
  try {
    console.log('Sending notification to:', NOTIFICATION_API_URL);
    const response = await fetch(`${NOTIFICATION_API_URL}/send-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Could not connect to the notification server. Is it running?');
      throw new Error('Could not connect to the notification server. Please make sure it is running.');
    }
    console.error('Error sending notification:', error);
    throw error;
  }
};