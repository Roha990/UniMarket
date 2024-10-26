from alembic import op
import sqlalchemy as sa
from sqlalchemy import table, column, Integer, String
from werkzeug.security import generate_password_hash

# revision identifiers, used by Alembic.
revision = '2eb39bf619a8'
down_revision = None
branch_labels = None
depends_on = None

user_table = table('users',
                   column('id', Integer),
                   column('username', String),
                   column('full_name', String),
                   column('password', String),
                   column('rating', sa.Float),
                   column('description', String),
                   column('email', String),
                   column('phone_number', String),
                   column('role', String)
                   )


# Функция для добавления админа
def add_admin_user():
    hashed_password = generate_password_hash('admin')
    op.bulk_insert(user_table, [
        {'username': 'admin', 'full_name': 'Admin User', 'password': hashed_password, 'rating': 5.0,
         'description': 'Admin user', 'email': 'admin@example.com', 'phone_number': '1234567890', 'role': 'admin'}
    ])


# Upgrade
def upgrade():
    add_admin_user()


# Downgrade
def downgrade():
    op.execute(user_table.delete().where(user_table.c.username == 'admin'))
