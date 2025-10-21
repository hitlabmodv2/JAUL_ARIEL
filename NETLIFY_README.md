Netlify deployment note
======================

Netlify is a static-site / serverless platform. This repository contains a WhatsApp bot
which requires a long-lived WebSocket/connection and persistent background process.

What this Netlify setup does:
- Adds a minimal `netlify.toml` and a demo serverless function at `/.netlify/functions/ping`
- Deploying to Netlify will succeed and the ping function will work, but the WhatsApp bot
  (index.js) will NOT run persistently on Netlify. Use Docker-based hosts (Render, Fly)
  or a VPS if you need the bot to be always-on.
