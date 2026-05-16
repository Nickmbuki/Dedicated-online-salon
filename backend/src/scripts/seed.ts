import bcrypt from "bcryptjs";
import { db, queryClient } from "../db/client.js";
import { services, users } from "../db/schema.js";

const serviceSeed = [
  {
    name: "Signature Natural Hairstyling",
    slug: "signature-natural-hairstyling",
    category: "hair" as const,
    description: "Expert styling for natural curls, coils, waves, and relaxed hair with careful consultation.",
    priceCents: null,
    durationMinutes: 120,
    imageUrl: "https://images.unsplash.com/photo-1684200757007-a3af11299189?auto=format&fit=crop&w=1200&q=88",
    isDoorToDoor: true
  },
  {
    name: "African Plaiting and Protective Styling",
    slug: "african-plaiting-protective-styling",
    category: "hair" as const,
    description: "Beautiful braids, plaits, and protective styling for events, interviews, and everyday confidence.",
    priceCents: null,
    durationMinutes: 150,
    imageUrl: "https://images.unsplash.com/photo-1678101629498-965e3c7e0417?auto=format&fit=crop&w=1200&q=88",
    isDoorToDoor: true
  },
  {
    name: "Children's Gentle Hair Care",
    slug: "childrens-gentle-hair-care",
    category: "children" as const,
    description: "Patient children's hair service emphasizing gentle handling, comfort, and neat protective styling.",
    priceCents: null,
    durationMinutes: 90,
    imageUrl: "https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?auto=format&fit=crop&w=1200&q=88",
    isDoorToDoor: true
  },
  {
    name: "Luxury Manicure",
    slug: "luxury-manicure",
    category: "nails" as const,
    description: "Clean shaping, cuticle care, polish, and professional hygiene standards.",
    priceCents: 250000,
    durationMinutes: 60,
    imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
    isDoorToDoor: true
  },
  {
    name: "Pedicure and Legs Scrub",
    slug: "pedicure-legs-scrub",
    category: "nails" as const,
    description: "Refreshing pedicure with legs washing and scrubbing for a refined finish.",
    priceCents: 350000,
    durationMinutes: 90,
    imageUrl: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=80",
    isDoorToDoor: true
  },
  {
    name: "Facial Scrub and Skincare Glow",
    slug: "facial-scrub-skincare-glow",
    category: "skincare" as const,
    description: "Gentle cleansing, scrub, and skincare preparation with hygienic tools and calming technique.",
    priceCents: 300000,
    durationMinutes: 75,
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
    isDoorToDoor: true
  },
  {
    name: "Wedding and Event Preparation",
    slug: "wedding-event-preparation",
    category: "event" as const,
    description: "Complete preparation for weddings, special occasions, photoshoots, and polished entrances.",
    priceCents: 1200000,
    durationMinutes: 180,
    imageUrl: "https://images.unsplash.com/photo-1572955304332-bf714bd49add?auto=format&fit=crop&w=1200&q=88",
    isDoorToDoor: true
  },
  {
    name: "Interview Grooming Package",
    slug: "interview-grooming-package",
    category: "event" as const,
    description: "Professional grooming for interviews, workplace confidence, and refined first impressions.",
    priceCents: 450000,
    durationMinutes: 90,
    imageUrl: "https://images.unsplash.com/photo-1624823574478-acf031dec181?auto=format&fit=crop&w=1200&q=88",
    isDoorToDoor: true
  }
];

async function main() {
  const passwordHash = await bcrypt.hash("AdminPass123!", 12);

  await db
    .insert(users)
    .values({
      fullName: "Elegant Beauty Admin",
      email: "admin@elegantbeauty.local",
      phone: "0726432210",
      passwordHash,
      role: "admin"
    })
    .onConflictDoNothing();

  for (const service of serviceSeed) {
    await db
      .insert(services)
      .values(service)
      .onConflictDoUpdate({
        target: services.slug,
        set: {
          name: service.name,
          category: service.category,
          description: service.description,
          priceCents: service.priceCents,
          durationMinutes: service.durationMinutes,
          imageUrl: service.imageUrl,
          isDoorToDoor: service.isDoorToDoor,
          isActive: true,
          updatedAt: new Date()
        }
      });
  }

  console.log("Seed complete. Admin: admin@elegantbeauty.local / AdminPass123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await queryClient.end();
  });
