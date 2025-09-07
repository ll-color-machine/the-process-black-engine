# Color Machine Repo Template (Lower-Tech, Per-Folder Projects)

This document outlines a **single-machine repo** template for your Color System (e.g., `the-purple-machine`). Each subfolder is its **own project** with its own tooling, lockfile, and `.env`. There is **no root Node project** and no orchestration layer at the root.

The Prism orchestrates across machines; each machine repo hosts its own:

* **Next.js** front end
* **Slack bot** (Bolt in socket mode)
* **CLI** (Node)
* **Python jobs server** (FastAPI)
  Plus a `_context/` area for plans, prompts, and schemas.

---

## Directory Layout

```
the-purple-machine/
├─ .gitignore
├─ README.md
├─ _context/
│  ├─ plans/
│  ├─ prompts/
│  └─ schemas/
├─ nextjs/           # pnpm-managed Next.js app
│  ├─ .env.local     # env for Next; NOT committed
│  └─ ...            # Next files
├─ slack/            # npm-managed Bolt socket-mode bot (JS)
│  ├─ .env           # Slack tokens & service URLs; NOT committed
│  └─ ...            # JS bot code
├─ cli/              # npm-managed Node CLI (JS)
│  ├─ .env           # if CLI needs service creds; NOT committed
│  └─ ...            # CLI code
└─ py/               # Python FastAPI jobs server
   ├─ .env           # Python service env; NOT committed
   └─ ...            # FastAPI app
```

---

## Environment & Secrets Policy

* You will **keep separate `.env` files per subproject**:

  * `nextjs/.env.local`
  * `slack/.env`
  * `cli/.env` (optional)
  * `py/.env`
* **Next.js** only reads env files inside its own app folder (it does **not** walk up).
* **Slack/CLI** (Node) and **Python** can load `.env` directly from their own subfolder using `dotenv` / `python-dotenv`.
* Root `.gitignore` must ignore `**/.env*` so secrets aren’t committed anywhere.

### Suggested env variables (per machine)

Common values you’ll likely reuse (adapt per project):

```
# identity
MACHINE_NAME=the-purple-machine
MACHINE_COLOR=PURPLE
ROLE=worker+web

# local data (temp files, scratch space)
DATA_ROOT=/Volumes/ColorData/purple/tmp

# ports & URLs
PORT_WEB=3030
PY_SERVICE_URL=http://127.0.0.1:4071

# Slack (in slack/.env)
SLACK_APP_TOKEN=xapp-***
SLACK_BOT_TOKEN=xoxb-***

# storage / data (if used)
SUPABASE_URL=
SUPABASE_ANON_KEY=
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=

# Airtable (if used)
AIRTABLE_API_TOKEN=
AIRTABLE_BKC_BASE_ID=

# OpenAI or other model providers (scoped per subproject as you prefer)
OPENAI_API_KEY=
```

---

## Root `.gitignore` (Drop-in)

This extends GitHub’s Node template with **OS junk, pnpm logs, Python & notebook ignores**, etc.

