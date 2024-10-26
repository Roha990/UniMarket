from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from ..common import getRouterGroupURL
from ..services.auth import register_user, login_user, refresh_token

bp = Blueprint('auth', __name__)
routeGroup = getRouterGroupURL('/auth')


@bp.route(routeGroup + '/register', methods=['POST'])
def register():
    data = request.get_json()
    return register_user(data)


@bp.route(routeGroup + '/test', methods=['GET'])
def test():
    return "1234"


@bp.route(routeGroup + '/login', methods=['POST'])
def login():
    data = request.get_json()
    return login_user(data)


@bp.route(routeGroup + '/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    return refresh_token()
