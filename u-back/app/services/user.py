from flask import jsonify

from ..common import errorWrapper, pageWrapper
from ..models import User
from ..extensions import db


def get_user_info(user_id):
    user = User.query.get(user_id)
    if not user:
        return errorWrapper("USER_NOT_FOUND")

    return jsonify({
        "id": user.id,
        "username": user.username,
        "role": user.role
    }), 200


def get_users(page):
    users = User.query.paginate(page, 10, False)
    total_elements = users.total

    return pageWrapper([{
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "rating": user.rating,
        "description": user.description,
        "email": user.email,
        "phone_number": user.phone_number,
        "role": user.role
    } for user in users.items], page, total_elements)


def update_user_info(user_id, data):
    user = User.query.get(user_id)
    if not user:
        return errorWrapper("USER_NOT_FOUND")

    username = data.get('username')
    password = data.get('password')

    if username:
        user.username = username
    if password:
        user.password = password

    db.session.commit()

    return jsonify({"msg": "User updated successfully"}), 200


def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return errorWrapper("USER_NOT_FOUND")

    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "User deleted successfully"}), 200
