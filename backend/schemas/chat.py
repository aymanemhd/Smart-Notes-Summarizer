from pydantic import BaseModel, Field
from typing import Optional

class ChatIn(BaseModel):
    message: str = Field(..., min_length=1, max_length=2048)
    note_id: Optional[int] = None

class ChatOut(BaseModel):
    response: str
