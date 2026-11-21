
"""Gemini REST client with exponential backoff and strict validation."""

import asyncio
import json
import logging
import time
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

import httpx

from .analysis_schema import AnalysisValidationError, validate_analysis
from .config import get_settings
from .prompts import SYSTEM_INSTRUCTION, build_user_content

logger = logging.getLogger("uvicorn.error")

MAX_ATTEMPTS = 3
BASE_RETRY_DELAY = 1.0
MAX_RETRY_DELAY = 8.0
RETRYABLE_STATUS_CODES = {429, 500, 502, 503, 504}


class AIServiceError(RuntimeError):
    """Safe-to-show failure of the AI step."""


def _endpoint(model: str) -> str:
    return (
        f"https://generativelanguage.googleapis.com/"
        f"v1beta/models/{model}:generateContent"
    )


async def _call(client, payload, key, model):
    return await client.post(
        _endpoint(model),
        json=payload,
        headers={"x-goog-api-key": key},
    )


def _retry_after(response):
    """Read Retry-After as seconds or an HTTP date."""
    value = response.headers.get("Retry-After")

    if not value:
        return None

    try:
        return max(0.0, min(float(value), MAX_RETRY_DELAY))
    except ValueError:
        try:
            retry_time = parsedate_to_datetime(value)
            if retry_time.tzinfo is None:
                retry_time = retry_time.replace(tzinfo=timezone.utc)

            delay = (
                retry_time - datetime.now(timezone.utc)
            ).total_seconds()

            return max(0.0, min(delay, MAX_RETRY_DELAY))
        except (TypeError, ValueError, OverflowError):
            return None


def _delay(attempt, response=None):
    if response is not None:
        server_delay = _retry_after(response)
        if server_delay is not None:
            return server_delay

    return min(BASE_RETRY_DELAY * (2 ** attempt), MAX_RETRY_DELAY)


def parse_model_text(text: str) -> dict:
    cleaned = text.strip()

    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`").strip()
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:].strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise AIServiceError(
            "The AI returned an unreadable response. Please try again."
        ) from exc


async def analyze_resume(
    resume_text: str,
    target_role="",
    company="",
    job_description="",
) -> dict:

    s = get_settings()

    payload = {
        "system_instruction": {
            "parts": [{"text": SYSTEM_INSTRUCTION}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{
                    "text": build_user_content(
                        resume_text,
                        target_role,
                        company,
                        job_description,
                    )
                }],
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.3,
        },
    }

    last_error = "The AI service is unavailable. Please try again."

    async with httpx.AsyncClient(timeout=s.gemini_timeout) as client:

        for attempt in range(MAX_ATTEMPTS):
            start = time.monotonic()

            try:
                response = await _call(
                    client,
                    payload,
                    s.gemini_api_key,
                    s.gemini_model,
                )

            except httpx.TimeoutException:
                elapsed = time.monotonic() - start
                logger.warning(
                    "Gemini timeout: attempt=%s/%s duration=%.1fs",
                    attempt + 1,
                    MAX_ATTEMPTS,
                    elapsed,
                )
                last_error = "The AI service timed out. Please try again."

            except httpx.HTTPError as exc:
                logger.warning(
                    "Gemini network error: attempt=%s/%s type=%s",
                    attempt + 1,
                    MAX_ATTEMPTS,
                    type(exc).__name__,
                )
                last_error = "Could not connect to the AI service."

            else:
                elapsed = time.monotonic() - start

                logger.info(
                    "Gemini response: model=%s attempt=%s/%s "
                    "status=%s duration=%.1fs",
                    s.gemini_model,
                    attempt + 1,
                    MAX_ATTEMPTS,
                    response.status_code,
                    elapsed,
                )

                if response.status_code in RETRYABLE_STATUS_CODES:
                    try:
                        detail = response.json().get(
                            "error", {}
                        ).get("message", "")
                    except (ValueError, AttributeError):
                        detail = ""

                    logger.warning(
                        "Gemini temporary error: status=%s detail=%s",
                        response.status_code,
                        detail[:300],
                    )

                    last_error = (
                        "The AI service is temporarily busy. "
                        "Please try again shortly."
                    )

                    if attempt < MAX_ATTEMPTS - 1:
                        delay = _delay(attempt, response)
                        logger.info(
                            "Retrying Gemini in %.1f seconds",
                            delay,
                        )
                        await asyncio.sleep(delay)

                    continue

                if response.status_code != 200:
                    try:
                        detail = response.json().get(
                            "error", {}
                        ).get("message", "")
                    except (ValueError, AttributeError):
                        detail = ""

                    logger.error(
                        "Gemini request rejected: status=%s detail=%s",
                        response.status_code,
                        detail[:300],
                    )

                    raise AIServiceError(
                        "The AI service rejected the request. "
                        "Please check the configuration."
                    )

                try:
                    text = response.json()["candidates"][0][
                        "content"
                    ]["parts"][0]["text"]

                except (KeyError, IndexError, ValueError, TypeError):
                    logger.warning("Gemini returned an empty response.")
                    last_error = (
                        "The AI returned an empty response. "
                        "Please try again."
                    )
                    continue

                try:
                    return validate_analysis(parse_model_text(text))

                except (AnalysisValidationError, AIServiceError) as exc:
                    logger.error(
                        "Gemini output validation failed: %s",
                        type(exc).__name__,
                    )
                    last_error = (
                        "The AI response could not be processed. "
                        "Please try again."
                    )
                    continue

            if attempt < MAX_ATTEMPTS - 1:
                delay = _delay(attempt)
                logger.info(
                    "Retrying Gemini in %.1f seconds",
                    delay,
                )
                await asyncio.sleep(delay)

    raise AIServiceError(last_error)
