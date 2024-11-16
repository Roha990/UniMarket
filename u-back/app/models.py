from werkzeug.security import generate_password_hash, check_password_hash

from .extensions import db
from sqlalchemy.orm import relationship


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    full_name = db.Column(db.String(120), nullable=True)
    password = db.Column(db.String(256), nullable=False)
    rating = db.Column(db.Float, default=0.0)
    description = db.Column(db.Text, nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    phone_number = db.Column(db.String(20), nullable=True)
    role = db.Column(db.String(50), nullable=False)

    projects = relationship('Project', secondary='user_project', back_populates='users')
    skills = relationship('Skill', secondary='user_skill', back_populates='users')

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    users = relationship('User', secondary='user_project', back_populates='projects')
    creator = relationship('User', foreign_keys=[creator_id])
    skills = relationship('Skill', secondary='project_skill', back_populates='projects')

class Skill(db.Model):
    __tablename__ = 'skills'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)

    users = relationship('User', secondary='user_skill', back_populates='skills')
    projects = relationship('Project', secondary='project_skill', back_populates='skills')

class UserSkill(db.Model):
    __tablename__ = 'user_skill'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), primary_key=True)

class ProjectSkill(db.Model):
    __tablename__ = 'project_skill'

    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), primary_key=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), primary_key=True)


class UserProject(db.Model):
    __tablename__ = 'user_project'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), primary_key=True)


class Invitation(db.Model):
    __tablename__ = 'invitations'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='pending')

    project = relationship('Project', backref='invitations')
    user = relationship('User', backref='invitations')
