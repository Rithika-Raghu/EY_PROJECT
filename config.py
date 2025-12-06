import os, secrets
from datetime import timedelta


basedir = os.path.abspath(os.path.dirname(__file__))

class Config():

    DEBUG = False
    SQLITE_DB_DIR = None

    SQLALCHEMY_DATABASE_URI = None

    SQLAlCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = None

    JWT_SECRET_KEY = None

class DevelopmentConfig(Config):

    DEBUG = True


    SQLITE_DB_DIR= os.path.join(basedir, './database')

    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(SQLITE_DB_DIR, 'db.sqlite3')

    SECRET_KEY = 'this-is-a-secret-key'

    JWT_SECRET_KEY = 'house-hold'

    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authorization'

    CACHE_TYPE = 'RedisCache'
    CACHE_DEFAULT_TIMEOUT = 30
    CACHE_REDIS_PORT = 6379

    