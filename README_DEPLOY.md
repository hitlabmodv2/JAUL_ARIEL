# Deployment options for Auto-Read Story WhatsApp Bot

Short answer about Netlify
-------------------------
Netlify is a static-site and serverless platform aimed at hosting front-end apps and serverless functions. It is not suitable for long-running persistent processes like a WhatsApp bot that must maintain a WebSocket/long-lived connection.

Recommended platforms
---------------------
- Render (supports Docker and background services)
- Railway (supports background workers)
- Fly.io (runs containers close to users)
- A VPS or cloud VM (DigitalOcean, Linode, AWS EC2) with PM2 or systemd
- Replit (easy but less production-grade)

Docker (recommended)
---------------------
This repo includes a `Dockerfile` and `docker-compose.yml` for local testing and deployment. Using Docker makes it straightforward to deploy to Render, Fly, or any host that accepts containers.

Local testing with Docker Compose
--------------------------------
1. Build and run:

```bash
docker compose up --build -d
```

2. Logs:

```bash
docker compose logs -f
```

Deploy to Render (example)
--------------------------
1. Create a new service on Render and choose "Web Service" or "Private Service".
2. Connect your GitHub repo and set the build command to `docker build -t jaul_ariel .` or use Render's Docker deployment option.
3. Set environment variables (if any) like `TZ`.
4. Ensure you mount persistent storage for the `sessions/` directory (Render provides persistent disks for paid plans).

Deploy to Railway
-----------------
1. Create a new project and link GitHub repo.
2. Add a worker separate from the web service (Railway supports workers/background processes).
3. Set environment variables and a persistent volume for `sessions/` (Railway provides volume addons).

VPS + PM2
---------
1. Provision a VM (Ubuntu 22.04 recommended).
2. Install Node.js and PM2, or use Docker.
3. Copy the repo or pull from GitHub.
4. Start with PM2 so the bot restarts on crash:

```bash
npm ci --only=production
pm2 start index.js --name jaul_ariel_bot
pm2 save
pm2 startup
```

Notes about persistence and secrets
---------------------------------
- The `sessions/` folder must be persisted across restarts; keep it out of git and mount it as a volume when using Docker.
- Use environment variables or a secrets manager for sensitive tokens (do NOT commit tokens to the repo).

If you want, I can prepare a Render or Railway deploy configuration file (Dockerfile is already present). Tell me which provider you prefer and I will add provider-specific steps.
