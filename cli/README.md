## CLI Utilities

One‑minute boot guide for the CLI.

- Prereqs: Node 20+, npm
- Install deps (if not present): `npm install`
- Run directly: `node src/index.js`
- Optional global link: `npm link` then use `prism-job <command>`

Examples:
- `prism-job ingest ./some.pdf --type pdf`
- `prism-job sync --dry-run`

Env:
- If needed, create `cli/.env` for service credentials.
