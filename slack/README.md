## Slack Bot (Bolt, Socket Mode)

One‑minute boot guide for the Slack app.

- Prereqs: Node 20+, npm; Slack App with Socket Mode enabled
- Install deps (if not present): `npm install`
- Env: create `slack/.env` with:
  - `SLACK_APP_TOKEN=xapp-...`
  - `SLACK_BOT_TOKEN=xoxb-...`
  - optional `PY_SERVICE_URL=http://127.0.0.1:4071`
- Dev: `npm run dev`

Notes:
- Socket Mode does not require a public Request URL for slash commands.
- Ensure scopes match events/commands you use.
