from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.db.session import SessionLocal
from backend.models.note import Note
from backend.schemas.summarize import SummarizeIn, SummarizeOut
from backend.schemas.chat import ChatIn, ChatOut
from backend.services.ai_client import ai_chat

router = APIRouter(prefix="/api", tags=["ai"])

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/summarize", response_model=SummarizeOut)
async def summarize(payload: SummarizeIn):
    system = "You summarize notes into: Summary, Bullet Points, Key Takeaways. Plain text."
    user = "Summarize these notes and output three sections.\nSummary:\nBullet Points:\nKey Takeaways:\n\n" + payload.content
    content = await ai_chat(messages=[{"role": "system", "content": system}, {"role": "user", "content": user}], max_tokens=700, temperature=0.2)
    def extract_section(label: str) -> List[str]:
        lines = []
        capturing = False
        headers = ["Summary:", "Bullet Points:", "Key Takeaways:"]
        for line in content.splitlines():
            stripped = line.strip()
            if stripped.lower().startswith(label.lower()):
                capturing = True
                continue
            if capturing:
                # If we hit another header, stop capturing
                if any(stripped.lower().startswith(h.lower()) for h in headers if h.lower() != label.lower()):
                    break
                if stripped == "" and label != "Summary:":
                    break
                lines.append(stripped.lstrip("-• ").strip())
        return [l for l in lines if l]
    summary_lines = extract_section("Summary:")
    bullets = extract_section("Bullet Points:")
    takeaways = extract_section("Key Takeaways:")
    summary_text = " ".join(summary_lines) if summary_lines else content[:500]
    return SummarizeOut(summary=summary_text, bullet_points=bullets[:10], key_takeaways=takeaways[:10])

@router.post("/chat", response_model=ChatOut)
async def chat(payload: ChatIn, db: Session = Depends(get_db)):
    note_context = ""
    if payload.note_id:
        note = db.query(Note).filter(Note.id == payload.note_id).first()
        if note:
            note_context = note.content[:2000]
    system = "You give concise practical recommendations based on provided note context."
    user = "Notes context:\n" + note_context + "\n\nUser message:\n" + payload.message
    content = await ai_chat(messages=[{"role": "system", "content": system}, {"role": "user", "content": user}], max_tokens=400, temperature=0.3)
    return ChatOut(response=content.strip())
