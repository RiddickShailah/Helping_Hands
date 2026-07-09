import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding demo data...");

  const passwordHash = await bcrypt.hash("password123", 10);

  const organizer = await prisma.user.upsert({
    where: { email: "organizer@helpinghands.dev" },
    update: {},
    create: {
      name: "Jordan Reyes",
      email: "organizer@helpinghands.dev",
      passwordHash,
      role: "ORGANIZER",
    },
  });

  const campaign1 = await prisma.campaign.create({
    data: {
      title: "Winter Coat Drive for Local Shelters",
      description: "Collecting funds to purchase winter coats for families at three regional shelters.",
      category: "Community Aid",
      goalAmount: 5000,
      status: "ACTIVE",
      organizerId: organizer.id,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      title: "Neighborhood Park Cleanup & Restoration",
      description: "Funding tools and supplies for a volunteer-led park restoration weekend.",
      category: "Environment",
      goalAmount: 2000,
      status: "ACTIVE",
      organizerId: organizer.id,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    },
  });

  await prisma.donation.createMany({
    data: [
      { campaignId: campaign1.id, donorName: "Alex Kim", donorEmail: "alex@example.com", amount: 100 },
      { campaignId: campaign1.id, donorName: "Sam Patel", donorEmail: "sam@example.com", amount: 250, message: "Happy to help!" },
      { campaignId: campaign2.id, donorName: "Anonymous", donorEmail: "anon@example.com", amount: 50, anonymous: true },
    ],
  });

  await prisma.campaign.update({
    where: { id: campaign1.id },
    data: { raisedAmount: { increment: 350 } },
  });
  await prisma.campaign.update({
    where: { id: campaign2.id },
    data: { raisedAmount: { increment: 50 } },
  });

  await prisma.volunteerCommitment.createMany({
    data: [
      { campaignId: campaign1.id, name: "Riley Chen", email: "riley@example.com", role: "Sorting & Packing", hoursCommitted: 4 },
      { campaignId: campaign2.id, name: "Morgan Lee", email: "morgan@example.com", role: "Trail Cleanup Lead", hoursCommitted: 6, status: "CONFIRMED" },
    ],
  });

  console.log("✅ Seed complete.");
  console.log(`   Organizer login: organizer@helpinghands.dev / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
