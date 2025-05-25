from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS
import requests

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Google Apps Script configuration
GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfN4_ORJIqZK8r9GcTs293ENxd3hyrSoUa1D8SAW78L2siU0t5iTzPI5b8CKnN9cv7CQ/exec'  # Remove the 'L' at the end
FROM_EMAIL = 'eng23ct0025@dsu.edu.in'  # Your authorized Gmail address

def send_email(to_email: str, subject: str, body: str):
    try:
        print(f"Preparing to send email to {to_email}")
        payload = {
            'to': to_email,
            'subject': subject,
            'html': body
        }
        
        print(f"Sending request to Google Apps Script: {GOOGLE_SCRIPT_URL}")
        response = requests.post(GOOGLE_SCRIPT_URL, json=payload)
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.text}")
        
        try:
            result = response.json()
            if result.get('success'):
                print("Email sent successfully!")
                return True
            else:
                print(f"Failed to send email: {result.get('error')}")
                return False
        except Exception as e:
            print(f"Error parsing response JSON: {str(e)}")
            return False
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