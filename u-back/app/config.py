import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'secret key')
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(
        user=os.getenv('USER_DB'),
        pw=os.getenv('USER_PASSWORD'),
        url=os.getenv('DB_URL'),
        db=os.getenv('DB_NAME')
    )
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    REDIS_URL = os.getenv('REDIS_URL', 'redis://redis:6379/0')
    DEBUG = os.getenv('DEBUG', True)
