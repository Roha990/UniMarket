from flask import jsonify

from ..common import errorWrapper, pageWrapper
from ..models import Skill
from ..extensions import db


def get_all_skills():
    skills = Skill.query.all()
    skills_list = [{'id': skill.id, 'name': skill.name} for skill in skills]
    return jsonify({"skills": skills_list}), 200

def create_new_skill(data):
    skill_name = data.get('skill_name')

    new_skill = Skill(name=skill_name)
    db.session.add(new_skill)
    db.session.commit()

    return jsonify({
        "msg": "new skill added",
        "skill": {
            "id": new_skill.id,
            "name": new_skill.name
        }
    }), 201
