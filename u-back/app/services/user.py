from flask import jsonify

from ..common import errorWrapper, pageWrapper
from ..models import User, Skill, UserSkill, Invitation, UserProject, Project, Review
from ..extensions import db
from sqlalchemy import desc


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

def get_invitations(current_user_id):
    invitations = Invitation.query.filter_by(user_id=current_user_id, status='pending', type='invitation').all()

    return jsonify([{
        "id": invitation.id,
        "project_id": invitation.project_id,
        "description": invitation.description,
        "status": invitation.status
    } for invitation in invitations]), 200


def accept_invitation(invitation_id, current_user_id):
    invitation = Invitation.query.filter_by(id=invitation_id, user_id=current_user_id, status='pending', type='invitation').first()

    if not invitation:
        return jsonify({"message": "No pending invitation found"}), 404

    invitation.status = 'accepted'
    user_project = UserProject(user_id=current_user_id, project_id=invitation.project_id, role='member')
    db.session.add(user_project)
    db.session.commit()

    return jsonify({"message": "Invitation accepted"}), 200

def get_users(page, skills, project_id):
    query = User.query

    if skills:
        skill_ids = skills.split(',')
        query = query.join(User.skills).filter(Skill.id.in_(skill_ids))
    if project_id:
        subquery = db.session.query(UserProject.user_id).filter_by(project_id=project_id)
        query = query.filter(~User.id.in_(subquery))

        subquery = db.session.query(Invitation.user_id).filter_by(project_id=project_id, status='pending')
        query = query.filter(~User.id.in_(subquery))

        query = query.join(User.projects).filter(Project.id == project_id)
        query = query.order_by(desc(Project.created_at))
    users = query.paginate(page=page, per_page=10, error_out=False)
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
        "skills": [skill.name for skill in user.skills],
    } for user in users.items], page, total_elements)

def get_user_projects(user_id):
    projects = db.session.query(Project).join(UserProject).filter(UserProject.user_id == user_id).all()
    return jsonify([{
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "status": project.status,
        "created_at": project.created_at.isoformat()
    } for project in projects]), 200

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

def get_user_last_project(user_id):
    last_project = (
        db.session.query(Project)
        .join(UserProject, UserProject.project_id == Project.id)
        .filter(UserProject.user_id == user_id)
        .order_by(Project.created_at.desc())
        .first()
    )

    if not last_project:
        return jsonify({"message": "No projects found"}), 404

    return jsonify({
        "id": last_project.id,
        "title": last_project.title,
        "description": last_project.description,
        "status": last_project.status,
        "created_at": last_project.created_at.isoformat()
    }), 200

def get_user_reviews(user_id):
    reviews = Review.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": review.id,
        "reviewer": review.reviewer.username,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at.isoformat()
    } for review in reviews]), 200

def create_user_review(user_id, data, reviewer_id):
    rating = data.get('rating')
    comment = data.get('comment')

    if not rating or not comment:
        return jsonify({"msg": "Missing rating or comment"}), 400

    new_review = Review(user_id=user_id, reviewer_id=reviewer_id, rating=rating, comment=comment)
    db.session.add(new_review)
    db.session.commit()

    reviews = Review.query.filter_by(user_id=user_id).all()

    total_rating = sum(review.rating for review in reviews)

    average_rating = total_rating / len(reviews)

    user = User.query.get(user_id)
    user.rating = average_rating
    db.session.commit()

    return jsonify({"msg": "Review created successfully"}), 201