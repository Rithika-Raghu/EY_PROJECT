from flask_restful import Resource
from flask import request
from services.database import DatabaseService

db_service = DatabaseService()

class Signup(Resource):
    def post(self):
        data = request.get_json()
        
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        user_id = db_service.create_user(username, email, password)
        
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
