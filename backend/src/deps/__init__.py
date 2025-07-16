"""
This file contains the initialization of dependencies for the backend application.
It imports necessary modules and services used across the application.
"""

# Helper
from src.db import get_db

# Main Services
from src.modules.user.user_service import get_user_service
from src.modules.auth.auth_service import get_auth_service
from src.modules.generator.generator_service import get_generation_service
from src.modules.chat.chat_service import get_qa_service
from src.modules.quiz.quiz_service import get_quiz_service

# Auth
from src.modules.auth.guards.guard import get_current_user_from_cookie
