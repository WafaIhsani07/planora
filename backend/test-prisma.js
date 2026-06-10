import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

async function main() {
  console.log('Testing Prisma connection and dashboard queries...');
  
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('Testing db.user.count()...');
    const uCount = await prisma.user.count();
    console.log('User count:', uCount);

    console.log('Testing db.vendor.count()...');
    const vCount = await prisma.vendor.count();
    console.log('Vendor count:', vCount);

    console.log('Testing db.booking.count()...');
    const bCount = await prisma.booking.count();
    console.log('Booking count:', bCount);

    console.log('Testing db.payment.aggregate()...');
    const pAgg = await prisma.payment.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true },
    });
    console.log('Payment aggregate:', pAgg);

  } catch (error) {
    console.error('Error during queries:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
