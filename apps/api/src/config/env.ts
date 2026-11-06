import dotenv from 'dotenv';
import path from 'path';

// Support both `pnpm --filter @koraylo/api dev` from the workspace root and
// running the API directly from apps/api.
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const isProduction = process.env.NODE_ENV === 'production';
const jwtSecret = process.env.JWT_SECRET?.trim();
const databaseUrl = process.env.DATABASE_URL?.trim();
const directUrl = process.env.DIRECT_URL?.trim();

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required. Configure the Supabase pooled PostgreSQL URL in the root .env or apps/api/.env file.');
}

if (!directUrl) {
  throw new Error('DIRECT_URL is required. Configure the Supabase direct/session connection URL for Prisma migrations.');
}

if (!jwtSecret) {
  throw new Error('JWT_SECRET is required. Generate a unique secret and set it in your local environment.');
}

if (isProduction && jwtSecret.length <  32) {
  throw new Error('JWT_SECRET must contain at least 32 characters in production.');
}

const port = Number.parseInt(process.env.API_PORT || process.env.PORT || '3000', 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('API_PORT must be a valid TCP port between 1 and 65535.');
}

const corsOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:3001')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

export const config = {
  port,
  jwtSecret,
  databaseUrl,
  corsOrigins,
  cookieName: 'campus-token',
  jwtExpiresIn: '7d',
  isProduction,
};
