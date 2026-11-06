import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { prisma } from './lib/prisma';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import timetableRoutes from './routes/timetable.routes';
import attendanceRoutes from './routes/attendance.routes';
import odRoutes from './routes/od.routes';
import clubRoutes from './routes/club.routes';
import eventRoutes from './routes/event.routes';
import marksRoutes from './routes/marks.routes';
import certificateRoutes from './routes/certificate.routes';
import channelRoutes from './routes/channel.routes';
import messageRoutes from './routes/message.routes';
import announcementRoutes from './routes/announcement.routes';
import gcrRoutes from './routes/gcr.routes';

const app = express();

app.disable('x-powered-by');
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests (health probes, curl, server-to-server).
      if (!origin || config.corsOrigins.includes(origin.replace(/\/$/, ''))) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// A real readiness check: API availability alone does not mean the database works.
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Health check] Database connection failed:', error);
    res.status(503).json({
      status: 'degraded',
      database: 'unavailable',
      timestamp: new Date().toISOString(),
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/od', odRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/gcr', gcrRoutes);

app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`[One Campus API] Listening on http://localhost:${config.port}`);
  console.log(`[One Campus API] CORS origins: ${config.corsOrigins.join(', ')}`);
});

async function shutdown(signal: string) {
  console.log(`[One Campus API] ${signal} received; closing server...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));

export default app;
