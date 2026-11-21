"""Environment-driven settings. Secrets live only in backend/.env (never the frontend)."""
import os
from urllib.parse import urlparse

from dotenv import load_dotenv

load_dotenv()


class ConfigError(RuntimeError):
    pass


def normalize_supabase_url(raw: str) -> str:
    """Return a clean https://<ref>.supabase.co style origin or raise ConfigError."""
    value = (raw or "").strip().strip('"').strip("'")
    if not value:
        raise ConfigError("SUPABASE_URL is not set")
    parsed = urlparse(value)
    if parsed.scheme not in ("https", "http") or not parsed.netloc:
        raise ConfigError("SUPABASE_URL must look like https://<project>.supabase.co")
    if parsed.path not in ("", "/"):
        raise ConfigError("SUPABASE_URL must be the project origin only (remove paths like /rest/v1)")
    return f"{parsed.scheme}://{parsed.netloc}"


def _int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, default))
    except ValueError:
        raise ConfigError(f"{name} must be an integer")


class Settings:
    def __init__(self) -> None:
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
        self.gemini_timeout = _int("GEMINI_TIMEOUT_SECONDS", 60)
        self.supabase_url = normalize_supabase_url(os.getenv("SUPABASE_URL", ""))
        self.supabase_anon_key = os.getenv("SUPABASE_ANON_KEY", "").strip()
        self.max_upload_bytes = _int("MAX_UPLOAD_MB", 5) * 1024 * 1024
        self.max_pdf_pages = _int("MAX_PDF_PAGES", 15)
        self.max_resume_chars = _int("MAX_RESUME_CHARS", 30000)
        self.analyze_limit_per_hour = _int("ANALYZE_LIMIT_PER_HOUR", 10)
        self.allowed_origins = [
            o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",") if o.strip()
        ]
        missing = [
            n
            for n, v in (("GEMINI_API_KEY", self.gemini_api_key), ("SUPABASE_ANON_KEY", self.supabase_anon_key))
            if not v
        ]
        if missing:
            raise ConfigError("Missing required environment variables: " + ", ".join(missing))


_settings: Settings | None = None


def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
