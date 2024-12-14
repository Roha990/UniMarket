from flask import jsonify, request
from sqlalchemy import desc, func
from sqlalchemy.orm import aliased

from ..common import pageWrapper
from ..models import Project, Invitation, User, UserProject, Skill, ProjectSkill, Direction, ProjectDirection, Message
from ..extensions import db


def create_project(data, creator_id):
    title = data.get('title')
    description = data.get('description')
    skills = data.get('skills', [])
    direction_id = data.get('direction')

    if not title or not description or not direction_id:
        return jsonify({"msg": "Missing required fields"}), 400

    new_project = Project(title=title, description=description, creator_id=creator_id)
    db.session.add(new_project)
    db.session.commit()

    project_direction = ProjectDirection(project_id=new_project.id, direction_id=direction_id)
    db.session.add(project_direction)
    db.session.commit()

    for skill in skills:
        skill = Skill.query.filter_by(id=skill).first()
        if not skill:
            return
        project_skill = ProjectSkill(project_id=new_project.id, skill_id=skill.id)
        db.session.add(project_skill)

    db.session.commit()
    user_project = UserProject(user_id=creator_id, project_id=new_project.id)
    db.session.add(user_project)
    db.session.commit()

    return jsonify({"msg": "Project created successfully"}), 201


def get_projects(page, direction, skills, status, current_user_id):
    query = Project.query

    if direction:
        query = query.filter(Project.direction_id == direction)

    if skills[0]:
        query = query.join(Project.skills).filter(Skill.id.in_(skills))

    if status:
        query = query.filter(Project.status == status)

    query = query.order_by(desc(Project.created_at))

    projects = query.paginate(page=page, per_page=10, error_out=False)
    total_elements = projects.total

    UserProjectAlias = aliased(UserProject)
    InvitationAlias = aliased(Invitation)

    project_list = []
    for project in projects.items:
        is_member = db.session.query(UserProjectAlias).filter_by(user_id=current_user_id, project_id=project.id).first() is not None
        has_invitation = db.session.query(InvitationAlias).filter_by(user_id=current_user_id, project_id=project.id, status='pending').first() is not None

        project_list.append({
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "skills": [skill.name for skill in project.skills],
            "created_at": project.created_at,
            "status": project.status,
            "direction": [direction.name for direction in project.directions],
            "is_member": is_member,
            "has_invitation": has_invitation
        })

    return pageWrapper(project_list, page, total_elements)


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
        "status": project.status,
        "direction": [direction.name for direction in project.directions],
        "users": [{"username": user.username, "id": user.id} for user in project.users],
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

    invitation = Invitation(project_id=project_id, user_id=user_id, description=f"Вы были приглашены присоединиться к проекту '{project.title}'", type='invitation')
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

def get_directions():
    directions = Direction.query.all()
    directions_list = [{'id': direction.id, 'name': direction.name} for direction in directions]
    return jsonify({
        "directions": directions_list,
    }), 200

def create_new_direction(data):
    direction_name = data.get('direction_name')

    new_direction = Direction(name=direction_name)
    db.session.add(new_direction)
    db.session.commit()

    return jsonify({
        "msg": "new direction added",
        "direction": {
            "id": new_direction.id,
            "name": new_direction.name
        }
    }), 201

def apply_to_project(project_id, current_user_id):
    project = Project.query.get_or_404(project_id)

    if UserProject.query.filter_by(user_id=current_user_id, project_id=project_id).first():
        return jsonify({"message": "Вы уже являетесь участником этого проекта."}), 400

    if Invitation.query.filter_by(user_id=current_user_id, project_id=project_id, status='pending', type='application').first():
        return jsonify({"message": "Вы уже подали заявку на участие в этом проекте."}), 400

    application = Invitation(project_id=project_id, user_id=current_user_id, description=f"Заявка на участие в проекте '{project.title}'", type='application')
    db.session.add(application)
    db.session.commit()

    return jsonify({"message": "Ваша заявка на участие в проекте успешно отправлена."}), 200

def get_applications(project_id, current_user_id):
    project = Project.query.get_or_404(project_id)

    if int(project.creator_id) != int(current_user_id):
        return jsonify({"message": "You are not the creator of this project"}), 403

    applications = Invitation.query.filter_by(project_id=project_id, status='pending', type='application').all()

    return jsonify([{
        "id": application.id,
        "user_id": application.user_id,
        "description": application.description,
        "status": application.status
    } for application in applications]), 200

def accept_application(application_id, current_user_id):
    application = Invitation.query.filter_by(id=application_id, status='pending', type='application').first()

    if not application:
        return jsonify({"message": "No pending application found"}), 404

    project = Project.query.get_or_404(application.project_id)

    if int(project.creator_id) != int(current_user_id):
        return jsonify({"message": "You are not the creator of this project"}), 403

    user_project = UserProject(user_id=application.user_id, project_id=application.project_id, role='member')
    db.session.add(user_project)
    db.session.delete(application)
    db.session.commit()

    return jsonify({"message": "Application accepted"}), 200

def decline_application(application_id, current_user_id):
    application = Invitation.query.filter_by(id=application_id, status='pending', type='application').first()

    if not application:
        return jsonify({"message": "No pending application found"}), 404

    project = Project.query.get_or_404(application.project_id)

    if int(project.creator_id) != int(current_user_id):
        return jsonify({"message": "You are not the creator of this project"}), 403

    db.session.delete(application)
    db.session.commit()

    return jsonify({"message": "Application accepted"}), 200

def get_message(project_id):
    messages = Message.query.filter_by(project_id=project_id).order_by(Message.created_at.asc()).all()
    return jsonify([{
        "id": message.id,
        "user_id": message.user_id,
        "username": message.user.username,
        "content": message.content,
        "created_at": message.created_at
    } for message in messages]), 200



def send_message(project_id, data, user_id):
    content = data.get('content')

    if not user_id or not content:
        return jsonify({"message": "User ID and content are required"}), 400

    project = Project.query.get_or_404(project_id)
    user = User.query.get_or_404(user_id)

    if user not in project.users:
        return jsonify({"message": "You are not a member of this project"}), 403

    message = Message(project_id=project_id, user_id=user_id, content=content)
    db.session.add(message)
    db.session.commit()

    return jsonify({"message": "Message sent"}), 200

def is_member(project_id, current_user_id):
    if not current_user_id:
        return jsonify({"message": "User ID is required"}), 400

    is_member = UserProject.query.filter_by(user_id=current_user_id, project_id=project_id).first() is not None

    return jsonify({"is_member": is_member}), 200

def get_similar_projects(project_id):
    project = Project.query.get_or_404(project_id)

    project_skills = [skill.id for skill in project.skills]
    project_directions = [direction.id for direction in project.directions]

    similar_projects = (
        Project.query
        .join(Project.skills)
        .join(Project.directions)
        .filter(
            (Project.id != project_id) &
            (
                (Skill.id.in_(project_skills)) |
                (Direction.id.in_(project_directions))
            )
        )
        .order_by(func.random())
        .limit(5)
        .all()
    )

    return jsonify([{
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "skills": [skill.name for skill in project.skills],
        "created_at": project.created_at,
        "status": project.status,
        "direction": [direction.name for direction in project.directions],
    } for project in similar_projects]), 200