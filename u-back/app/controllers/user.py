from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from ..common import getRouterGroupURL
from ..services.user import get_user_info, update_user_info, delete_user, get_users, get_invitations, accept_invitation, get_user_projects, get_user_last_project, get_user_reviews, create_user_review

bp = Blueprint('user', __name__)
routeGroup = getRouterGroupURL('/user')

@bp.route(routeGroup + "/<int:user_id>", methods=['GET'])
def get_user(user_id):
    return get_user_info(user_id)

@bp.route(routeGroup + '/invitations', methods=['GET'])
@jwt_required()
def get_invitations_route():
    current_user_id = get_jwt_identity()
    return get_invitations(current_user_id)

@bp.route(routeGroup+'/invitations/<int:invitation_id>/accept', methods=['PUT'])
@jwt_required()
def accept_invitation_route(invitation_id):
    current_user_id = get_jwt_identity()
    return accept_invitation(invitation_id, current_user_id)

@bp.route(routeGroup + "/<int:user_id>", methods=['PUT'])
@jwt_required()
def update_user(user_id):
    if get_jwt()['user']['role'] != 'admin' and user_id!=get_jwt_identity():
        return {'message': 'Access denied'}, 403
    data = request.get_json()
    return update_user_info(user_id, data)

@bp.route(routeGroup, methods=['DELETE'])
@jwt_required()
def delete_user_route():
    user_id = get_jwt_identity()
    return delete_user(user_id)

@bp.route(routeGroup + '/users', methods=['GET'])
@jwt_required()
def get_all_users():
    skills = request.args.get('skills')
    project_id = request.args.get('project_id')
    page = request.args.get('page', 1, type=int)
    return get_users(page, skills, project_id)

@bp.route(routeGroup + '/<int:user_id>/projects', methods=['GET'])
def get_user_projects_route(user_id):
    return get_user_projects(user_id)

@bp.route(routeGroup + '/<int:user_id>/last-project', methods=['GET'])
def get_user_last_project_project(user_id):
    return get_user_last_project(user_id)

@bp.route(routeGroup+ '/<int:user_id>/reviews', methods=['GET'])
def get_user_reviews_route(user_id):
    return get_user_reviews(user_id)

@bp.route(routeGroup+'/<int:user_id>/reviews', methods=['POST'])
@jwt_required()
def create_user_review_route(user_id):
    return create_user_review(user_id, request.get_json(), get_jwt_identity())