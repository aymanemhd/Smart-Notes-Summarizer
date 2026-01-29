from pydantic import BaseModel, Field, field_validator
from typing import List
from backend.core.config import MAX_NOTE_CHARS

class SummarizeIn(BaseModel):
    content: str = Field(..., min_length=1)
    @field_validator("content")
    def limit_size(cls, v: str):
        if len(v) > MAX_NOTE_CHARS:
            raise ValueError(f"Note exceeds {MAX_NOTE_CHARS} characters limit")
        return v

class SummarizeOut(BaseModel):
    summary: str
    bullet_points: List[str]
    key_takeaways: List[str]
