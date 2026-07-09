import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";
import { prisma } from "../src/config/db";

const app = createApp();

describe("Health check", () => {
  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("Campaign lifecycle", () => {
  const email = `organizer_${Date.now()}@test.dev`;
  let token: string;
  let campaignId: string;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test Organizer",
      email,
      password: "password123",
      role: "ORGANIZER",
    });
    token = res.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates a campaign", async () => {
    const res = await request(app)
      .post("/api/campaigns")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Campaign",
        description: "A campaign created during automated tests.",
        category: "Testing",
        goalAmount: 1000,
      });
    expect(res.status).toBe(201);
    expect(res.body.raisedAmount).toBe(0);
    campaignId = res.body.id;
  });

  it("rejects campaign creation without auth", async () => {
    const res = await request(app).post("/api/campaigns").send({
      title: "No Auth",
      description: "Should fail without a token.",
      category: "Testing",
      goalAmount: 100,
    });
    expect(res.status).toBe(401);
  });

  it("accepts a donation and increments raisedAmount", async () => {
    const res = await request(app).post(`/api/campaigns/${campaignId}/donations`).send({
      donorName: "Test Donor",
      donorEmail: "donor@test.dev",
      amount: 150,
    });
    expect(res.status).toBe(201);

    const campaign = await request(app).get(`/api/campaigns/${campaignId}`);
    expect(campaign.body.raisedAmount).toBe(150);
  });

  it("accepts a volunteer commitment", async () => {
    const res = await request(app).post(`/api/campaigns/${campaignId}/volunteers`).send({
      name: "Test Volunteer",
      email: "vol@test.dev",
      role: "Setup Crew",
      hoursCommitted: 3,
    });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("PENDING");
  });
});
