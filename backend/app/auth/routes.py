from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from .ldap import authenticate




auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = (data or {}).get('username')
    password = (data or {}).get('password')

    if not username or not password:
        return jsonify({'msg': 'Username and password are required'}), 400

    admin_username = current_app.config.get('ADMIN_USERNAME')
    admin_password = current_app.config.get('ADMIN_PASSWORD')

    if admin_username and admin_password:
        if username == admin_username and password == admin_password:
            token = create_access_token(identity=username)
            return jsonify({'token': token, 'username': username})

    if not authenticate(username, password):
        return jsonify({'msg': 'Invalid credentials'}), 401


    token = create_access_token(identity=username)
    return jsonify({'token': token, 'username': username})
