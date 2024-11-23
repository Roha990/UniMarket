from alembic import op
import sqlalchemy as sa
from sqlalchemy import table, column, Integer, String, Text, DateTime, ForeignKey
from werkzeug.security import generate_password_hash
from datetime import datetime

# revision identifiers, used by Alembic.
revision = 'add_test_data'
down_revision = None
branch_labels = None
depends_on = None

# Определение таблиц
user_table = table('users',
                   column('id', Integer),
                   column('username', String),
                   column('full_name', String),
                   column('password', String),
                   column('rating', sa.Float),
                   column('description', Text),
                   column('email', String),
                   column('phone_number', String),
                   column('role', String),
                   column('created_at', DateTime)
                   )

skill_table = table('skills',
                    column('id', Integer),
                    column('name', String)
                    )

direction_table = table('directions',
                        column('id', Integer),
                        column('name', String)
                        )

project_table = table('projects',
                      column('id', Integer),
                      column('title', String),
                      column('description', Text),
                      column('creator_id', Integer),
                      column('created_at', DateTime),
                      column('direction_id', Integer),
                      column('status', String)
                      )

user_skill_table = table('user_skill',
                         column('user_id', Integer),
                         column('skill_id', Integer)
                         )

project_skill_table = table('project_skill',
                            column('project_id', Integer),
                            column('skill_id', Integer)
                            )

user_project_table = table('user_project',
                          column('user_id', Integer),
                          column('project_id', Integer),
                          column('role', String)
                          )

project_direction_table = table('project_direction',
                               column('project_id', Integer),
                               column('direction_id', Integer)
                               )

invitation_table = table('invitations',
                         column('id', Integer),
                         column('description', Text),
                         column('project_id', Integer),
                         column('user_id', Integer),
                         column('status', String),
                         column('created_at', DateTime)
                         )

# Функция для добавления админа и тестовых пользователей
def add_users():
    users = [
        {'username': 'admin', 'full_name': 'Admin User', 'password': generate_password_hash('admin'), 'rating': 0,
         'description': 'Admin user', 'email': 'admin@example.com', 'phone_number': '1234567890', 'role': 'admin',
         'created_at': datetime.utcnow()},
        {'username': 'test1', 'full_name': 'Test User 1', 'password': generate_password_hash('test'), 'rating': 0,
         'description': 'Test user 1', 'email': 'testuser1@example.com', 'phone_number': '0987654321', 'role': 'user',
         'created_at': datetime.utcnow()},
        {'username': 'test2', 'full_name': 'Test User 2', 'password': generate_password_hash('test'), 'rating': 0,
         'description': 'Test user 2', 'email': 'testuser2@example.com', 'phone_number': '0987654322', 'role': 'user',
         'created_at': datetime.utcnow()}
    ]
    op.bulk_insert(user_table, users)

# Функция для добавления навыков
def add_skills():
    skills = [
        {'name': 'Python'},
        {'name': 'JavaScript'},
        {'name': 'Java'},
        {'name': 'C++'},
        {'name': 'SQL'},
        {'name': 'HTML/CSS'},
        {'name': 'Project Management'},
        {'name': 'Data Analysis'},
        {'name': 'Machine Learning'},
        {'name': 'DevOps'}
    ]
    op.bulk_insert(skill_table, skills)

# Функция для добавления направлений проектов
def add_directions():
    directions = [
        {'name': 'Web Development'},
        {'name': 'Mobile Development'},
        {'name': 'Data Science'},
        {'name': 'Machine Learning'},
        {'name': 'Cybersecurity'},
        {'name': 'Cloud Computing'},
        {'name': 'DevOps'},
        {'name': 'Artificial Intelligence'},
        {'name': 'Blockchain'},
        {'name': 'Internet of Things'}
    ]
    op.bulk_insert(direction_table, directions)

# Функция для добавления проектов
def add_projects():
    projects = [
        {'title': 'Project 1', 'description': 'Description for Project 1', 'creator_id': 1, 'created_at': datetime.utcnow(), 'direction_id': 1, 'status': 'active'},
        {'title': 'Project 2', 'description': 'Description for Project 2', 'creator_id': 2, 'created_at': datetime.utcnow(), 'direction_id': 2, 'status': 'active'},
        {'title': 'Project 3', 'description': 'Description for Project 3', 'creator_id': 3, 'created_at': datetime.utcnow(), 'direction_id': 3, 'status': 'active'}
    ]
    op.bulk_insert(project_table, projects)

# Функция для добавления связей пользователей и навыков
def add_user_skills():
    user_skills = [
        {'user_id': 1, 'skill_id': 1},
        {'user_id': 1, 'skill_id': 2},
        {'user_id': 2, 'skill_id': 3},
        {'user_id': 2, 'skill_id': 4},
        {'user_id': 3, 'skill_id': 5},
        {'user_id': 3, 'skill_id': 6}
    ]
    op.bulk_insert(user_skill_table, user_skills)

# Функция для добавления связей проектов и навыков
def add_project_skills():
    project_skills = [
        {'project_id': 1, 'skill_id': 1},
        {'project_id': 1, 'skill_id': 2},
        {'project_id': 2, 'skill_id': 3},
        {'project_id': 2, 'skill_id': 4},
        {'project_id': 3, 'skill_id': 5},
        {'project_id': 3, 'skill_id': 6}
    ]
    op.bulk_insert(project_skill_table, project_skills)

# Функция для добавления связей пользователей и проектов
def add_user_projects():
    user_projects = [
        {'user_id': 1, 'project_id': 1, 'role': 'creator'},
        {'user_id': 2, 'project_id': 1, 'role': 'participant'},
        {'user_id': 3, 'project_id': 2, 'role': 'creator'},
        {'user_id': 1, 'project_id': 2, 'role': 'participant'},
        {'user_id': 2, 'project_id': 3, 'role': 'creator'},
        {'user_id': 3, 'project_id': 3, 'role': 'participant'}
    ]
    op.bulk_insert(user_project_table, user_projects)

# Функция для добавления связей проектов и направлений
def add_project_directions():
    project_directions = [
        {'project_id': 1, 'direction_id': 1},
        {'project_id': 2, 'direction_id': 2},
        {'project_id': 3, 'direction_id': 3}
    ]
    op.bulk_insert(project_direction_table, project_directions)

# Функция для добавления приглашений
def add_invitations():
    invitations = [
        {'description': 'Invitation for Project 1', 'project_id': 1, 'user_id': 2, 'status': 'pending', 'created_at': datetime.utcnow()},
        {'description': 'Invitation for Project 2', 'project_id': 2, 'user_id': 3, 'status': 'pending', 'created_at': datetime.utcnow()},
        {'description': 'Invitation for Project 3', 'project_id': 3, 'user_id': 1, 'status': 'pending', 'created_at': datetime.utcnow()}
    ]
    op.bulk_insert(invitation_table, invitations)

# Upgrade
def upgrade():
    add_users()
    add_skills()
    add_directions()
    add_projects()
    add_user_skills()
    add_project_skills()
    add_user_projects()
    add_project_directions()
    add_invitations()

# Downgrade
def downgrade():
    op.execute(user_table.delete())
    op.execute(skill_table.delete())
    op.execute(direction_table.delete())
    op.execute(project_table.delete())
    op.execute(user_skill_table.delete())
    op.execute(project_skill_table.delete())
    op.execute(user_project_table.delete())
    op.execute(project_direction_table.delete())
    op.execute(invitation_table.delete())
