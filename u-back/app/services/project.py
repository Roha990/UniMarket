from flask import jsonify, request
from sqlalchemy import desc

from ..common import pageWrapper
from ..models import Project, Invitation, User, UserProject, Skill, ProjectSkill
from ..extensions import db


def create_project(data, creator_id):
    title = data.get('title')
    description = data.get('description')
    skills = data.get('skills', [])

    if not title or not description:
        return jsonify({"msg": "Missing title or description"}), 400

    new_project = Project(title=title, description=description, creator_id=creator_id)
    db.session.add(new_project)
    db.session.commit()

    for skill_name in skills:
        skill = Skill.query.filter_by(name=skill_name).first()
        if not skill:
            skill = Skill(name=skill_name)
            db.session.add(skill)
            db.session.commit()
        project_skill = ProjectSkill(project_id=new_project.id, skill_id=skill.id)
        db.session.add(project_skill)

    db.session.commit()
    user_project = UserProject(user_id=creator_id, project_id=new_project.id)
    db.session.add(user_project)
    db.session.commit()

    return jsonify({"msg": "Project created successfully"}), 201


def get_projects(page, direction, skills, status):
    query = Project.query

    if direction:
        query = query.filter(Project.direction == direction)

    if skills[0]:
        query = query.join(Project.skills).filter(Skill.id.in_(skills))

    if status:
        query = query.filter(Project.status == status)

    query = query.order_by(desc(Project.created_at))

    projects = query.paginate(page=page, per_page=10, error_out=False)
    total_elements = projects.total

    return pageWrapper([{
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "skills": [skill.name for skill in project.skills],
        "created_at": project.created_at,
    } for project in projects.items], page, total_elements)


def get_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"msg": "Project not found"}), 404

    return jsonify({
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "skills": [skill.name for skill in project.skills],
        "created_at": project.created_at,
        "creator_id": project.creator_id,
        "users": [user.username for user in project.users],
    }), 200


def update_project(project_id, data):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"msg": "Project not found"}), 404

    title = data.get('title')
    description = data.get('description')

    if title:
        project.title = title
    if description:
        project.description = description

    db.session.commit()

    return jsonify({"msg": "Project updated successfully"}), 200


def delete_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"msg": "Project not found"}), 404

    db.session.delete(project)
    db.session.commit()

    return jsonify({"msg": "Project deleted successfully"}), 200


def invite_user(project_id, current_user_id, data):
    user_id = data.get('user_id')

    project = Project.query.get_or_404(project_id)

    if int(project.creator_id) != int(current_user_id):
        return jsonify({"message": "You are not the creator of this project"}), 403

    if UserProject.query.filter_by(user_id=user_id, project_id=project_id).first():
        return jsonify({"message": "User is already a member of this project"}), 400

    invitation = Invitation(project_id=project_id, user_id=user_id, description=f"Invitation to join project {project.title}")
    db.session.add(invitation)
    db.session.commit()

    return jsonify({"message": "Invitation sent"}), 200

def get_project_users(project_id):
    project = Project.query.get_or_404(project_id)
    users = [
        {
            "id": user_project.user.id,
            "name": user_project.user.name,
            "role": user_project.role
        }
        for user_project in project.users
    ]
    return jsonify(users), 200


def update_user_role(project_id, user_id, current_user_id, data):
    role = data.get('role')

    project = Project.query.get_or_404(project_id)

    if project.creator_id != current_user_id:
        return jsonify({"message": "You are not the creator of this project"}), 403

    user_project = UserProject.query.filter_by(user_id=user_id, project_id=project_id).first()

    if not user_project:
        return jsonify({"message": "User is not a member of this project"}), 404

    user_project.role = role
    db.session.commit()

    return jsonify({"message": "User role updated"}), 200
