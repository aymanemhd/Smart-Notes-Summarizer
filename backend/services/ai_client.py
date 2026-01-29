import httpx
from fastapi import HTTPException
from backend.core.config import AI_BASE_URL, AI_API_KEY, AI_MODEL

async def ai_chat(messages, max_tokens=512, temperature=0.2):
    if not AI_BASE_URL or not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI provider not configured")
    url = f"{AI_BASE_URL}/v1/chat/completions"
    headers = {"Authorization": f"Bearer {AI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": AI_MODEL, "messages": messages, "max_tokens": max_tokens, "temperature": temperature}
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(url, headers=headers, json=payload)
        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=f"AI error: {resp.text[:200]}")
        data = resp.json()
        try:
            return data["choices"][0]["message"]["content"]
        except Exception:
            raise HTTPException(status_code=500, detail="Unexpected AI response format")
