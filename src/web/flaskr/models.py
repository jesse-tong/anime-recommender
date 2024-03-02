from web.flaskr.global_vars import db
from flask_login import UserMixin
from sqlalchemy import CheckConstraint


class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(530))
    name = db.Column(db.String(300))
    role = db.Column(db.String(20))

class Comment(db.Model):
    __tablename__ = 'comment'
    id = db.Column(db.String(70), primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id')) 
    comment = db.Column(db.String(3000))
    rating = db.Column(db.Integer)
    anime = db.Column(db.Integer)


