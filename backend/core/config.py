import os
from dotenv import load_dotenv

load_dotenv()

AI_BASE_URL = os.getenv("AI_BASE_URL", "").rstrip("/")
AI_API_KEY = os.getenv("AI_API_KEY", "")
AI_MODEL = os.getenv("AI_MODEL", "mixtral-8x7b-instruct")
MAX_NOTE_CHARS = int(os.getenv("MAX_NOTE_CHARS", "8000"))
ALLOWED_ORIGINS = [o for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",") if o]
DB_URL = os.getenv("DB_URL", "sqlite:///./smart_notes.db")
