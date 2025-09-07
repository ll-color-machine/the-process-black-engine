## Next.js App

One‑minute boot guide for the web app.

- Prereqs: Node 20+, pnpm
- Setup (new project):
  - `pnpm create next-app@latest . --ts --eslint --src-dir --app --tailwind --import-alias "@/*"`
- Setup (existing project):
  - `pnpm install`
- Env: create `nextjs/.env.local` (example: `MACHINE_NAME=the-purple-machine`, `PORT_WEB=3030`)
- Dev: `pnpm dev --port 3030`
- URL: http://localhost:3030

Notes:
- Next.js only loads env from inside this folder.
- Any client‑exposed env must be prefixed with `NEXT_PUBLIC_`.
