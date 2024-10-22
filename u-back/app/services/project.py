from flask import jsonify, request

from ..common import pageWrapper
from ..models import Project, Invitation, User, UserProject
from ..extensions import db


def create_project(data):
    title = data.get('title')
    description = data.get('description')

    if not title or not description:
        return jsonify({"msg": "Missing title or description"}), 400

    new_project = Project(title=title, description=description)
    db.session.add(new_project)
    db.session.commit()

    return jsonify({"msg": "Project created successfully"}), 201


def get_projects(page):
    projects = Project.query.paginate(page, 10, False)
    total_elements = projects.total

    return pageWrapper([{
        "id": project.id,
        "title": project.title,
        "description": project.description
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