```gitignore
# --- OS junk ---
.DS_Store
Thumbs.db

# --- pnpm (you already cover npm/yarn) ---
pnpm-debug.log*
.pnpm-debug.log*

# --- Editors / IDE (optional) ---
.vscode/
.idea/
*.swp
*.swo

# --- Python (for py/ subproject) ---
__pycache__/
*.py[cod]
*.pyo
*.pyd
*.egg-info/
.eggs/
.pytest_cache/
.mypy_cache/
.tox/
.coverage
.coverage.*
htmlcov/
.venv/
venv/
ENV/
env/
.uv/

# --- Notebooks (keep .ipynb, ignore junk) ---
.ipynb_checkpoints/
*.ipynb~

# --- Turborepo (if added later) ---
.turbo/

# --- Prisma / SQLite (optional, if used) ---
*.db
*.sqlite
*.sqlite3
prisma/dev.db
prisma/*.db

# --- Supabase local (optional) ---
supabase/.temp/
supabase/.branches/

# --- Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# --- Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# --- Runtime data
pids
*.pid
*.seed
*.pid.lock

# --- jscoverage/JSCover
lib-cov

# --- Coverage
coverage
*.lcov
.nyc_output

# --- Grunt
.grunt

# --- Bower
bower_components

# --- node-waf
.lock-wscript

# --- Compiled addons
build/Release

# --- Dependencies
node_modules/
jspm_packages/
web_modules/

# --- TypeScript cache
*.tsbuildinfo

# --- Optional caches
.npm
.eslintcache
.stylelintcache

# --- REPL history
.node_repl_history

# --- npm pack
*.tgz

# --- Yarn integrity
.yarn-integrity

# --- dotenv env files (root and subfolders)
.env
.env.*
**/.env
**/.env.*
!.env.example

# --- Parcel
.cache
.parcel-cache

# --- Next.js
.next
out

# --- Nuxt / general dist
.nuxt
dist

# --- Gatsby
.cache/
# public

# --- vuepress
.vuepress/dist
.temp
.cache

# --- SvelteKit
.svelte-kit/

# --- vitepress
**/.vitepress/dist
**/.vitepress/cache

# --- Docusaurus
.docusaurus

# --- Serverless
.serverless/

# --- FuseBox
.fusebox/

# --- DynamoDB local
.dynamodb/

# --- Firebase cache
.firebase/

# --- TernJS
.tern-port

# --- VSCode test artifacts
.vscode-test

# --- Yarn v3
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

# --- Vite logs
vite.config.js.timestamp-*
vite.config.ts.timestamp-*
```

---

## Initialize Each Subproject

> Treat each folder as an isolated project. Run these commands **inside** the respective folder.

### 1) Next.js app (`nextjs/`) — pnpm

**Create app (TypeScript or JS—your call).** Examples below assume TypeScript.

```bash
cd nextjs
pnpm create next-app@latest . \
  --ts --eslint --src-dir --app --tailwind --import-alias "@/*"

# Confirm: package.json created, plus next.config, tsconfig, etc.
echo "MACHINE_NAME=the-purple-machine" > .env.local
echo "PORT_WEB=3030" >> .env.local
pnpm dev --port 3030
```

**Minimal home page (optional tweak):** `app/page.tsx`

```tsx
export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">the-purple-machine</h1>
      <p className="mt-2 text-sm opacity-70">Role: worker+web · Color: PURPLE</p>
    </main>
  );
}
```

> Tailwind & shadcn/ui: the `create next-app` flag above already set up Tailwind. You can add shadcn/ui later as desired.

---

### 2) Slack bot (`slack/`) — npm, **JavaScript (CommonJS)**

```bash
cd slack
npm init -y
npm i @slack/bolt dotenv
npm i -D nodemon

# scripts
npm pkg set scripts.dev="nodemon index.js"
npm pkg set scripts.start="node index.js"

# env template
cat > .env << 'EOF'
MACHINE_NAME=the-purple-machine
MACHINE_COLOR=PURPLE

SLACK_APP_TOKEN=xapp-***
SLACK_BOT_TOKEN=xoxb-***

PY_SERVICE_URL=http://127.0.0.1:4071
EOF
```

**`index.js`**

```js
require('dotenv').config();
const { App, LogLevel } = require('@slack/bolt');

const app = new App({
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  token: process.env.SLACK_BOT_TOKEN,
  logLevel: LogLevel.INFO
});

app.event('app_mention', async ({ say }) => {
  await say(`👋 ${process.env.MACHINE_NAME} (${process.env.MACHINE_COLOR}) online.`);
});

app.command('/purple', async ({ ack, respond }) => {
  await ack();
  await respond('💜 Running a quick health check…');
  // Example: call your Python jobs server health
  try {
    const res = await fetch(`${process.env.PY_SERVICE_URL}/health`);
    const json = await res.json();
    await respond(`🩺 py health: \`${JSON.stringify(json)}\``);
  } catch (e) {
    await respond(`⚠️ py health fetch failed: ${e.message}`);
  }
});

