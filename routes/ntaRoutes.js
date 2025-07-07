import express from 'express';
import {
  getVehiclesReadyForApproval,
  sendToNTA,
  getNTALogStatus
} from '../controllers/ntaController.js';

import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/ready', protect, authorize('ATS_ADMIN'), getVehiclesReadyForApproval);
router.post('/send', protect, authorize('ATS_ADMIN'), sendToNTA);
router.get('/log/:bookingId', protect, authorize('ATS_ADMIN'), getNTALogStatus);

export default router;