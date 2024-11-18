from flask import jsonify

from ..common import errorWrapper, pageWrapper
from ..models import User, Skill, UserSkill
from ..extensions import db


def get_user_info(user_id):
    user = User.query.get(user_id)
    if not user:
        return errorWrapper("USER_NOT_FOUND")

    return jsonify({
        "id": user.id,
        "username": user.username,
        "role": user.role,
        "description": user.description,
        "rating": user.rating,
        "phone_number": user.phone_number,
        "full_name": user.full_name,
        "email": user.email,
        "skills": [skill.name for skill in user.skills],
    }), 200


def get_users(page):
    users = User.query.paginate(page=page, per_page=10, error_out=False)
    total_elements = users.total

    return pageWrapper([{
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "rating": user.rating,
        "description": user.description,
        "email": user.email,
        "role": user.role,
        "phone_number": user.phone_number,
    } for user in users.items], page, total_elements)


def update_user_info(user_id, data):
    user = User.query.get(user_id)
    if not user:
        return errorWrapper("USER_NOT_FOUND")

    if 'full_name' in data:
        user.full_name = data['full_name']
    if 'password' in data:
        user.set_password(data['password'])
    if 'rating' in data:
        user.rating = data['rating']
    if 'description' in data:
        user.description = data['description']
    if 'email' in data:
        user.email = data['email']
    if 'phone_number' in data:
        user.phone_number = data['phone_number']
    if 'role' in data:
        user.role = data['role']
    if 'skills' in data:
        new_skills = data['skills']
        current_skills = {skill.id for skill in user.skills}
        for skill_name in new_skills:
            skill = Skill.query.filter_by(name=skill_name).first()
            if not skill:
                skill = Skill(name=skill_name)
                db.session.add(skill)
                db.session.commit()
            if skill.id not in current_skills:
                user_skill = UserSkill(user_id=user.id, skill_id=skill.id)
                db.session.add(user_skill)
        for skill in user.skills:
            if skill.name not in new_skills:
                user_skill = UserSkill.query.filter_by(user_id=user.id, skill_id=skill.id).first()
                if user_skill:
                    db.session.delete(user_skill)

    db.session.commit()

    return jsonify({"msg": "User updated successfully"}), 200


def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return errorWrapper("USER_NOT_FOUND")

    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "User deleted successfully"}), 200
