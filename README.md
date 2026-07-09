# 🤝 Helping Hands — AI Community Donation Platform (Backend)

A production-ready REST API for a community-driven social impact platform. Built with **TypeScript, Express, and Prisma**, it powers the full campaign lifecycle for a donation and volunteer coordination platform: **campaign creation, discovery, donation processing, and volunteer commitment tracking.**

> Originally built for a hackathon (Spring 2026) across a distributed team, under live-demo time constraints, and validated against a field of 300+ concurrent participants.

## Features

- **Campaign lifecycle management** — create, update, discover, and close fundraising campaigns
- **Donation processing** — atomic transactions that record donations and update campaign totals in real time
- **Volunteer coordination** — commit hours to a campaign, track status (pending → confirmed → completed)
- **Auth & roles** — JWT-based auth with `ADMIN` / `ORGANIZER` / `DONOR` roles and ownership checks
- **Discovery** — search, filter by category/status, and paginate campaigns
- **Live stats endpoint** — aggregate platform metrics for a dashboard or demo screen
- **Validation & error handling** — Zod schema validation, centralized error middleware, rate limiting, Helmet
- **Tests** — integration tests covering the core campaign → donation → volunteer flow

## Tech Stack

| Layer          | Choice                          |
|----------------|----------------------------------|
| Language       | TypeScript                       |
| Runtime        | Node.js + Express                |
| Database/ORM   | Prisma + SQLite (swap to Postgres for prod) |
| Auth           | JWT (`jsonwebtoken`, `bcryptjs`) |
| Validation     | Zod                               |
| Testing        | Vitest + Supertest                |

## Project Structure

```
helping-hands-api/
├── prisma/
│   ├── schema.prisma       # Data model: User, Campaign, Donation, VolunteerCommitment
│   └── seed.ts             # Demo data for local/live-demo use
├── src/
│   ├── config/db.ts        # Prisma client singleton
│   ├── middleware/         # auth (JWT), centralized error handling
│   ├── routes/              # auth, campaigns, donations, volunteers, stats
│   ├── types/schemas.ts    # Zod request validation schemas
│   ├── utils/               # ApiError, asyncHandler, jwt helpers
│   ├── app.ts               # Express app assembly
│   └── index.ts             # Server entrypoint
├── tests/
│   └── campaigns.test.ts
├── .env.example
└── package.json
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
The default `.env` uses SQLite, so there's nothing else to configure for local development.

### 3. Set up the database
```bash
npm run prisma:migrate   # creates the SQLite DB and applies the schema
npm run seed              # optional: loads demo campaigns/donations/volunteers
```

### 4. Run the dev server
```bash
npm run dev
```
The API is now live at `http://localhost:4000`. Health check: `GET /health`.

### 5. Run tests
```bash
npm test
```

## API Overview

| Method | Endpoint                                   | Auth              | Description |
|--------|---------------------------------------------|-------------------|-------------|
| POST   | `/api/auth/register`                        | —                 | Create an account |
| POST   | `/api/auth/login`                           | —                 | Log in, get a JWT |
| GET    | `/api/campaigns`                            | —                 | List/search/filter campaigns |
| GET    | `/api/campaigns/:id`                        | —                 | Campaign detail |
| POST   | `/api/campaigns`                            | Organizer/Admin   | Create a campaign |
| PUT    | `/api/campaigns/:id`                        | Owner/Admin       | Update a campaign |
| DELETE | `/api/campaigns/:id`                        | Owner/Admin       | Delete a campaign |
| GET    | `/api/campaigns/:id/donations`              | —                 | List donations |
| POST   | `/api/campaigns/:id/donations`              | —                 | Make a donation |
| GET    | `/api/campaigns/:id/volunteers`             | —                 | List volunteer commitments |
| POST   | `/api/campaigns/:id/volunteers`              | —                 | Commit as a volunteer |
| PATCH  | `/api/volunteers/:id`                       | Auth required     | Update volunteer status/hours |
| GET    | `/api/stats`                                | —                 | Platform-wide metrics |

Full request/response shapes are defined in `src/types/schemas.ts`.

### Example: create a campaign
```bash
curl -X POST http://localhost:4000/api/campaigns \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Winter Coat Drive",
    "description": "Coats for families at local shelters.",
    "category": "Community Aid",
    "goalAmount": 5000
  }'
```

## Production Notes

- Swap `provider = "sqlite"` for `"postgresql"` in `prisma/schema.prisma` and point `DATABASE_URL` at a managed Postgres instance for production/scale.
- Set a strong, unique `JWT_SECRET`.
- Put the API behind a reverse proxy / platform (Render, Railway, Fly.io, AWS) with HTTPS.

## License

MIT
