import { Router, Request, Response, NextFunction } from 'express';
import { getChannelMessages, sendMessage, pollNewMessages } from '../services/message.service';
import { authenticate } from '../middleware/auth';

const router = Router();
const MAX_MESSAGE_LENGTH = 4000;

router.get('/:channelId/new', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const after = typeof req.query.after === 'string' ? req.query.after : undefined;
    if (after && Number.isNaN(Date.parse(after))) {
      res.status(400).json({ success: false, error: '`after` must be a valid ISO timestamp.' });
      return;
    }
    const messages = await pollNewMessages(req.params.channelId, req.user!.id, after);
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
});

router.get('/:channelId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limitValue = req.query.limit;
    const limit = limitValue === undefined ? undefined : Number.parseInt(String(limitValue), 10);
    if (limit !== undefined && (!Number.isInteger(limit) || limit < 1 || limit > 100)) {
      res.status(400).json({ success: false, error: 'limit must be an integer between 1 and 100.' });
      return;
    }

    const before = typeof req.query.before === 'string' ? req.query.before : undefined;
    if (before && Number.isNaN(Date.parse(before))) {
      res.status(400).json({ success: false, error: '`before` must be a valid ISO timestamp.' });
      return;
    }

    const messages = await getChannelMessages(req.params.channelId, req.user!.id, { limit, before });
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
});

router.post('/:channelId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const content = req.body?.content;
    if (typeof content !== 'string' || !content.trim()) {
      res.status(400).json({ success: false, error: 'Content must be a non-empty string.' });
      return;
    }
    if (content.trim().length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({ success: false, error: `Messages cannot exceed ${MAX_MESSAGE_LENGTH} characters.` });
      return;
    }

    const message = await sendMessage(req.params.channelId, req.user!.id, content);
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
});

export default router;
