import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  databaseUrl: process.env.DATABASE_URL || '',

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',

  // Environment checks
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTesting: process.env.NODE_ENV === 'test',
};

export default config;
