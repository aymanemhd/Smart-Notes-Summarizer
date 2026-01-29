from pydantic import BaseModel, Field, field_validator
from backend.core.config import MAX_NOTE_CHARS

class NoteCreate(BaseModel):
    content: str = Field(..., min_length=1)
    @field_validator("content")
    def limit_size(cls, v: str):
        if len(v) > MAX_NOTE_CHARS:
            raise ValueError(f"Note exceeds {MAX_NOTE_CHARS} characters limit")
        return v

class NoteUpdate(BaseModel):
    content: str = Field(..., min_length=1)
    @field_validator("content")
    def limit_size(cls, v: str):
        if len(v) > MAX_NOTE_CHARS:
            raise ValueError(f"Note exceeds {MAX_NOTE_CHARS} characters limit")
        return v

class NoteOut(BaseModel):
    id: int
    content: str
    created_at: int
    updated_at: int
    class Config:
        orm_mode = True
