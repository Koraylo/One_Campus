import { Router, Request, Response, NextFunction } from 'express';
import { getUserGCRSections } from '../services/gcr.service';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/gcr/my-sections
router.get('/my-sections', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getUserGCRSections(req.user!.id, req.user!.role);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

export default router;
