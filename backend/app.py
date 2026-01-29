from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import ALLOWED_ORIGINS
from backend.routers.notes import router as notes_router
from backend.routers.ai import router as ai_router

app = FastAPI(title="Smart Notes Summarizer API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/api/health")
def health():
    return {"status": "ok"}
app.include_router(notes_router)
app.include_router(ai_router)
