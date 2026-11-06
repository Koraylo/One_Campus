import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Import route handlers
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

// Middlewares
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
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

// Global Error Handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`[Campus Portal API] Server running on http://localhost:${PORT}`);
  console.log(`[Campus Portal API] CORS allowed origin: ${config.corsOrigin}`);
});

export default app;
