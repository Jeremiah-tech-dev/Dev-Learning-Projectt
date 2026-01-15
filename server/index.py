# Vercel serverless function handler
from app import app
from models import db

# Initialize database tables
with app.app_context():
    db.create_all()

# Export for Vercel
handler = app
