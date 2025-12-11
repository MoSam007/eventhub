import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Handle connection
prisma.$connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((error: unknown) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });

// Handle disconnection on app termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
