from flask import jsonify, request, current_app
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity
from ..models import User
from ..extensions import db, redis_store


def register_user(data):
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


def login_user(data):
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or user.password != password:
        return jsonify({"msg": "Invalid username or password"}), 401

    access_token = create_access_token(identity={'id': user.id, 'role': user.role})
    refresh_token = create_refresh_token(identity={'id': user.id, 'role': user.role})

    redis_store.set(f'refresh_token_{user.id}', refresh_token, ex=current_app.config['JWT_REFRESH_TOKEN_EXPIRES'])

    return jsonify(access_token=access_token, refresh_token=refresh_token), 200


def refresh_token():
    identity = get_jwt_identity()
    user_id = identity['id']
    refresh_token = request.headers.get('Authorization').split()[1]

    if str(redis_store.get(f'refresh_token_{user_id}'))[2:-1] != refresh_token:
        return jsonify({"msg": "Invalid refresh token"}), 401

    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token), 200
