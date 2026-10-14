import { Router, Request, Response, NextFunction } from 'express';
import { getMyClub, getClubById, getAllClubs } from '../services/club.service';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/clubs/my (Club lead / coordinator's club)
router.get('/my', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const club = await getMyClub(req.user!.id);
    res.status(200).json({ success: true, data: club });
  } catch (err) {
    next(err);
  }
});

// GET /api/clubs/:id (Club details)
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const club = await getClubById(req.params.id);
    res.status(200).json({ success: true, data: club });
  } catch (err) {
    next(err);
  }
});

// GET /api/clubs (List all clubs)
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clubs = await getAllClubs();
    res.status(200).json({ success: true, data: clubs });
  } catch (err) {
    next(err);
  }
});

export default router;
