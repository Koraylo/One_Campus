import dotenv from 'dotenv';
import path from 'path';

// Load .env from current directory and root monorepo directory
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  port: parseInt(process.env.API_PORT || process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'campus-portal-jwt-secret-change-in-production',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/campus_portal',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  cookieName: 'campus-token',
  jwtExpiresIn: '7d',
  isProduction: process.env.NODE_ENV === 'production',
};
