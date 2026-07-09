import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CAMPAIGNS = [
  {
    title: "Winter Coat Drive for Local Shelters",
    description: "Collecting funds to purchase 200+ winter coats for families at three regional shelters. Last year we served 847 neighbors — help us beat that record.",
    category: "Community Aid",
    goalAmount: 5000,
    raisedAmount: 3420,
    neighborhood: "Downtown Atlanta",
    address: "100 Edgewood Ave NE, Atlanta, GA",
    latitude: 33.7540,
    longitude: -84.3805,
    coverImageUrl: "https://images.unsplash.com/photo-1488521787991-ed7b6ddd0eec?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1532629345422-751c0ecd710e?w=600&q=80",
      "https://images.unsplash.com/photo-1469571486292-0bde5817813f?w=600&q=80",
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80",
    ],
  },
  {
    title: "Neighborhood Park Cleanup & Restoration",
    description: "Funding tools, mulch, and native plants for a volunteer-led restoration of Historic Fourth Ward Park. 120 volunteers signed up so far.",
    category: "Environment",
    goalAmount: 2000,
    raisedAmount: 1680,
    neighborhood: "Old Fourth Ward",
    address: "680 Dallas St NE, Atlanta, GA",
    latitude: 33.7685,
    longitude: -84.3612,
    coverImageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
      "https://images.unsplash.com/photo-1595853035070-59a139ad84d1?w=600&q=80",
    ],
  },
  {
    title: "Community Fridge — Fresh Produce Weekly",
    description: "Stocking a 24/7 community fridge with fresh produce, milk, and essentials for food-insecure neighbors in West End.",
    category: "Food Security",
    goalAmount: 3500,
    raisedAmount: 2100,
    neighborhood: "West End",
    address: "850 Ralph David Abernathy Blvd, Atlanta, GA",
    latitude: 33.7345,
    longitude: -84.4102,
    coverImageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1594282418427-62f8218500ad?w=600&q=80",
      "https://images.unsplash.com/photo-1579113814621-70f6849c97d8?w=600&q=80",
    ],
  },
  {
    title: "After-School Tutoring for Eastside Kids",
    description: "Free tutoring and homework help for 60 elementary students. Funds cover snacks, books, and bus passes for volunteer mentors.",
    category: "Education",
    goalAmount: 4500,
    raisedAmount: 3900,
    neighborhood: "East Atlanta",
    address: "572 Flat Shoals Ave SE, Atlanta, GA",
    latitude: 33.7398,
    longitude: -84.3465,
    coverImageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1427504490125-7946a296d285?w=600&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
    ],
  },
  {
    title: "Senior Wellness Check-In Program",
    description: "Training volunteers to visit homebound seniors weekly — companionship, meal delivery coordination, and health check calls.",
    category: "Community Aid",
    goalAmount: 6000,
    raisedAmount: 4200,
    neighborhood: "Grant Park",
    address: "600 Cherokee Ave SE, Atlanta, GA",
    latitude: 33.7375,
    longitude: -84.3720,
    coverImageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
    ],
  },
  {
    title: "BeltLine Community Garden Expansion",
    description: "Expanding raised beds along the Eastside Trail so 40 families can grow their own food. Includes soil, seeds, and irrigation.",
    category: "Environment",
    goalAmount: 2800,
    raisedAmount: 1950,
    neighborhood: "BeltLine Eastside",
    address: "Eastside Trail at Krog St, Atlanta, GA",
    latitude: 33.7565,
    longitude: -84.3638,
    coverImageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1464226184884-fa280b87f0b8?w=600&q=80",
      "https://images.unsplash.com/photo-1592150621744-62627a561369?w=600&q=80",
    ],
  },
  {
    title: "Emergency Rent Relief Fund",
    description: "Direct assistance for families facing eviction. Partnered with local housing nonprofits — 100% of donations go to verified cases.",
    category: "Housing",
    goalAmount: 10000,
    raisedAmount: 7650,
    neighborhood: "Midtown",
    address: "1280 Peachtree St NE, Atlanta, GA",
    latitude: 33.7890,
    longitude: -84.3845,
    coverImageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=600&q=80",
    ],
  },
  {
    title: "Youth Art Mural Project — Westside",
    description: "Paying local teen artists to design and paint a 200ft community mural celebrating Westside history and resilience.",
    category: "Arts & Culture",
    goalAmount: 3200,
    raisedAmount: 890,
    neighborhood: "Westside",
    address: "950 Murphy Ave SW, Atlanta, GA",
    latitude: 33.7280,
    longitude: -84.4250,
    coverImageUrl: "https://images.unsplash.com/photo-1499781350541-7783f309930e?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1460661419341-fcc204f8139b?w=600&q=80",
      "https://images.unsplash.com/photo-1578301978693-85bb59405009?w=600&q=80",
    ],
  },
];

async function main() {
  console.log("🌱 Seeding community campaigns...");

  await prisma.volunteerCommitment.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.campaign.deleteMany();

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

  for (const c of CAMPAIGNS) {
    const campaign = await prisma.campaign.create({
      data: {
        title: c.title,
        description: c.description,
        category: c.category,
        goalAmount: c.goalAmount,
        raisedAmount: c.raisedAmount,
        status: "ACTIVE",
        neighborhood: c.neighborhood,
        address: c.address,
        latitude: c.latitude,
        longitude: c.longitude,
        coverImageUrl: c.coverImageUrl,
        galleryImages: JSON.stringify(c.gallery),
        organizerId: organizer.id,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });

    await prisma.donation.create({
      data: {
        campaignId: campaign.id,
        donorName: "Community Member",
        donorEmail: "donor@example.com",
        amount: Math.round(c.raisedAmount * 0.2),
        message: "Proud to support our neighbors!",
      },
    });

    await prisma.volunteerCommitment.create({
      data: {
        campaignId: campaign.id,
        name: "Volunteer Team",
        email: "volunteer@example.com",
        role: "Community Helper",
        hoursCommitted: 4,
        status: "CONFIRMED",
      },
    });
  }

  console.log(`✅ Seeded ${CAMPAIGNS.length} campaigns with photos & map pins.`);
  console.log("   Organizer login: organizer@helpinghands.dev / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
