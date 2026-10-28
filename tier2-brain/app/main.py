import os
import time

import redis.asyncio as redis
from fastapi import FastAPI
from pydantic import BaseModel, Field

from .scoring import BLOCK_THRESHOLD, total_score

MODE = os.getenv("BOUNCER_MODE", "monitor")  # monitor | enforce
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
BLOCK_TTL_SECONDS = 3600
HISTORY_LEN = 20

app = FastAPI(title="Cyber Bouncer Tier-2 Brain")
r = redis.from_url(REDIS_URL, decode_responses=True)


class EvalRequest(BaseModel):
    ip: str
    headers: dict[str, str] = Field(default_factory=dict)
    body: str = ""


class EvalResponse(BaseModel):
    action: str  # allow | block
    score: int
    mode: str


@app.get("/healthz")
async def healthz():
    return {"ok": True, "mode": MODE}


@app.post("/evaluate", response_model=EvalResponse)
async def evaluate(req: EvalRequest):
    if await r.exists(f"blocked:{req.ip}"):
        return EvalResponse(action="block" if MODE == "enforce" else "allow", score=100, mode=MODE)

    key = f"hist:{req.ip}"
    await r.rpush(key, time.time())
    await r.ltrim(key, -HISTORY_LEN, -1)
    await r.expire(key, BLOCK_TTL_SECONDS)
    timestamps = [float(t) for t in await r.lrange(key, 0, -1)]

    score = total_score(timestamps, req.headers, req.body)
    if score >= BLOCK_THRESHOLD:
        await r.set(f"blocked:{req.ip}", score, ex=BLOCK_TTL_SECONDS)
        return EvalResponse(action="block" if MODE == "enforce" else "allow", score=score, mode=MODE)
    return EvalResponse(action="allow", score=score, mode=MODE)
