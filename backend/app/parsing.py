"""Safe upload reading and resume text extraction (PDF / DOCX)."""
import io
import re
import zipfile

MAX_DOCX_UNCOMPRESSED = 30 * 1024 * 1024  # zip-bomb guard


class UploadError(ValueError):
    """Raised for user-correctable upload problems. Message is safe to show."""


def detect_kind(filename: str, head: bytes) -> str:
    name = (filename or "").lower()
    if name.endswith(".pdf") and head.startswith(b"%PDF"):
        return "pdf"
    if name.endswith(".docx") and head.startswith(b"PK"):
        return "docx"
    raise UploadError("Unsupported or corrupted file. Upload a PDF or DOCX resume.")


async def read_limited(upload, max_bytes: int) -> bytes:
    """Read an UploadFile in chunks and stop as soon as the limit is exceeded."""
    chunks, total = [], 0
    while True:
        chunk = await upload.read(64 * 1024)
        if not chunk:
            break
        total += len(chunk)
        if total > max_bytes:
            raise UploadError(f"File is too large. Maximum size is {max_bytes // (1024 * 1024)} MB.")
        chunks.append(chunk)
    if total == 0:
        raise UploadError("The uploaded file is empty.")
    return b"".join(chunks)


def clean_text(text: str) -> str:
    text = text.replace("\x00", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_pdf(data: bytes, max_pages: int) -> str:
    import pdfplumber

    try:
        with pdfplumber.open(io.BytesIO(data)) as pdf:
            if len(pdf.pages) > max_pages:
                raise UploadError(f"PDF has too many pages (limit {max_pages}). A resume should be short.")
            return "\n\n".join((page.extract_text() or "") for page in pdf.pages)
    except UploadError:
        raise
    except Exception:
        raise UploadError("Could not read this PDF. It may be corrupted or password-protected.")


def extract_docx(data: bytes) -> str:
    import docx

    try:
        with zipfile.ZipFile(io.BytesIO(data)) as zf:
            if sum(i.file_size for i in zf.infolist()) > MAX_DOCX_UNCOMPRESSED:
                raise UploadError("DOCX file expands to an unreasonable size.")
        document = docx.Document(io.BytesIO(data))
        parts = [p.text for p in document.paragraphs]
        for table in document.tables:
            for row in table.rows:
                parts.append(" | ".join(c.text.strip() for c in row.cells))
        return "\n".join(parts)
    except UploadError:
        raise
    except Exception:
        raise UploadError("Could not read this DOCX file. It may be corrupted.")


def extract_resume_text(filename: str, data: bytes, max_pages: int, max_chars: int) -> str:
    kind = detect_kind(filename, data[:8])
    raw = extract_pdf(data, max_pages) if kind == "pdf" else extract_docx(data)
    text = clean_text(raw)
    if len(text) < 80:
        raise UploadError(
            "Almost no text could be extracted. If this is a scanned image PDF, export a text-based PDF or upload a DOCX."
        )
    return text[:max_chars]
