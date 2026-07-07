# node-red-coolify

Thin deploy wrapper for [Node-RED](https://nodered.org) on Coolify. Builds `nodered/node-red:5.0` with extra nodes baked in and auth pre-configured.

## What's included

- **Base:** `nodered/node-red:5.0` (pinned)
- **Nodes baked in:** Dashboard 2.0 (`@flowfuse/node-red-dashboard`), `node-red-contrib-cron-plus`, `node-red-node-email`, `node-red-contrib-postgresql`, `node-red-contrib-telegrambot`
- **Auth:** `adminAuth` (editor) + `httpNodeAuth` (dashboard) — credentials via env vars

## Deploy (Coolify)

- Build pack: **Dockerfile**
- Exposed port: `1880`
- Persistent storage: `/data` (flows + credentials)

### Required env vars

| Var | Purpose |
|-----|---------|
| `NODE_RED_CREDENTIAL_SECRET` | encrypts stored flow credentials |
| `NODE_RED_PASSWORD_HASH` | bcrypt hash — editor admin login |
| `NODE_RED_HTTP_PASSWORD_HASH` | bcrypt hash — dashboard login |
| `NODE_RED_ADMIN_USER` | editor username (default `admin`) |
| `NODE_RED_HTTP_USER` | dashboard username (default `viewer`) |
| `TZ` | timezone |

Generate a password hash: `npx node-red-admin hash-pw`

## How it works

- Nodes install to `/usr/src/node-red` (image dir), so the `/data` volume never shadows them.
- `settings.js` is baked to `/usr/src/node-red/settings.js` and passed via `--settings`. The image entrypoint runs `node red.js --userDir /data $FLOWS "$@"`, forwarding extra args — so auth config stays out of the `/data` volume and can't be shadowed.
