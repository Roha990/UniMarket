from flask import jsonify

from ..common import errorWrapper, pageWrapper
from ..models import Skill
from ..extensions import db


def get_all_skills():
    skills = Skill.query.all()
    skills_list = [{'id': skill.id, 'name': skill.name} for skill in skills]
    return jsonify({"skills": skills_list}), 200