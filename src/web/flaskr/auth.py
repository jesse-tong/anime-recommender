from flask import Blueprint, url_for, request, make_response, Response
from werkzeug.security import generate_password_hash, check_password_hash
from web.flaskr.models import User
from web.flaskr.global_vars import db
import json
from flask_login import login_user, login_required, current_user, logout_user
from flask_cors import CORS
from flask_wtf.csrf import generate_csrf

auth = Blueprint('auth', __name__)

#Since we send CSRF token from the headers, we need to expose it through CORS 
# or the browser and frontend would not get
CORS(auth, supports_credentials=True, origins = r"https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))",
    expose_headers=['X-CSRFToken'])

#This is used to generate csrf token when the client requests this
@auth.route('/auth/csrf_token', methods=['GET', 'HEAD'])
def set_xsrf_cookie():
    response = make_response('')
    csrf_token = generate_csrf()
    response.set_cookie('X-CSRFToken', csrf_token)
    response.headers.add('X-CSRFToken', csrf_token)
    return response

@auth.route('/auth/login', methods=['POST'])
def login():
    login_data = request.form
    email = login_data.get('email')
    password = login_data.get('password')
    remember = True if login_data.get('remember') != None else False

    user = User.query.filter_by(email=email).first()
    if not user or not (check_password_hash(user.password, password)):
        login_error = { 'error': 'Invalid email or password', 'success': False }
        return json.dumps(login_error), 200
    
    login_success = { 'error': None, 'success': True, 'user': user.name }
    login_user(user, remember=remember)
    login_success['id'] = user.id
    return json.dumps(login_success), 200


@auth.route('/auth/register', methods=['POST'])
def signup():
    register = request.form
    email = register.get('email')
    password = register.get('password')
    name = register.get('name')
    role = register.get('role')

    user = User.query.filter_by(email=email).first()
    if (user):
        register_error = { 'error' : 'There\'s already an account with that email address ', 'success': False}
        return json.dumps(register_error), 200
    
    new_user = User(email=email, name=name, role=role, password=generate_password_hash(password, method='scrypt'))
    db.session.add(new_user)
    db.session.commit()

    register_success = {'error' : None, 'success': True}
    return json.dumps(register_success), 200

@auth.route('/auth/logout', methods=['POST', 'GET'])
def logout():
    logout_user()
    logout_success = {'error': None, 'success': True}
    return json.dumps(logout_success), 200


@auth.route('/auth/change-password', methods=['POST', 'PATCH'])
def change_password():
    if not current_user.is_authenticated:
        not_authenticated = { 'success': False, 'error': 'Not authenticated! '}
        return json.dumps(not_authenticated), 200

    if request.method == 'GET':
        old_password = request.args.get('old_password')
        new_password = request.args.get('new_password')
    elif request.method == 'POST' or request.method == 'PATCH':
        old_password = request.form.get('old_password')
        new_password = request.form.get('new_password')
    
    user = User.query.filter_by(id=current_user.id).first()
    if not user or not (check_password_hash(user.password, old_password)):
        authenticate_error = { 'error': 'Invalid old password', 'success': False }
        return json.dumps(authenticate_error), 200
    else:
        user.password = generate_password_hash(new_password, method='scrypt')
        db.session.commit()
        change_password_success = {'error' : None, 'success': True}
        logout_user()
        return json.dumps(change_password_success), 200

@auth.route('/auth/get-user-data', methods=['GET', 'POST'])
def get_user_data():
    print(current_user.is_authenticated)
    if not current_user.is_authenticated:
        not_authenticated = { 'success': False, 'error': 'Not authenticated! '}
        return json.dumps(not_authenticated), 200

    user = User.query.filter_by(id=current_user.id).first()
    if not user:
        authenticate_error = { 'error': 'User not exist in database', 'success': False }
        return json.dumps(authenticate_error), 200
    else:
        user_data = {
                        'success': True,
                        'name': user.name,
                        'id': user.id,
                        'role': user.role,
                        'email': user.email
                    }
        return user_data, 200
