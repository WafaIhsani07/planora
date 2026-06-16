import { db } from "./src/config/database.js";

async function main() {
  try {
    const users = await db.user.findMany({
      include: {
        vendor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    console.log("=== LATEST 10 USERS ===");
    for (const u of users) {
      console.log(`ID: ${u.id}`);
      console.log(`Name: ${u.name}`);
      console.log(`Email: ${u.email}`);
      console.log(`Phone: ${u.phone}`);
      console.log(`Role: ${u.role}`);
      console.log(`Has Vendor Profile: ${!!u.vendor}`);
      if (u.vendor) {
        console.log(`  Vendor ID: ${u.vendor.id}`);
        console.log(`  Business Name: ${u.vendor.businessName}`);
        console.log(`  Status: ${u.vendor.status}`);
      }
      console.log("------------------------");
    }
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await db.$disconnect();
  }
}

main();
