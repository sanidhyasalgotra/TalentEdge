"""Analysis history via Supabase PostgREST, called AS THE USER so Row Level Security applies.

Every query also filters on user_id explicitly (defence in depth).
"""
import httpx

from .config import get_settings


class DatabaseError(RuntimeError):
    pass


def _headers(token: str, prefer: str | None = None) -> dict:
    h = {"apikey": get_settings().supabase_anon_key, "Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    if prefer:
        h["Prefer"] = prefer
    return h


def _url() -> str:
    return f"{get_settings().supabase_url}/rest/v1/analyses"


async def _request(method: str, params: dict | None = None, json=None, token="", prefer=None):
    try:
        async with httpx.AsyncClient(timeout=15) as c:
            r = await c.request(method, _url(), params=params, json=json, headers=_headers(token, prefer))
    except httpx.HTTPError:
        raise DatabaseError("Database unavailable")
    if r.status_code >= 400:
        raise DatabaseError("Database request failed")
    return r


async def save_analysis(user, filename, target_role, company, result) -> dict:
    row = {
        "user_id": user.id,
        "filename": filename[:255],
        "target_role": target_role or None,
        "company": company or None,
        "overall_score": result["overall_assessment"]["score"],
        "ats_score": result["ats_compatibility"]["score"],
        "result": result,
    }
    r = await _request("POST", json=row, token=user.token, prefer="return=representation")
    rows = r.json()
    if not rows:
        raise DatabaseError("Save failed")
    return rows[0]


async def list_analyses(user) -> list:
    params = {
        "select": "id,filename,target_role,company,overall_score,ats_score,created_at",
        "user_id": f"eq.{user.id}",
        "order": "created_at.desc",
        "limit": "100",
    }
    return (await _request("GET", params=params, token=user.token)).json()


async def get_analysis(user, analysis_id: str):
    params = {"select": "*", "id": f"eq.{analysis_id}", "user_id": f"eq.{user.id}"}
    rows = (await _request("GET", params=params, token=user.token)).json()
    return rows[0] if rows else None


async def delete_analysis(user, analysis_id: str) -> bool:
    params = {"id": f"eq.{analysis_id}", "user_id": f"eq.{user.id}"}
    r = await _request("DELETE", params=params, token=user.token, prefer="return=representation")
    return bool(r.json())
