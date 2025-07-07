import express from 'express';
import {
  getVehiclesReadyForApproval,
  sendToNIC,
  getNICLogStatus
} from '../controllers/nicController.js';

import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/ready', protect, authorize('ATS_ADMIN'), getVehiclesReadyForApproval);
router.post('/send', protect, authorize('ATS_ADMIN'), sendToNIC);
router.get('/log/:bookingId', protect, authorize('ATS_ADMIN'), getNICLogStatus);

export default router;