import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Handle connection
prisma.$connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });

// Handle disconnection on app termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;