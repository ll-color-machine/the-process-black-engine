# the-process-black-engine

Engine powering Process Black's work. This repo follows a “per-folder project” pattern: each subfolder is its own isolated project with its own tooling and env, and there is no root package.json or monorepo orchestrator.

**Why No Root Orchestrator?**
- Independence: each app (web, bot, CLI, jobs) boots and deploys on its own.
- Simpler environments: no cross-project node_modules or root scripts to drift/break.
- Clear boundaries: different runtimes (Node/Next, Bolt, Python) stay loosely coupled.
- The Prism coordinates across machines; this repo focuses on one machine.

**Repo Layout**
- `nextjs/`: Next.js app (pnpm)
- `slack/`: Slack Bolt bot in Socket Mode (npm)
- `cli/`: Node CLI utilities (npm)
- `py/`: Python FastAPI jobs server
- `_context/`: plans, prompts, schemas (docs only)

**Quickstart**
- Next.js (`nextjs/`)
  - Prereqs: Node 20+, pnpm
  - Create or install: `pnpm create next-app@latest . --ts --eslint --src-dir --app --tailwind --import-alias "@/*"` or `pnpm i`
  - Dev: `pnpm dev --port 3030`
  - Env: `nextjs/.env.local` (e.g., `MACHINE_NAME`, `PORT_WEB=3030`)
  - URL: http://localhost:3030

- Slack bot (`slack/`)
  - Prereqs: Node 20+, npm; Slack App with Socket Mode
  - Install: `npm i` (typical deps: `@slack/bolt`, `dotenv`, `nodemon`)
  - Dev: `npm run dev`
  - Env: `slack/.env` with `SLACK_APP_TOKEN`, `SLACK_BOT_TOKEN`, optional `PY_SERVICE_URL`
  - Notes: Slash commands in Socket Mode don’t require a public Request URL

- CLI (`cli/`)
  - Prereqs: Node 20+, npm
  - Install: `npm i` (typical deps: `commander`, `dotenv`)
  - Run: `node src/index.js` or `npm link` then `prism-job <cmd>`
  - Example: `prism-job ingest ./some.pdf --type pdf`

- Python jobs server (`py/`)
  - Prereqs: Python 3.10+, `ffmpeg` on PATH
  - Setup: `python3 -m venv .venv && source .venv/bin/activate && pip install fastapi uvicorn python-dotenv`
  - Env: `py/.env` (e.g., `MACHINE_NAME`, `DATA_ROOT`)
  - Run: `uvicorn src.main:app --host 127.0.0.1 --port 4071 --reload`
  - Health: `curl http://127.0.0.1:4071/health`

**Ports & URLs**
- Next.js: 3030 (override with `--port` in dev)
- Python: 4071 (`http://127.0.0.1:4071`)
- Slack: Socket Mode, no local port required
- CLI: no port; shells processes or calls services

Lockfiles are committed per subproject (e.g., `pnpm-lock.yaml`, `package-lock.json`), and each folder maintains its own `.env` file ignored by Git.
