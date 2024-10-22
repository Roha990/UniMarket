from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from .extensions import db, jwt, redis_store

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    jwt.init_app(app)
    redis_store.init_app(app)
    CORS(app)

    with app.app_context():
        from .controllers import auth, user
        app.register_blueprint(auth.bp)
        app.register_blueprint(user.bp)

        db.create_all()

    return app
