import { Router, Request, Response, NextFunction } from 'express';
import { getUserById } from '../services/user.service';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/users/profile
router.get('/profile', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await getUserById(req.user!.id);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:id
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
