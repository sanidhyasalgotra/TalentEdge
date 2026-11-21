"""Sliding-window limiter, per user, in process memory.

LIMITATION: counters are per process. With several workers/instances the effective limit
multiplies. Before multi-instance deployment, replace `hit` with a shared store (Redis/Postgres).
"""
import time
from collections import defaultdict, deque


class RateLimiter:
    def __init__(self, limit: int, window_seconds: int = 3600):
        self.limit, self.window = limit, window_seconds
        self._hits: dict[str, deque] = defaultdict(deque)

    def hit(self, key: str, now: float | None = None) -> bool:
        """Record an attempt. Returns False if the caller is over the limit."""
        now = time.monotonic() if now is None else now
        q = self._hits[key]
        while q and now - q[0] > self.window:
            q.popleft()
        if len(q) >= self.limit:
            return False
        q.append(now)
        return True
