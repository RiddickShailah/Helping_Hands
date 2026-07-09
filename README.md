# 🤝 Helping Hands — Community Donation & Volunteer Platform

A full-stack community impact platform: **Express + Prisma REST API** powering a **Next.js community UI** with an interactive map, photo-rich campaign stories, donations, and volunteer sign-ups.

> Built for a hackathon (Spring 2026) — validated against 300+ concurrent participants.

## What's included

| Layer | Stack | Features |
|---|---|---|
| **API** | TypeScript, Express, Prisma, SQLite | Campaigns, donations, volunteers, JWT auth, stats |
| **Web UI** | Next.js 14, Tailwind, Leaflet | Community map, photo stories, donate & volunteer forms |

### Web UI highlights
- **Interactive community map** — every campaign pinned by neighborhood (Leaflet + OpenStreetMap)
- **Photo-rich campaigns** — cover images + gallery grids on every card
- **Community Stories** — masonry photo wall from all campaign galleries
- **Donate & volunteer** — forms wired to the live API
- **Live stats dashboard** — total raised, volunteers, hours committed
- **Mock data fallback** — UI works even if the API isn't running

---

## Run locally (see the UI)

### Terminal 1 — API (port 4000)
```bash
cd ~/Desktop/Projects/Helping_Hands
npm install
cp .env.example .env
npm run prisma:push
npm run seed
npm run dev
```

### Terminal 2 — Web UI (port 3000)
```bash
cd ~/Desktop/Projects/Helping_Hands/web
npm install
cp .env.example .env.local
npm run dev
```

Open **http://localhost:3000**

| Page | URL | What to try |
|---|---|---|
| Home | `/` | Hero, stats, map preview, featured campaigns |
| Campaigns | `/campaigns` | Browse all campaigns with photos |
| Map | `/map` | Click pins, select from sidebar list |
| Stories | `/stories` | Photo masonry grid |
| Campaign detail | `/campaigns/:id` | Gallery, donate, volunteer |

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/campaigns` | List/search campaigns (includes lat/lng, photos) |
| GET | `/api/campaigns/:id` | Campaign detail |
| POST | `/api/campaigns/:id/donations` | Make a donation |
| POST | `/api/campaigns/:id/volunteers` | Sign up to volunteer |
| GET | `/api/stats` | Platform metrics |
| POST | `/api/auth/login` | JWT login |

Demo organizer: `organizer@helpinghands.dev` / `password123`

---

## Deploy

**API:** Render, Railway, or Fly.io — swap SQLite for Postgres in `prisma/schema.prisma`

**Web UI:** [Vercel](https://vercel.com) — import repo, set root directory to `web`, add env `NEXT_PUBLIC_API_URL=https://your-api.onrender.com`

---

## Project structure

```
Helping_Hands/
├── src/                 Express API
├── prisma/              Schema + seed (8 campaigns with map pins & photos)
├── web/                 Next.js community UI
│   ├── app/             Home, campaigns, map, stories
│   └── components/      CommunityMap, CampaignCard, etc.
└── tests/
```

## License

MIT
