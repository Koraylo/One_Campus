import { Router, Request, Response, NextFunction } from 'express';
import { loginUser, getUserProfileById } from '../services/auth.service';
import { authenticate } from '../middleware/auth';
import { config } from '../config/env';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const { user, token } = await loginUser(email, password);

    res.cookie(config.cookieName, token, {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        message: 'Login successful',
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, (req: Request, res: Response) => {
  res.clearCookie(config.cookieName, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'lax',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserProfileById(req.user!.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
