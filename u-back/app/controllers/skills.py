from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from ..common import getRouterGroupURL
from ..services.skills import get_all_skills, create_new_skill

bp = Blueprint('skills', __name__)
routeGroup = getRouterGroupURL('/skills')

@bp.route(routeGroup, methods=['GET'])
def get_skills():
    return get_all_skills()

@bp.route(routeGroup, methods=['POST'])
@jwt_required()
def create_skills():
    if get_jwt()['user']['role'] != 'admin':
        return {'message': 'Access denied'}, 403
    data = request.get_json()
    return create_new_skill(data)