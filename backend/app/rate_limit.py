"""Per-process authentication throttling for the single-worker API."""

import math
import time
from collections import OrderedDict, deque

from starlette.requests import Request
from starlette.responses import JSONResponse


class AuthRateLimitMiddleware:
    def __init__(self, app, limit=10, window=60, clock=time.monotonic):
        self.app = app
        self.limit = limit
        self.window = window
        self.clock = clock
        self.attempts = OrderedDict()

    async def __call__(self, scope, receive, send):
        path = scope.get("path", "").rstrip("/")
        if (scope["type"] != "http" or scope["method"] != "POST"
                or path not in ("/auth/login", "/auth/register")):
            await self.app(scope, receive, send)
            return

        now = self.clock()
        cutoff = now - self.window
        # Entries are ordered by their latest accepted attempt, so expired IPs
        # can be removed without scanning every active entry on each request.
        while self.attempts:
            oldest = next(iter(self.attempts))
            if self.attempts[oldest][-1] > cutoff:
                break
            del self.attempts[oldest]

        request = Request(scope)
        # Uvicorn resolves trusted proxy headers; never trust a raw header here.
        ip = request.client.host if request.client else "unknown"
        key = (ip, path)
        attempts = self.attempts.setdefault(key, deque())
        while attempts and attempts[0] <= cutoff:
            attempts.popleft()

        if len(attempts) >= self.limit:
            retry_after = max(1, math.ceil(attempts[0] + self.window - now))
            action = "login" if path == "/auth/login" else "registration"
            response = JSONResponse(
                status_code=429,
                content={"detail": f"Too many {action} attempts. Please try again in {retry_after} seconds."},
                headers={"Retry-After": str(retry_after)},
            )
            await response(scope, receive, send)
            return

        # No await between checking and recording: concurrent requests on the
        # server's event loop cannot exceed the limit. Invalid bodies count too.
        attempts.append(now)
        self.attempts.move_to_end(key)
        await self.app(scope, receive, send)
