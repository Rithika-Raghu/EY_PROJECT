from database.models import *
from .security import user_datastore
from flask_restful import Resource, reqparse,request
from werkzeug.security import generate_password_hash, check_password_hash


class Signup(Resource):
    def post(self):
        data = request.get_json()
        print(data)

        email = data.get("email")
        username = data.get("username")
        password = data.get("password")

        if user_datastore.find_user(email=email):
            return {"message": "Email already registered"}, 400

        try:
            user = user_datastore.create_user(
                email=email,
                username=username,
                password=generate_password_hash(password)
            )

            db.session.commit()

            return {"message": "User created", "id": user.id}, 201

        except Exception as e:
            db.session.rollback()
            return {"message": str(e)}, 500


class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        # ✅ BYPASS user_datastore - Direct SQLAlchemy query
        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return {"message": "Invalid credentials"}, 401

        return {
            "message": "Login success",
            "user": {
                "id": user.id,
                "username": user.username or user.email,
                "email": user.email,
                "role": user.role  # Direct access - no getattr needed
            }
        }, 200