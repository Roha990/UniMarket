from flask import jsonify, request

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

    return jsonify({"msg": "Project created successfully"}), 201


def get_projects(page, direction, skills, status):
    query = Project.query

    if direction:
        query = query.filter(Project.direction == direction)

    if skills[0]:
        query = query.join(Project.skills).filter(Skill.id.in_(skills))

    if status:
        query = query.filter(Project.status == status)

    projects = query.paginate(page=page, per_page=10, error_out=False)
    total_elements = projects.total

    return pageWrapper([{
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "skills": [skill.name for skill in project.skills],
    } for project in projects.items], page, total_elements)


def get_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"msg": "Project not found"}), 404

    return jsonify({
        "id": project.id,
        "title": project.title,
        "description": project.description
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


def invite_user(project_id, data, created_project_id):
    user_id = data.get('user_id')
    project = Project.query.get(project_id)

    if not project or project.creator_id != created_project_id:
        return jsonify({"msg": "Project not found or you are not the creator"}), 404

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    invitation = Invitation(project_id=project_id, user_id=user_id)
    db.session.add(invitation)
    db.session.commit()

    return jsonify({"msg": "User invited successfully"}), 201


def accept_invitation(invitation_id, user_id):
    invitation = Invitation.query.get(invitation_id)
    if not invitation:
        return jsonify({"msg": "Invitation not found"}), 404

    if invitation.user_id != user_id:
        return jsonify({"msg": "You are not the recipient of this invitation"}), 403

    invitation.status = 'accepted'
    db.session.commit()

    user_project = UserProject(user_id=invitation.user_id, project_id=invitation.project_id)
    db.session.add(user_project)
    db.session.commit()

    return jsonify({"msg": "Invitation accepted successfully"}), 200


def reject_invitation(invitation_id, user_id):
    invitation = Invitation.query.get(invitation_id)
    if not invitation:
        return jsonify({"msg": "Invitation not found"}), 404

    if invitation.user_id != user_id:
        return jsonify({"msg": "You are not the recipient of this invitation"}), 403

    invitation.status = 'rejected'
    db.session.commit()

    return jsonify({"msg": "Invitation rejected successfully"}), 200
