from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt,get_jwt_identity
from ..common import getRouterGroupURL
from ..services.project import (create_project, get_projects, get_project, update_project, delete_project, update_user_role, get_project_users,
                                invite_user, get_directions, apply_to_project, get_applications, accept_application, get_message, send_message, is_member, create_new_direction)

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
    current_user_id = request.args.get('current_user_id')
    return get_projects(page, direction, skills, status, current_user_id)


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

@bp.route(routeGroup + '/directions', methods=['GET'])
def get_directions_route():
 return get_directions()

@bp.route(routeGroup + '/applications/apply', methods=['POST'])
@jwt_required()
def apply_to_project_route():
    data = request.json
    project_id = data.get('project_id')
    current_user_id = get_jwt_identity()
    return apply_to_project(project_id, current_user_id)

@bp.route(routeGroup + '/applications/<int:project_id>', methods=['GET'])
@jwt_required()
def get_applications_route(project_id):
    current_user_id = get_jwt_identity()
    return get_applications(project_id, current_user_id)

@bp.route(routeGroup + '/applications/accept/<int:application_id>', methods=['POST'])
@jwt_required()
def accept_application_route(application_id):
    current_user_id = get_jwt_identity()
    return accept_application(application_id, current_user_id)

@bp.route( routeGroup +'/<int:project_id>/messages', methods=['GET'])
@jwt_required()
def get_messages_route(project_id):
    return get_message(project_id)

@bp.route(routeGroup +'/<int:project_id>/messages', methods=['POST'])
@jwt_required()
def send_message_route(project_id):
    data = request.json
    return send_message(project_id, data, get_jwt_identity())

@bp.route(routeGroup +'/<int:project_id>/is_member', methods=['GET'])
def is_member_route(project_id):
    return is_member(project_id, request.args.get('current_user_id'))

@bp.route(routeGroup +'/directions', methods=['POST'])
def create_new_direction_route():
    data = request.json
    return create_new_direction(data)