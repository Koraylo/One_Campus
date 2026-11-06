import { Router, Request, Response, NextFunction } from 'express';
import { getChannelMessages, sendMessage, pollNewMessages } from '../services/message.service';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/messages/:channelId/new (Poll for new messages)
router.get('/:channelId/new', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const after = req.query.after as string;
    const messages = await pollNewMessages(req.params.channelId, req.user!.id, after);
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
});

// GET /api/messages/:channelId (Messages in channel, paginated)
router.get('/:channelId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, before } = req.query;
    const messages = await getChannelMessages(req.params.channelId, req.user!.id, {
      limit: limit ? parseInt(limit as string, 10) : undefined,
      before: before as string | undefined,
    });
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
});

// POST /api/messages/:channelId (Send message)
router.post('/:channelId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      res.status(400).json({ success: false, error: 'Content cannot be empty' });
      return;
    }

    const message = await sendMessage(req.params.channelId, req.user!.id, content);
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
});

export default router;
