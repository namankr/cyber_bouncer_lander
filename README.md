# Cyber Bouncer

AI-native application shielding: a two-tier reverse-proxy defence against automated and LLM-driven traffic.

```
cyber-bouncer/
├── landing-page/      # Marketing site + interactive defence simulator (static)
├── tier1-edge/        # Rust → WASM inline guard for Envoy
├── tier2-brain/       # FastAPI behavioural scoring engine (Redis-backed)
└── deploy/            # docker-compose for local dev
```

## Quick start
```bash
# Landing page only
open landing-page/index.html

# Brain + Redis + landing page
cd deploy && docker compose up --build

# Tier-2 tests
cd tier2-brain && pip install -r requirements.txt && pytest
```

## Modes
`BOUNCER_MODE=monitor` (log only, default) · `BOUNCER_MODE=enforce` (block at score ≥ 70)
