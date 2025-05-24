from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import requests

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# SendGrid configuration
SENDGRID_API_KEY = '871775c0-1687-4034-ad73-38b27d7fd977'  # Replace with your SendGrid API key
FROM_EMAIL = 'eng23ct0025@dsu.edu.in'

# TextBelt configuration (for SMS)
TEXTBELT_API_KEY = 'c47c962e4089c18bcaee264e6ba4b3d63a662fafeYPtx1cxYC2d78s2S2u8VZG5n'
DEFAULT_PHONE = '+918087861289'

def send_email(to_email: str, subject: str, body: str):
    try:
        print(f"Preparing to send email to {to_email}")
        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=to_email,
            subject=subject,
            plain_text_content=body
        )
        
        print("Initializing SendGrid client...")
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        
        print("Sending email...")
        response = sg.send(message)
        print(f"Email sent successfully! Status code: {response.status_code}")
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

def send_sms(to_number: str, message: str):
    try:
        print(f"Sending SMS to {to_number}")
        response = requests.post('https://textbelt.com/text', {
            'phone': to_number,
            'message': message,
            'key': TEXTBELT_API_KEY,
        })
        result = response.json()
        print(f"SMS sending result: {result}")
        return result
    except Exception as e:
        print(f"Error sending SMS: {str(e)}")
        return {'success': False, 'error': str(e)}

@app.route('/api/send-notification', methods=['POST'])
def send_notification():
    try:
        data = request.json
        notification_type = data.get('type', 'email')  # 'email' or 'sms'
        to = data.get('to', DEFAULT_PHONE)  # Use default phone if not specified
        subject = data.get('subject', 'Notification')  # for email
        body = data.get('body')

        if not body:
            return jsonify({
                'success': False,
                'error': 'Missing required field: body'
            }), 400

        if notification_type == 'email':
            if not to or '@' not in to:
                return jsonify({
                    'success': False,
                    'error': 'Invalid email address'
                }), 400
            success = send_email(to, subject, body)
            if success:
                return jsonify({
                    'success': True,
                    'message': 'Email sent successfully'
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to send email'
                }), 500

        elif notification_type == 'sms':
            result = send_sms(to, body)
            return jsonify(result)

        else:
            return jsonify({
                'success': False,
                'error': 'Invalid notification type'
            }), 400

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 