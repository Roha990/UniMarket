from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..common import getRouterGroupURL
from ..services.project import create_project, get_projects, get_project, update_project, delete_project, invite_user, \
    accept_invitation, reject_invitation

bp = Blueprint('project', __name__)
routeGroup = getRouterGroupURL('/project')

@bp.route(routeGroup + '/create', methods=['POST'])
@jwt_required()
def create_project_route():
    data = request.get_json()
    return create_project(data, get_jwt_identity()['id'])


@bp.route(routeGroup + '/list', methods=['GET'])
def get_projects_route():
    page = request.args.get('page', 1, type=int)
    direction = request.args.get('direction', None)
    skills = request.args.get('skills', '').split(',')
    status = request.args.get('status', '')
    return get_projects(page, direction, skills, status)


@bp.route('/projects/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project_route(project_id):
    return get_project(project_id)


@bp.route('/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project_route(project_id):
    data = request.get_json()
    return update_project(project_id, data)


@bp.route('/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project_route(project_id):
    return delete_project(project_id)


@bp.route('/projects/<int:project_id>/invite', methods=['POST'])
@jwt_required()
def invite_user_route(project_id):
    data = request.get_json()
    creator_project_id = get_jwt_identity()['id']
    return invite_user(project_id, data, creator_project_id)


@bp.route('/invitations/<int:invitation_id>/accept', methods=['POST'])
@jwt_required()
def accept_invitation_route(invitation_id):
    user_id = get_jwt_identity()['id']
    return accept_invitation(invitation_id, user_id)


@bp.route('/invitations/<int:invitation_id>/reject', methods=['POST'])
@jwt_required()
def reject_invitation_route(invitation_id):
    user_id = get_jwt_identity()['id']
    return reject_invitation(invitation_id, user_id)
