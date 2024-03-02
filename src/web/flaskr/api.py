import os
import models.inference as api
import flask
import simplejson as json
import pandas as pd
from flask import Flask, request, url_for, redirect, send_file, make_response
from flask_cors import CORS
from web.flaskr.global_vars import db
from flask_login import LoginManager, login_required, current_user

def to_id_dict(original_dict: dict):
    #Turn 2D dict of { key : { anime_id: value }} to { anime_id: { key: value }}
    res = dict()
    #Check if dict has anime_id column which is index to anime MAL ID, else the key is MAL ID already
    index_to_mal_id = original_dict.get('anime_id')
    has_index_to_mal = (index_to_mal_id != None)

    for key in original_dict.keys():
        id_value = original_dict.get(key)
        for index in id_value.keys():
            value = id_value[index]
            if has_index_to_mal:
                anime_id = int(index_to_mal_id[index])
            else:
                anime_id = int(index)
            if res.get(anime_id) == None:
                res[anime_id] = dict()
            res[anime_id][key] = value

    return res

def dict_to_list(original_dict: dict, key_ref: str):
    res = list()
    for key in original_dict.keys():
        value = original_dict.get(key)
        value[key_ref] = key
        res.append(value)
    
    return res

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app
     , supports_credentials=True, origins = r"https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))",
     expose_headers=['X-CSRFToken'])
    
    
    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_DATABASE_URI='mariadb+pymysql://natsumeshokogami:spellcasting2002@localhost:3306/natsumeshokogami',
    )
    db.init_app(app)

    from web.flaskr.models import User

    with app.app_context():
        db.create_all()

    from flask_wtf.csrf import CSRFProtect, generate_csrf

    login_manager = LoginManager()
    csrf_protect = CSRFProtect()
    

    #Register login_manager to the main Flask so that login_manager and other
    #decorators such as current_user and login_required can be accessed by other blueprints
    login_manager.init_app(app=app)

    #This will manage which will be query and stored in current_user
    #Modify this if you want to store more information about user and session
    @login_manager.user_loader
    def load_user(user_id):
        # since the user_id is just the primary key of our user table, use it in the query for the user
        return User.query.get(int(user_id))

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # blueprint for auth routes in our app
    from web.flaskr.auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from web.flaskr.comment import comment as comment_blueprint
    app.register_blueprint(comment_blueprint)

    csrf_protect = CSRFProtect()
    #Use Flask Wtf's CSRF protection since we send login and REST APIs request from the frontend
    #end thus other actors can forge false request, we need to add mechanisms to check forged requests
    csrf_protect.init_app(app=app)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    

    
    
    @app.route('/api/<mal_id>')
    def get_anime(mal_id):
        try:
            id = int(mal_id)
            response = api.get_anime(id)
            return response.to_json(), 200
        except:
            error = { 'error': 'Invalid MAL ID' }
            return json.dumps(error), 405


    @app.route('/api/search', methods=['GET', 'POST'])
    def search_anime():
        query = request.args.get('query')
        response = to_id_dict(json.loads(api.search_anime(str(query)).to_json()))     
        return json.dumps(dict_to_list(response, 'anime_id'), ignore_nan=True), 200

    @app.route('/api/recommend/<mal_id>')
    def recommend_anime(mal_id):
        try:
            id = int(mal_id)
            
        except:
            error = { 'error': 'Invalid MAL ID' }
            return json.dumps(error), 405
        recommended_ids = api.recommend_anime(id)
        recommended_animes = api.get_animes(recommended_ids).to_json()
        response = to_id_dict(json.loads(recommended_animes))
        return json.dumps(dict_to_list(response, 'anime_id'), ignore_nan=True), 200

    @app.route('/api/popular')
    def popular_anime_api():
        popular_animes = api.highest_popularity_anime().to_json()
        response = to_id_dict(json.loads(popular_animes))
        return json.dumps(dict_to_list(response, 'anime_id'), ignore_nan=True), 200
    
    @app.route('/api/highest-rating')
    def highest_rating_anime_api():
        highest_rating_animes = api.highest_rating_anime().to_json()
        response = to_id_dict(json.loads(highest_rating_animes))
        return json.dumps(dict_to_list(response, 'anime_id'), ignore_nan=True), 200


    return app