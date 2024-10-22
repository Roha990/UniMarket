from flask import jsonify

from .extensions import apiUrl


def errorWrapper(errorCode, errorData=None):
    return jsonify({
        "type": "OPERATION",
        "details": {
            "code": errorCode,
            "data": errorData,
        }
    }), 400


def pageWrapper(data, page, totalElements):
    return jsonify({
        "items": data,
        "pagination": {
            "page": page,
            "totalElements": totalElements,
        }
    }), 200


def getRouterGroupURL(routerGroup):
    return apiUrl + routerGroup
