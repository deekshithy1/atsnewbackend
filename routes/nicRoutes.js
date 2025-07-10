import express from 'express';
import {
  getVehiclesReadyForApproval,
  sendToNIC,
  getNICLogStatus,getAllVehicles
} from '../controllers/nicController.js';

import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/ready', protect, authorize('ATS_ADMIN'), getVehiclesReadyForApproval);
router.post('/send', protect, authorize('ATS_ADMIN'), sendToNIC);
router.get('/log/:bookingId', protect, authorize('ATS_ADMIN'), getNICLogStatus);
router.get('/logs/allvehicles',protect,authorize('ATS_ADMIN'),getAllVehicles);

export default router;