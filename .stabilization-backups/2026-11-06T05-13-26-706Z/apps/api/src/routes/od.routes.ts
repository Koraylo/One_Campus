import { Router, Request, Response, NextFunction } from 'express';
import {
  submitODRequest,
  submitMLRequest,
  getPendingRequestsForFaculty,
  approveODRequest,
  rejectODRequest,
  getStudentODRequests,
} from '../services/od.service';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// POST /api/od/request (Student submits OD request)
router.post('/request', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { eventId, sectionIds, requestedDate, reason } = req.body;
    if (!sectionIds || !requestedDate) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: sectionIds (array), requestedDate',
      });
      return;
    }

    const created = await submitODRequest(req.user!.id, {
      eventId,
      sectionIds,
      requestedDate,
      reason,
    });

    res.status(201).json({
      success: true,
      data: created,
      message: 'OD request submitted successfully',
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/od/ml-request (Student submits ML request)
router.post('/ml-request', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sectionIds, requestedDate, reason } = req.body;
    if (!sectionIds || !requestedDate) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: sectionIds (array), requestedDate',
      });
      return;
    }

    const created = await submitMLRequest(req.user!.id, {
      sectionIds,
      requestedDate,
      reason,
    });

    res.status(201).json({
      success: true,
      data: created,
      message: 'ML request submitted successfully',
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/od/pending (Faculty views pending OD/ML requests)
router.get(
  '/pending',
  authenticate,
  authorize('faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pending = await getPendingRequestsForFaculty(req.user!.id);
      res.status(200).json({ success: true, data: pending });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/od/:id/approve (Faculty approves OD/ML)
router.patch(
  '/:id/approve',
  authenticate,
  authorize('faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await approveODRequest(req.params.id, req.user!.id);
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Request approved and attendance updated.',
      });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/od/:id/reject (Faculty rejects OD/ML)
router.patch(
  '/:id/reject',
  authenticate,
  authorize('faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await rejectODRequest(req.params.id, req.user!.id);
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Request rejected.',
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/od/my (Student's own OD/ML requests)
router.get('/my', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const myRequests = await getStudentODRequests(req.user!.id);
    res.status(200).json({ success: true, data: myRequests });
  } catch (err) {
    next(err);
  }
});

export default router;
