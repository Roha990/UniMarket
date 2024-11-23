from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from .controllers import auth, project, user, skills
from .extensions import db, jwt, redis_store, migrate

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    app.config['JWT_SECRET_KEY'] = 'secret'
    db.init_app(app)
    jwt.init_app(app)
    redis_store.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    with app.app_context():
        app.register_blueprint(auth.bp)
        app.register_blueprint(user.bp)
        app.register_blueprint(skills.bp)
        app.register_blueprint(project.bp)

        db.create_all()

    return app
