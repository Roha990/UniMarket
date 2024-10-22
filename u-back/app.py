import os
from datetime import timedelta

from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from flask_redis import FlaskRedis
from flask_sqlalchemy import SQLAlchemy


load_dotenv()
app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'secret key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=os.getenv('USER_DB'),
                                                                                              pw=os.getenv('USER_PASSWORD'),
                                                                                              url=os.getenv('DB_URL'),
                                                                                              db=os.getenv('DB_NAME'))
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=10)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['REDIS_URL'] = 'redis://localhost:6379/0'
app.config['DEBUG'] = True

db = SQLAlchemy(app)
jwt = JWTManager(app)
redis_store = FlaskRedis(app)
CORS(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(50), nullable=False)


with app.app_context():
    db.create_all()


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = "user"

    if not username or not password or not role:
        return jsonify({"msg": "Missing username, password or role"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 400

    new_user = User(username=username, password=password, role=role)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or user.password != password:
        return jsonify({"msg": "Invalid username or password"}), 401

    access_token = create_access_token(identity={'id': user.id, 'role': user.role})
    refresh_token = create_refresh_token(identity={'id': user.id, 'role': user.role},)

    redis_store.set(f'refresh_token_{user.id}', refresh_token, ex=app.config['JWT_REFRESH_TOKEN_EXPIRES'])

    return jsonify(access_token=access_token, refresh_token=refresh_token), 200


@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    user_id = identity['id']
    refresh_token = request.headers.get('Authorization').split()[1]

    if str(redis_store.get(f'refresh_token_{user_id}'))[2:-1] != refresh_token:
        return jsonify({"msg": "Invalid refresh token"}), 401

    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token), 200


@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


if __name__ == '__main__':
    app.run()
