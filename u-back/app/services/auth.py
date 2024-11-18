from flask import jsonify, request, current_app
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity

from ..common import errorWrapper
from ..models import User
from ..extensions import db, redis_store


def register_user(data):
    username = data.get('username')
    password = data.get('password')
    role = "user"

    if not username or not password or not role:
        return errorWrapper("EMPTY_FIELDS")

    if User.query.filter_by(username=username).first():
        return errorWrapper("USER_EXISTS")

    new_user = User(username=username, role=role)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"}), 201


def login_user(data):
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return errorWrapper("INCORRECT_DATA")

    access_token = create_access_token(identity={'id': user.id, 'role': user.role, 'full_name':user.full_name})
    refresh_token = create_refresh_token(identity={'id': user.id, 'role': user.role,'full_name':user.full_name})

    redis_store.set(f'refresh_token_{user.id}', refresh_token, ex=current_app.config['JWT_REFRESH_TOKEN_EXPIRES'])

    return jsonify(access_token=access_token, refresh_token=refresh_token), 200


def refresh_token():
    identity = get_jwt_identity()
    user_id = identity['id']
    refresh_token = request.headers.get('Authorization').split()[1]

    if str(redis_store.get(f'refresh_token_{user_id}'))[2:-1] != refresh_token:
        return errorWrapper("INVALID_REFRESH_TOKEN")

    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token), 200
