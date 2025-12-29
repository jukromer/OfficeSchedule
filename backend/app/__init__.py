from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt, cors
from .auth.routes import auth_bp
from .bookings.routes import booking_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(booking_bp, url_prefix='/api/bookings')

    return app
