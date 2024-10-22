from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_redis import FlaskRedis

db = SQLAlchemy()
jwt = JWTManager()
redis_store = FlaskRedis()
migrate = Migrate()
apiUrl = '/api'
