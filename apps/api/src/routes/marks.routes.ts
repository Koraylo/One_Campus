import { Router, Request, Response, NextFunction } from 'express';
import { getStudentMarks, getSectionMarks, uploadSectionMarks } from '../services/marks.service';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// GET /api/marks/my (Student views their marks)
router.get('/my', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const marks = await getStudentMarks(req.user!.id);
    res.status(200).json({ success: true, data: marks });
  } catch (err) {
    next(err);
  }
});

// GET /api/marks/section/:id (Faculty views marks for a section)
router.get(
  '/section/:id',
  authenticate,
  authorize('faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getSectionMarks(
        req.params.id,
        req.user!.role === 'admin' ? undefined : req.user!.id
      );
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/marks/upload (Faculty bulk uploads marks)
router.post(
  '/upload',
  authenticate,
  authorize('faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sectionId, examType, records } = req.body;
      if (!sectionId || !examType || !Array.isArray(records)) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: sectionId, examType, records (array)',
        });
        return;
      }

      const result = await uploadSectionMarks(req.user!.id, {
        sectionId,
        examType,
        records,
      });

      res.status(200).json({
        success: true,
        data: result,
        message: `Successfully uploaded ${result.count} mark records for ${examType}.`,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
