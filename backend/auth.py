from flask_restful import Resource
from flask import request
from services.database import DatabaseService
from backend.otp_auth import send_otp_email
from dotenv import load_dotenv

db_service = DatabaseService()
load_dotenv()

class Signup(Resource):
    def post(self):
        data = request.get_json()
        
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        otp = data.get('otp')
        mobile = data.get('mobile')

        check_user = db_service.get_user_by_email(email)
        if check_user:
            return {
                'success': False,
                'message': 'Email already registered'
            }, 400
        
        otp_data = db_service.get_otp_verification(email)
        if not otp_data:
            return {
                'success': False,
                'message': 'OTP not found. Please request a new OTP.'
            }, 400
        
        if otp_data['otp_code'] != otp:
            return {
                'success': False,
                'message': 'Invalid OTP. Please try again.'
            }, 400
        
        user_id = db_service.create_user(username, email, password, phone=mobile)
        
        if user_id:
            return {
                'success': True,
                'message': 'Account created successfully',
                'userid': user_id
            }, 201
        else:
            return {
                'success': False,
                'message': 'Email already exists'
            }, 400
        
class SendOTP(Resource):
    def post(self):
        data = request.get_json()
        
        email = data.get('email')
        check_user = db_service.get_user_by_email(email)
        if check_user:
            return {
                'success': False,
                'message': 'Email already registered'
            }, 400
        
        otp = send_otp_email(email)
        
        if otp:
            db_service.create_otp_verification(email, str(otp))
            return {
                'success': True,
                'message': 'OTP sent successfully',
                'otp': otp  # In real applications, do not send OTP back in response
            }, 200
        else:
            return {
                'success': False,
                'message': 'Failed to send OTP'
            }, 500


class Login(Resource):
    def post(self):
        data = request.get_json()
        
        email = data.get('email')
        password = data.get('password')
        
        user = db_service.get_user_by_email(email)
        
        if user and db_service.verify_password(user['password'], password):
            return {
                'success': True,
                'user': {
                    'userid': user['id'],
                    'username': user['username'],
                    'email': user['email'],
                    'role': user['role']
                }
            }, 200
        else:
            return {
                'success': False,
                'message': 'Invalid credentials'
            }, 401
