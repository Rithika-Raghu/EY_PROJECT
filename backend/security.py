from flask_security import Security, SQLAlchemyUserDatastore
from database.models import db, User, Role
from flask import current_app as app
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security()