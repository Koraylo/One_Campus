import { Router, Request, Response, NextFunction } from 'express';
import { getUserAnnouncements, createAnnouncement } from '../services/announcement.service';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// GET /api/announcements (Announcements in user's scope)
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const announcements = await getUserAnnouncements(req.user!.id, req.user!.role);
    res.status(200).json({ success: true, data: announcements });
  } catch (err) {
    next(err);
  }
});

// POST /api/announcements (Create announcement)
router.post(
  '/',
  authenticate,
  authorize('faculty', 'club_lead', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, content, scope, scopeId } = req.body;
      if (!title || !content || !scope) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: title, content, scope',
        });
        return;
      }

      const created = await createAnnouncement(req.user!.id, {
        title,
        content,
        scope,
        scopeId,
      });

      res.status(201).json({
        success: true,
        data: created,
        message: 'Announcement posted successfully.',
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
