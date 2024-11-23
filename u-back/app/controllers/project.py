from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt,get_jwt_identity
from ..common import getRouterGroupURL
from ..services.project import create_project, get_projects, get_project, update_project, delete_project, update_user_role, get_project_users, invite_user

bp = Blueprint('project', __name__)
routeGroup = getRouterGroupURL('/project')

@bp.route(routeGroup + '/create', methods=['POST'])
@jwt_required()
def create_project_route():
    data = request.get_json()
    return create_project(data, get_jwt_identity())


@bp.route(routeGroup + '/list', methods=['GET'])
def get_projects_route():
    page = request.args.get('page', 1, type=int)
    direction = request.args.get('direction', None)
    skills = request.args.get('skills', '').split(',')
    status = request.args.get('status', '')
    return get_projects(page, direction, skills, status)


@bp.route(routeGroup + '/<int:project_id>', methods=['GET'])
def get_project_route(project_id):
    return get_project(project_id)


@bp.route('/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project_route(project_id):
    data = request.get_json()
    return update_project(project_id, data)


@bp.route(routeGroup+'/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project_route(project_id):
    return delete_project(project_id)

@bp.route(routeGroup + '/<int:project_id>/invite', methods=['POST'])
@jwt_required()
def invite_user_route(project_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    return invite_user(project_id, current_user_id, data)

@bp.route(routeGroup+'/<int:project_id>/users', methods=['GET'])
@jwt_required()
def get_project_users_route(project_id):
    return get_project_users(project_id)

@bp.route( routeGroup+ '/<int:project_id>/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_project_user_role(project_id, user_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    return update_user_role(project_id, user_id, current_user_id, data)