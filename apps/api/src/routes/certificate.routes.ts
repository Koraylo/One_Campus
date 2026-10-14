import { Router, Request, Response, NextFunction } from 'express';
import {
  proposeCertificate,
  getPendingCertificatesForFaculty,
  approveCertificate,
  distributeCertificate,
  getStudentCertificates,
  getClubCertificates,
} from '../services/certificate.service';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// POST /api/certificates/propose (Club lead proposes certificate)
router.post(
  '/propose',
  authenticate,
  authorize('club_lead', 'faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentId, eventId, title } = req.body;
      if (!studentId || !eventId || !title) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: studentId, eventId, title',
        });
        return;
      }

      const cert = await proposeCertificate(req.user!.id, {
        studentId,
        eventId,
        title,
      });

      res.status(201).json({
        success: true,
        data: cert,
        message: 'Certificate proposed and awaiting faculty approval.',
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/certificates/pending (Faculty coordinator views pending certificates)
router.get(
  '/pending',
  authenticate,
  authorize('faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pending = await getPendingCertificatesForFaculty(req.user!.id);
      res.status(200).json({ success: true, data: pending });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/certificates/:id/approve (Faculty coordinator approves certificate)
router.patch(
  '/:id/approve',
  authenticate,
  authorize('faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const approved = await approveCertificate(req.params.id, req.user!.id);
      res.status(200).json({
        success: true,
        data: approved,
        message: 'Certificate approved successfully.',
      });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/certificates/:id/distribute (Club lead distributes certificate)
router.patch(
  '/:id/distribute',
  authenticate,
  authorize('club_lead', 'faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const distributed = await distributeCertificate(req.params.id, req.user!.id);
      res.status(200).json({
        success: true,
        data: distributed,
        message: 'Certificate distributed to student.',
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/certificates/my (Student's certificates)
router.get('/my', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certs = await getStudentCertificates(req.user!.id);
    res.status(200).json({ success: true, data: certs });
  } catch (err) {
    next(err);
  }
});

// GET /api/certificates/club (Club lead's certificates)
router.get(
  '/club',
  authenticate,
  authorize('club_lead', 'faculty', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const certs = await getClubCertificates(req.user!.id);
      res.status(200).json({ success: true, data: certs });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
