import { Router, Request, Response, NextFunction } from 'express';
import { getUserChannels, getChannelById } from '../services/channel.service';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/channels/my (User's channels with latest message)
router.get('/my', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const channels = await getUserChannels(req.user!.id);
    res.status(200).json({ success: true, data: channels });
  } catch (err) {
    next(err);
  }
});

// GET /api/channels/:id (Channel details)
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const channel = await getChannelById(req.params.id, req.user!.id);
    res.status(200).json({ success: true, data: channel });
  } catch (err) {
    next(err);
  }
});

export default router;
