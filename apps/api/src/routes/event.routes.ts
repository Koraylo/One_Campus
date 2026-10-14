import { Router, Request, Response, NextFunction } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  approveEvent,
  rejectEvent,
  registerForEvent,
  getEventRegistrations,
  markEventAttendance,
  updateEventStatus,
} from '../services/event.service';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// GET /api/events (List events with optional filters)
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, clubId } = req.query;
    const events = await getEvents({
      status: status as string | undefined,
      clubId: clubId as string | undefined,
      studentId: req.user!.role === 'student' ? req.user!.id : undefined,
    });
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id (Event details)
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await getEventById(
      req.params.id,
      req.user!.role === 'student' ? req.user!.id : undefined
    );
    res.status(200).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
});

// POST /api/events (Club lead creates event)
router.post(
  '/',
  authenticate,
  authorize('club_lead', 'faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clubId, title, description, date, venue } = req.body;
      if (!clubId || !title || !date) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: clubId, title, date',
        });
        return;
      }

      const created = await createEvent(req.user!.id, {
        clubId,
        title,
        description,
        date,
        venue,
      });

      res.status(201).json({
        success: true,
        data: created,
        message: 'Event created and pending faculty approval.',
      });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/events/:id/approve (Faculty coordinator approves event)
router.patch(
  '/:id/approve',
  authenticate,
  authorize('faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const approved = await approveEvent(req.params.id, req.user!.id);
      res.status(200).json({
        success: true,
        data: approved,
        message: 'Event approved successfully.',
      });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/events/:id/reject (Faculty coordinator rejects event)
router.patch(
  '/:id/reject',
  authenticate,
  authorize('faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rejected = await rejectEvent(req.params.id, req.user!.id);
      res.status(200).json({
        success: true,
        data: rejected,
        message: 'Event rejected.',
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/events/:id/register (Student registers for event)
router.post('/:id/register', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const registration = await registerForEvent(req.params.id, req.user!.id);
    res.status(201).json({
      success: true,
      data: registration,
      message: 'Successfully registered for event.',
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id/registrations (Registrations list)
router.get(
  '/:id/registrations',
  authenticate,
  authorize('club_lead', 'faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getEventRegistrations(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/events/:id/attendance (Club lead marks attendance)
router.patch(
  '/:id/attendance',
  authenticate,
  authorize('club_lead', 'faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { registrationIds } = req.body;
      if (!Array.isArray(registrationIds)) {
        res.status(400).json({
          success: false,
          error: 'registrationIds must be an array of IDs',
        });
        return;
      }

      const result = await markEventAttendance(req.params.id, req.user!.id, registrationIds);
      res.status(200).json({
        success: true,
        data: result,
        message: `Marked attendance for ${result.count} registrants.`,
      });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/events/:id/status (Club lead updates status)
router.patch(
  '/:id/status',
  authenticate,
  authorize('club_lead', 'faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      if (!status) {
        res.status(400).json({ success: false, error: 'Status is required' });
        return;
      }

      const updated = await updateEventStatus(req.params.id, req.user!.id, status);
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Event status updated successfully.',
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
