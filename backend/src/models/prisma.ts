import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!((global as any).prisma instanceof PrismaClient)) {
    (global as any).prisma = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });

    (global as any).prisma.$on('error' as never, (e: any) => {
      logger.error(e, 'Database error');
    });

    (global as any).prisma.$on('warn' as never, (e: any) => {
      logger.warn(e, 'Database warning');
    });
  }
  prisma = (global as any).prisma;
}

export default prisma;
