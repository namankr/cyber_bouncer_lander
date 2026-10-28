"""Pure scoring functions for the Tier-2 behavioral engine."""
import re
import statistics
from typing import Mapping, Sequence

BLOCK_THRESHOLD = 70

# Weights
W_CONSTANT_CADENCE = 70
W_MISSING_ACCEPT_LANGUAGE = 30
W_RCE = 80
W_SQLI = 80

RCE_PATTERNS = [
    re.compile(r"\bsystem\s*\(", re.I),
    re.compile(r"/etc/passwd", re.I),
    re.compile(r"\b(exec|eval)\s*\(", re.I),
    re.compile(r";\s*(cat|ls|wget|curl|nc|bash|sh)\b", re.I),
]
SQLI_PATTERNS = [
    re.compile(r"\bunion\b.+\bselect\b", re.I),
    re.compile(r"'\s*or\s+'?1'?\s*=\s*'?1", re.I),
    re.compile(r";\s*drop\s+table\b", re.I),
]


def inter_arrival_cv(timestamps: Sequence[float]) -> float | None:
    """Coefficient of variation of gaps between request timestamps."""
    if len(timestamps) < 4:
        return None
    gaps = [b - a for a, b in zip(timestamps, timestamps[1:])]
    mean = statistics.fmean(gaps)
    if mean <= 0:
        return 0.0
    return statistics.pstdev(gaps) / mean


def score_cadence(timestamps: Sequence[float]) -> int:
    cv = inter_arrival_cv(timestamps)
    return W_CONSTANT_CADENCE if cv is not None and cv < 0.01 else 0


def score_headers(headers: Mapping[str, str]) -> int:
    lowered = {k.lower() for k in headers}
    return W_MISSING_ACCEPT_LANGUAGE if "accept-language" not in lowered else 0


def score_payload(body: str) -> int:
    if any(p.search(body) for p in RCE_PATTERNS):
        return W_RCE
    if any(p.search(body) for p in SQLI_PATTERNS):
        return W_SQLI
    return 0


def total_score(timestamps: Sequence[float], headers: Mapping[str, str], body: str) -> int:
    return min(100, score_cadence(timestamps) + score_headers(headers) + score_payload(body))
