import { Router, Request, Response, NextFunction } from 'express';
import { getUserTimetable, getTodayTimetable } from '../services/timetable.service';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/timetable/my
router.get('/my', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timetable = await getUserTimetable(req.user!.id, req.user!.role);
    res.status(200).json({ success: true, data: timetable });
  } catch (err) {
    next(err);
  }
});

// GET /api/timetable/today
router.get('/today', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todayClasses = await getTodayTimetable(req.user!.id, req.user!.role);
    res.status(200).json({ success: true, data: todayClasses });
  } catch (err) {
    next(err);
  }
});

export default router;
