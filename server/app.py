from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_migrate import Migrate
from config import Config
from models import db, bcrypt, User, Course, Module, Enrollment, InstructorApplication
from datetime import datetime
import re
import json  # not used yet but might need later

# TODO: add rate limiting later
# TODO: maybe add email verification?

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/api/*": {"origins": "*"}})
db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

def is_valid_email(email):
    return re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email)

@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return jsonify({'error': 'Missing or invalid token'}), 401

@jwt.invalid_token_loader