(async () => {
  await app.start();
  console.log('⚡ slack bot (socket-mode) up');
})();
```

> In Slack, add a `/purple` Slash Command (Request URL can be anything for socket-mode; it’s not used). Make sure **Socket Mode** is enabled and scopes match your events/commands.

Run dev: `npm run dev`

---

### 3) CLI (`cli/`) — npm, **JavaScript (CommonJS)**

```bash
cd cli
npm init -y
npm i commander dotenv
npm i -D nodemon

# scripts
npm pkg set scripts.dev="nodemon src/index.js"
npm pkg set scripts.build="echo '(no build step for JS CLI)'"
npm pkg set scripts.start="node src/index.js"

# bin entry
npm pkg set bin.prism-job="bin/prism-job.js"

mkdir -p bin src/commands
```

**`bin/prism-job.js`**

```js
#!/usr/bin/env node
require('../src/index.js');
```

Make it executable:

```bash
chmod +x bin/prism-job.js
```

**`src/index.js`**

```js
require('dotenv').config();
const { program } = require('commander');
const { ingest } = require('./commands/ingest');
const { transcode } = require('./commands/transcode');
const { sync } = require('./commands/sync');

program.name('prism-job').version('0.1.0');

program
  .command('ingest <path>')
  .option('--type <kind>', 'link|pdf|image|video', 'link')
  .description('Register asset with the Prism/DB')
  .action(ingest);

program
  .command('transcode <input>')
  .option('-p, --preset <preset>', 'ffmpeg preset', 'medium')
  .description('Run local ffmpeg job')
  .action(transcode);

program
  .command('sync')
  .description('Sync _context/plans with the Prism')
  .action(sync);

program.parseAsync(process.argv);
```

**`src/commands/ingest.js`**

```js
exports.ingest = async (target, opts) => {
  console.log(`[ingest] ${opts.type} -> ${target}`);
  // TODO: push metadata to Airtable/Supabase/etc.
};
```

**`src/commands/transcode.js`**

```js
const { spawn } = require('node:child_process');
exports.transcode = async (input, opts) => {
  const out = input.replace(/\.[^.]+$/, '') + '.mp4';
  const args = ['-y', '-i', input, '-preset', opts.preset, out];
  console.log('ffmpeg', args.join(' '));
  await new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', args, { stdio: 'inherit' });
    p.on('exit', code => (code === 0 ? resolve() : reject(new Error('ffmpeg failed'))));
  });
  console.log('✅ output:', out);
};
```

**`src/commands/sync.js`**

```js
const { readdir, readFile } = require('node:fs/promises');
const path = require('node:path');

exports.sync = async () => {
  const plansDir = path.resolve(process.cwd(), '../_context/plans');
  const files = await readdir(plansDir);
  console.log('Syncing plans:', files);
  // TODO: upload or register plans as needed
};
```

Use globally (via PATH) or with `npx`:

```bash
# from cli/
npm link          # optional for global usage during dev
prism-job ingest ./some.pdf --type pdf
```

---

### 4) Python Jobs Server (`py/`) — FastAPI

You can use **uv** (fast) or plain venv + pip. Below uses pip/venv for portability.

```bash
cd py
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn python-dotenv

cat > .env << 'EOF'
MACHINE_NAME=the-purple-machine
MACHINE_COLOR=PURPLE
DATA_ROOT=/Volumes/ColorData/purple/tmp
EOF

mkdir -p src
```

**`src/main.py`**

```python
import os
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import subprocess, tempfile

load_dotenv()  # loads py/.env
app = FastAPI(title="purple-machine-jobs")

@app.get("/health")
def health():
    return {
        "machine": os.getenv("MACHINE_NAME", "unknown"),
        "color": os.getenv("MACHINE_COLOR", "unknown"),
        "status": "ok"
    }

class TranscodeReq(BaseModel):
    input: str
    preset: str = "medium"

