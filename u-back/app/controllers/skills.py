from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..common import getRouterGroupURL
from ..services.skills import get_all_skills

bp = Blueprint('skills', __name__)
routeGroup = getRouterGroupURL('/skills')

@bp.route(routeGroup, methods=['GET'])
def get_skills():
    return get_all_skills()