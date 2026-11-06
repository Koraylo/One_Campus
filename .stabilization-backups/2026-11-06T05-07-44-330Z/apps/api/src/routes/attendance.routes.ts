import { Router, Request, Response, NextFunction } from 'express';
import {
  getStudentAttendanceSummary,
  getSectionAttendanceRecords,
  markSectionAttendance,
  getSectionStudentsWithAttendance,
} from '../services/attendance.service';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// GET /api/attendance/my
router.get('/my', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await getStudentAttendanceSummary(req.user!.id);
    res.status(200).json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
});

// GET /api/attendance/section/:id
router.get(
  '/section/:id',
  authenticate,
  authorize('faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getSectionAttendanceRecords(
        req.params.id,
        req.user!.role === 'admin' ? undefined : req.user!.id
      );
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/attendance/mark
router.post(
  '/mark',
  authenticate,
  authorize('faculty'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sectionId, date, records } = req.body;
      if (!sectionId || !date || !Array.isArray(records)) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: sectionId, date, records (array)',
        });
        return;
      }

      const result = await markSectionAttendance(sectionId, req.user!.id, date, records);
      res.status(200).json({
        success: true,
        data: result,
        message: `Successfully marked attendance for ${result.count} students.`,
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/attendance/section/:id/students
router.get(
  '/section/:id/students',
  authenticate,
  authorize('faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dateStr = req.query.date as string | undefined;
      const result = await getSectionStudentsWithAttendance(req.params.id, dateStr);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
