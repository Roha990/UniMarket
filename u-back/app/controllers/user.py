from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..common import getRouterGroupURL
from ..services.user import get_user_info, update_user_info, delete_user

bp = Blueprint('user', __name__)
routeGroup = getRouterGroupURL('/user')


@bp.route(routeGroup, methods=['GET'])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()['id']
    return get_user_info(user_id)


@bp.route(routeGroup, methods=['PUT'])
@jwt_required()
def update_user():
    user_id = get_jwt_identity()['id']
    data = request.get_json()
    return update_user_info(user_id, data)


@bp.route(routeGroup, methods=['DELETE'])
@jwt_required()
def delete_user_route():
    user_id = get_jwt_identity()['id']
    return delete_user(user_id)
