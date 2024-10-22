from flask import jsonify
from ..models import User
from ..extensions import db


def get_user_info(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "role": user.role
    }), 200


def update_user_info(user_id, data):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

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
        return jsonify({"msg": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "User deleted successfully"}), 200