@app.post("/transcode")
def transcode(req: TranscodeReq):
    out = tempfile.mktemp(suffix=".mp4")
    cmd = ["ffmpeg", "-y", "-i", req.input, "-preset", req.preset, out]
    subprocess.run(cmd, check=True)
    return {"output": out}
```

Run:

```bash
uvicorn src.main:app --host 127.0.0.1 --port 4071 --reload
# test
curl http://127.0.0.1:4071/health
```

---

## How the Pieces Talk (lightweight contracts)

* **Slack → Python**: Slash command (e.g., `/purple transcode <file>`) triggers the bot to call `POST /transcode` on the Python server and report progress/results in the Slack thread.
* **Next.js → Python**: Admin page with a button that `fetch()`es `POST /transcode` (authenticated via your choice—Clerk/Auth.js/etc.—later).
* **CLI → Python/Prism**: CLI shells long-running processes (e.g., ffmpeg) or POSTs to Python/Prism. It can also sync `_context/plans` to Airtable/Supabase.

> Keep a minimal JSON schema in `_context/schemas/job.json` if you want typed job contracts later (job `id`, `type`, `inputs`, `outputs`, `provenance`).

---

## Health, Logging & Data

* **Python**: `GET /health` returns `{machine, color, status}`.
* **Slack**: `/purple` replies OK and can include Python health (as shown).
* **Next.js**: add `/api/health` that returns `{ ok: true, version }`.

**Data & temp files**

* Use `DATA_ROOT` for scratch space; Python can write temp outputs here.
* Upload final artifacts to Supabase/S3 in Slack or Python layer (your choice).

---

## Versions & Tooling

* Create an `.nvmrc` at repo root if you want a standard Node across subprojects:

  ```
  20
  ```
* In `nextjs/package.json`, set the package manager version:

  ```json
  { "packageManager": "pnpm@9.9.0" }
  ```
* In `slack/package.json` and `cli/package.json`, you can add:

  ```json
  { "engines": { "node": ">=20 <23" } }
  ```

---

## Security Notes

* Keep **all** `.env*` out of Git; the provided `.gitignore` handles subfolders.
* If you publish machine repos, use **private** by default and rotate keys per machine to track usage/billing.
* Favor **least privilege** keys per subproject (e.g., distinct OpenAI keys).

---

## Troubleshooting

* **Next.js isn’t seeing env vars** → ensure they live in `nextjs/.env.local` (not root).
* **Bolt socket mode won’t start** → verify `SLACK_APP_TOKEN` (xapp-) and `SLACK_BOT_TOKEN` (xoxb-) are correct; app has Socket Mode enabled; required scopes granted.
* **ffmpeg not found** → install ffmpeg on the machine and ensure it’s on PATH.
* **CORS from Next.js → Python** → either call Python from server side (Next server functions) or configure CORS in FastAPI.

---

## Quick Checklists

**Create the repo skeleton**

```bash
mkdir -p the-purple-machine/{_context/plans,_context/prompts,_context/schemas,nextjs,slack,cli,py}
```

**Next.js (pnpm)**

```bash
cd nextjs
pnpm create next-app@latest . --ts --eslint --src-dir --app --tailwind --import-alias "@/*"
echo "MACHINE_NAME=the-purple-machine" > .env.local
echo "PORT_WEB=3030" >> .env.local
pnpm dev --port 3030
```

**Slack bot (npm, JS)**

```bash
cd ../slack
npm init -y
npm i @slack/bolt dotenv
npm i -D nodemon
# create .env and index.js as above
npm run dev
```

**CLI (npm, JS)**

```bash
cd ../cli
npm init -y
npm i commander dotenv
npm i -D nodemon
# create bin/ and src/ files as above
npm link   # optional
prism-job sync
```

**Python (FastAPI)**

```bash
cd ../py
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn python-dotenv
# create src/main.py and .env as above
uvicorn src.main:app --port 4071 --reload
```

---

If you want, I can also generate **starter files** for all four subfolders so each one boots out of the box with the code shown here.
