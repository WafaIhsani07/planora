import 'dotenv/config';
import { db } from './src/config/database.js';
const prisma = db;

async function main() {
  await prisma.vendor.updateMany({
    where: { businessName: 'Ritz Wedding Organizer' },
    data: { balance: { decrement: 22000000.00 } }
  });
  await prisma.vendor.updateMany({
    where: { businessName: 'Wafa Media Studio' },
    data: { balance: { decrement: 15500000.00 } }
  });
  await prisma.vendor.updateMany({
    where: { businessName: 'Rosella Decoration' },
    data: { balance: { decrement: 8500000.00 } }
  });
  console.log("Selesai menghapus saldo dummy dari database!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
