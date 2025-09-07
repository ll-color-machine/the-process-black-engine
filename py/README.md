## Python Jobs Server (FastAPI)

One‑minute boot guide for the jobs API.

- Prereqs: Python 3.10+, `ffmpeg` on PATH
- Create venv: `python3 -m venv .venv && source .venv/bin/activate`
- Install deps: `pip install fastapi uvicorn python-dotenv`
- Env: create `py/.env` (e.g., `MACHINE_NAME`, optional `DATA_ROOT`)
- Run: `uvicorn src.main:app --host 127.0.0.1 --port 4071 --reload`
- Health: `curl http://127.0.0.1:4071/health`

Notes:
- Write temp files under `DATA_ROOT` if set.
- Add CORS if calling from the browser during dev.
