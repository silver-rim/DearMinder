import React, { useState } from 'react';
import { sendNotification } from '@/services/notificationService';

export function NotificationTest() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+918087861289');  // Default phone number
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleEmailNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending email...');
    try {
      const response = await sendNotification({
        type: 'email',
        to: email,
        subject: 'Test Notification',
        body: message
      });
      if (response.success) {
        setStatus('Email sent successfully!');
      } else {
        setStatus(`Failed to send email: ${response.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      setStatus(`Failed to send email: ${error.message || error}`);
    }
  };

  const handleSMSNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending SMS...');
    try {
      const response = await sendNotification({
        type: 'sms',
        to: phone,
        body: message
      });
      if (response.success) {
        setStatus('SMS sent successfully!');
      } else {
        setStatus(`Failed to send SMS: ${response.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      setStatus(`Failed to send SMS: ${error.message || error}`);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Test Notifications</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Send Email</h3>
          <form onSubmit={handleEmailNotification} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Recipient's email"
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Send Email
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Send SMS</h3>
          <form onSubmit={handleSMSNotification} className="space-y-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Recipient's phone number (with country code)"
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Send SMS
            </button>
          </form>
        </div>

        {status && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <p>{status}</p>
          </div>
        )}
      </div>
    </div>
  );
} 