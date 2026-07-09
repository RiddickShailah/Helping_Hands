# 🤝 Helping Hands — Community Donation & Volunteer Platform

A full-stack community impact platform: **Express + Prisma REST API** powering a **Next.js community UI** with an interactive map, photo-rich campaign stories, donations, and volunteer sign-ups.

> Built for a hackathon (Spring 2026) — validated against 300+ concurrent participants.

## What's included

| Layer | Stack | Features |
|---|---|---|
| **API** | TypeScript, Express, Prisma, SQLite | Campaigns, donations, volunteers, JWT auth, stats |
| **Web UI** | Next.js 14, Tailwind, Leaflet | Community map, photo stories, secure demo checkout, JWT login |

### Web UI highlights
- **Interactive community map** — every campaign pinned by neighborhood (Leaflet + OpenStreetMap)
- **Photo-rich campaigns** — cover images + gallery grids on every card
- **Community Stories** — masonry photo wall from all campaign galleries
- **Secure demo checkout** — PCI-style payment flow with demo Visa card (no real charges)
- **Demo login** — one-click sign-in as donor or organizer
- **Trust & security UX** — encryption banner, trust badges, JWT sessions in sessionStorage
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
| Campaign detail | `/campaigns/:id` | Gallery, secure donate checkout, volunteer |
| Sign in | `/login` | Demo donor & organizer one-click login |

### Demo credentials

| Role | Email | Password |
|---|---|---|
| Donor | `donor@helpinghands.dev` | `password123` |
| Organizer | `organizer@helpinghands.dev` | `password123` |

### Demo payment card

| Field | Value |
|---|---|
| Card | `4242 4242 4242 4242` |
| Expiry | `12/28` |
| CVC | `123` |
| ZIP | `30303` |

Click **Use demo card** in checkout to auto-fill. No real charges are made.

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
| POST | `/api/payments/demo` | Demo card validation & sandbox authorization |

Demo accounts — see table above.

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
