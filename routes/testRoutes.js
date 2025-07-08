import express from "express";
import {
  startTestInstance,
  submitTestResult,
  getTestStatusByBookingId,
  getTestInstancesByCenter,
  markTestAsComplete
  
} from "../controllers/testController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, authorize("TECHNICIAN"), startTestInstance);
router.post("/submit", protect, authorize("TECHNICIAN"), submitTestResult);
router.get("/:bookingId/status", protect, getTestStatusByBookingId);
router.post('/complete', protect, authorize('TECHNICIAN'), markTestAsComplete);

router.get(
  "/center/all",
  protect,
  authorize("ATS_ADMIN"),
  getTestInstancesByCenter
);

export default router;
