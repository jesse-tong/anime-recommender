from flask import Blueprint, url_for, request, make_response
from web.flaskr.models import User, Comment
from web.flaskr.global_vars import db
from models.inference import get_anime
import json, uuid
from flask_login import current_user
from flask_cors import CORS

comment = Blueprint('comment', __name__)
CORS(comment, supports_credentials=True, origins = r"https?:\/\/(?:w{1,3}\.)?[^\s.]+(?:\.[a-z]+)*(?::\d+)?(?![^<]*(?:<\/\w+>|\/?>))",
    expose_headers=['X-CSRFToken'])

@comment.route('/api/comment/<mal_id>')
def getCommentForAnimeId(mal_id):
    try:
        anime_id = int(mal_id)
        anime = get_anime(mal_id=mal_id)
    except:
        invalid_id = { 'error': 'Invalid or MAL ID not exist in database', 'success': False}
        return json.dumps(invalid_id), 200
    
    comments_for_anime = db.session.query(Comment.id, Comment.userId, Comment.comment, 
    Comment.anime, Comment.rating, User.name, User.email, User.role).filter_by(anime = mal_id).join(User)
    res = list()
    for comment_anime in comments_for_anime:
        res.append({ 'id': comment_anime.id, 'anime_id': comment_anime.anime,
                 'userId': comment_anime.userId, 'rating': comment_anime.rating, 
                 'comment': comment_anime.comment, 'username': comment_anime.name, 
                 'userEmail': comment_anime.email, 'role': comment_anime.role })
    return json.dumps(res), 200

@comment.route('/api/comment/user/<user_id>')
def getCommentForUserId(user_id):
    try:
        user_id = int(user_id)
    except:
        invalid_id = { 'error': 'Invalid user ID', 'success': False}
        return json.dumps(invalid_id), 200
    comments_for_id = db.session.query(Comment.id, Comment.userId, Comment.comment, 
    Comment.anime, Comment.rating, User.name, User.email, User.role).filter(User.id == user_id).join(User)
    res = list()
    for comment_anime in comments_for_id:
        res.append({ 'id': comment_anime.id, 'anime_id': comment_anime.anime,
                 'userId': comment_anime.userId, 'rating': comment_anime.rating, 
                 'comment': comment_anime.comment })
    return json.dumps(res), 200

@comment.route('/api/comment-edit/<mal_id>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def commentAnime(mal_id):
    print(current_user.is_authenticated)
    try:
        anime_id = int(mal_id)
        anime = get_anime(mal_id=mal_id)

    except:
        invalid_id = { 'error': 'Invalid or MAL ID not exist in database', 'success': False}
        return json.dumps(invalid_id), 200

    if not current_user.is_authenticated:
        unauthenticated = { 'error': 'Unauthenticated', 'success': False}
        print('Unauthenticated user');
        return json.dumps(unauthenticated), 200
    
    user = User.query.filter_by(id = current_user.id).first()
    if not user:
        unauthenticated = { 'error': 'Unauthenticated', 'success': False}
        print('User not in database');
        return json.dumps(unauthenticated), 200

    role = user.role
    if request.method == 'GET':
        comment_id = request.args.get('id')
    else:
        comment_id = request.form.get('id')

    comment = db.session.query(Comment).filter(Comment.anime == anime_id).filter(Comment.id == comment_id).first()
    if request.method == 'GET':
        if comment:
            return json.dumps(comment), 200
        else:
            return json.dumps('No comment'), 200

    '''if comment != None:
        #Debug
        print(comment.comment); print(current_user.id, ' type of current user id: ', type(current_user.id))
        print(comment.userId, ' type of comment user id: ', type(comment.userId))'''

    current_user_role = db.session.query(User).filter_by(id = current_user.id).first().role
    print('Role of current user: ', current_user_role)
    
    if (request.method == 'PUT' or request.method == 'DELETE') and (
        comment != None and (comment.userId != current_user.id and current_user_role != 'admin')):
        insufficient_role = { 'error': 'Insufficient role', 'success': False}
        print('Insufficient role')
        return json.dumps(insufficient_role), 200

    if request.method == 'PUT' or request.method == 'POST':
        id = uuid.uuid4()
        userId = current_user.id
        comment_anime = request.form.get('comment')
        rating = request.form.get('rating')
        try:
            rating = int(rating)
        except:
            invalid_rating = { 'error': 'Invalid rating', 'success': False}
            print('Invalid rating')
            return json.dumps(invalid_rating), 200

    if (request.method == 'PUT' and not comment) or request.method == 'POST':
        try:
            comment = Comment()
            comment.id = uuid.uuid4()
            comment.anime = anime_id; comment.comment = comment_anime
            comment.userId = userId; comment.rating = int(rating)
            db.session.add(comment)
            db.session.commit()
            success = { 'error': None, 'success': True}
            return json.dumps(success), 200
        except Exception as e:
            print(e)
            db.session.rollback()
            invalid_comment = { 'error': 'Invalid comment', 'success': False}
            return json.dumps(invalid_comment), 200

    if request.method == 'PUT':
        comment.id = id; comment.anime = anime_id; comment.comment = comment_anime
        comment.rating = rating
        try:
            db.session.commit()
            success = { 'error': None, 'success': True}
            return json.dumps(success), 200
        except:
            db.session.rollback()
            invalid_comment = { 'error': 'Invalid  comment', 'success': False}
            return json.dumps(invalid_comment), 200

    if request.method == 'DELETE':
        if not comment:
            no_comment = { 'error': 'No such comment ID', 'success': False}
            return json.dumps(no_comment), 200
        else:
            db.session.delete(comment)
            db.session.commit()
    success = { 'error': None, 'success': True}
    return json.dumps(success), 200