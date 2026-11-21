"""TalentEdge API.  Run: uvicorn app.main:app --reload --port 8000  (from backend/)"""
import uuid

from fastapi import Depends, FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from . import db
from .auth import CurrentUser, get_current_user
from .config import ConfigError, get_settings
from .gemini_client import AIServiceError, analyze_resume
from .parsing import UploadError, extract_resume_text, read_limited
from .ratelimit import RateLimiter

settings = get_settings()  # fails fast on bad/missing configuration
limiter = RateLimiter(settings.analyze_limit_per_hour)

app = FastAPI(title="TalentEdge API", docs_url="/api/docs", openapi_url="/api/openapi.json")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.exception_handler(db.DatabaseError)
async def _db_error(_: Request, exc: db.DatabaseError):
    return JSONResponse({"detail": "Could not reach the database. Please try again."}, status_code=503)


def _valid_uuid(value: str) -> str:
    try:
        return str(uuid.UUID(value))
    except ValueError:
        raise HTTPException(404, "Analysis not found")


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/analyze")
async def analyze(
    request: Request,
    file: UploadFile = File(...),
    target_role: str = Form(""),
    company: str = Form(""),
    job_description: str = Form(""),
    user: CurrentUser = Depends(get_current_user),
):
    declared = request.headers.get("content-length")
    if declared and declared.isdigit() and int(declared) > settings.max_upload_bytes + 64 * 1024:
        raise HTTPException(413, f"File is too large. Maximum size is {settings.max_upload_bytes // (1024 * 1024)} MB.")
    if not limiter.hit(user.id):
        raise HTTPException(429, "Analysis limit reached. Please try again later.")
    try:
        data = await read_limited(file, settings.max_upload_bytes)
        text = extract_resume_text(file.filename or "", data, settings.max_pdf_pages, settings.max_resume_chars)
    except UploadError as exc:
        raise HTTPException(400, str(exc))
    try:
        result = await analyze_resume(text, target_role.strip(), company.strip(), job_description.strip())
    except AIServiceError as exc:
        raise HTTPException(502, str(exc))
    return await db.save_analysis(user, file.filename or "resume", target_role.strip(), company.strip(), result)


@app.get("/api/analyses")
async def list_analyses(user: CurrentUser = Depends(get_current_user)):
    return await db.list_analyses(user)


@app.get("/api/analyses/{analysis_id}")
async def get_analysis(analysis_id: str, user: CurrentUser = Depends(get_current_user)):
    row = await db.get_analysis(user, _valid_uuid(analysis_id))
    if not row:
        raise HTTPException(404, "Analysis not found")
    return row


@app.delete("/api/analyses/{analysis_id}", status_code=204)
async def delete_analysis(analysis_id: str, user: CurrentUser = Depends(get_current_user)):
    if not await db.delete_analysis(user, _valid_uuid(analysis_id)):
        raise HTTPException(404, "Analysis not found")
