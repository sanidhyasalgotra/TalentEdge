"""Strict validation of Gemini output. Pure Python (no third-party deps) so it is easy to test.

Gemini output is untrusted: every field is type-checked, scores must be integers 0-100,
and bullet rewrites are rejected if they introduce numbers absent from the original bullet.
"""
import re


class AnalysisValidationError(ValueError):
    pass


def _str(v, field, max_len=1500, required=True):
    if not isinstance(v, str) or (required and not v.strip()):
        raise AnalysisValidationError(f"'{field}' must be a non-empty string")
    return v.strip()[:max_len]


def _score(v, field):
    if isinstance(v, bool) or not isinstance(v, (int, float)) or v != v:
        raise AnalysisValidationError(f"'{field}' must be a number")
    if not 0 <= v <= 100:
        raise AnalysisValidationError(f"'{field}' must be between 0 and 100")
    return int(round(v))


def _list(v, field, max_items=25):
    if not isinstance(v, list):
        raise AnalysisValidationError(f"'{field}' must be a list")
    return v[:max_items]


def _str_list(v, field, max_items=30):
    return [_str(i, f"{field}[]", 200) for i in _list(v, field, max_items) if isinstance(i, str) and i.strip()]


def _obj(v, field):
    if not isinstance(v, dict):
        raise AnalysisValidationError(f"'{field}' must be an object")
    return v


_NUM = re.compile(r"\d[\d,.]*")


def _numbers(text: str) -> set:
    return {n.strip(".,").replace(",", "") for n in _NUM.findall(text)}


def bullet_is_faithful(original: str, improved: str) -> bool:
    """Improved bullet may only use numbers from the original or bracketed placeholders like [X%]."""
    stripped = re.sub(r"\[[^\]]*\]", "", improved)
    return _numbers(stripped) <= _numbers(original)


def validate_analysis(data) -> dict:
    d = _obj(data, "analysis")

    overall = _obj(d.get("overall_assessment"), "overall_assessment")
    ats = _obj(d.get("ats_compatibility"), "ats_compatibility")
    skills = _obj(d.get("skills_assessment"), "skills_assessment")
    keywords = _obj(d.get("keywords"), "keywords")
    experience = _obj(d.get("experience_evaluation"), "experience_evaluation")

    out = {
        "overall_assessment": {
            "score": _score(overall.get("score"), "overall_assessment.score"),
            "summary": _str(overall.get("summary"), "overall_assessment.summary", 2000),
        },
        "ats_compatibility": {
            "score": _score(ats.get("score"), "ats_compatibility.score"),
            "notes": _str_list(ats.get("notes", []), "ats_compatibility.notes"),
        },
        "strengths": [],
        "weaknesses": [],
        "skills_assessment": {
            "summary": _str(skills.get("summary"), "skills_assessment.summary"),
            "present": _str_list(skills.get("present", []), "skills_assessment.present"),
            "recommended": _str_list(skills.get("recommended", []), "skills_assessment.recommended"),
        },
        "keywords": {
            "present": _str_list(keywords.get("present", []), "keywords.present"),
            "missing": _str_list(keywords.get("missing", []), "keywords.missing"),
        },
        "experience_evaluation": {
            "summary": _str(experience.get("summary"), "experience_evaluation.summary", 2000),
            "quantified_achievements": _str_list(
                experience.get("quantified_achievements", []), "experience_evaluation.quantified_achievements"
            ),
            "gaps": _str_list(experience.get("gaps", []), "experience_evaluation.gaps"),
        },
        "recommendations": [],
        "bullet_improvements": [],
        "job_match": None,
    }

    for item in _list(d.get("strengths"), "strengths", 12):
        item = _obj(item, "strengths[]")
        out["strengths"].append(
            {"point": _str(item.get("point"), "strengths[].point", 300), "evidence": _str(item.get("evidence", "") or "n/a", "strengths[].evidence", 500)}
        )
    for item in _list(d.get("weaknesses"), "weaknesses", 12):
        item = _obj(item, "weaknesses[]")
        out["weaknesses"].append(
            {
                "point": _str(item.get("point"), "weaknesses[].point", 300),
                "evidence": _str(item.get("evidence", "") or "n/a", "weaknesses[].evidence", 500),
                "why_it_matters": _str(item.get("why_it_matters"), "weaknesses[].why_it_matters", 500),
            }
        )
    for item in _list(d.get("recommendations"), "recommendations", 15):
        item = _obj(item, "recommendations[]")
        priority = str(item.get("priority", "")).lower()
        if priority not in ("high", "medium", "low"):
            raise AnalysisValidationError("'recommendations[].priority' must be high, medium or low")
        out["recommendations"].append(
            {
                "priority": priority,
                "action": _str(item.get("action"), "recommendations[].action", 500),
                "why": _str(item.get("why"), "recommendations[].why", 500),
            }
        )

    # Bullet rewrites: drop (not fail) any that look fabricated.
    for item in _list(d.get("bullet_improvements", []), "bullet_improvements", 12):
        if not isinstance(item, dict):
            continue
        try:
            orig = _str(item.get("original"), "bullet.original", 600)
            improved = _str(item.get("improved"), "bullet.improved", 600)
            reason = _str(item.get("reason"), "bullet.reason", 400)
        except AnalysisValidationError:
            continue
        if bullet_is_faithful(orig, improved):
            out["bullet_improvements"].append({"original": orig, "improved": improved, "reason": reason})

    jm = d.get("job_match")
    if jm is not None:
        jm = _obj(jm, "job_match")
        out["job_match"] = {
            "alignment_score": _score(jm.get("alignment_score"), "job_match.alignment_score"),
            "summary": _str(jm.get("summary"), "job_match.summary", 1500),
            "matched_keywords": _str_list(jm.get("matched_keywords", []), "job_match.matched_keywords"),
            "missing_keywords": _str_list(jm.get("missing_keywords", []), "job_match.missing_keywords"),
            "suggestions": _str_list(jm.get("suggestions", []), "job_match.suggestions", 10),
        }
    return out
