"""Validate the caller's Supabase access token by asking Supabase Auth who it belongs to."""
from dataclasses import dataclass

import httpx
from fastapi import Header, HTTPException

from .config import get_settings


@dataclass
class CurrentUser:
    id: str
    email: str
    token: str


async def get_current_user(authorization: str | None = Header(default=None)) -> CurrentUser:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(401, "Missing authentication token")
    token = authorization[7:].strip()
    s = get_settings()
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(
                f"{s.supabase_url}/auth/v1/user",
                headers={"apikey": s.supabase_anon_key, "Authorization": f"Bearer {token}"},
            )
    except httpx.HTTPError:
        raise HTTPException(503, "Authentication service unavailable")
    if r.status_code != 200:
        raise HTTPException(401, "Invalid or expired session")
    data = r.json()
    if not data.get("id"):
        raise HTTPException(401, "Invalid session")
    return CurrentUser(id=data["id"], email=data.get("email", ""), token=token)
