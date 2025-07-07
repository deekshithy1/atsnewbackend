import express from "express";
import {
  startTestInstance,
  submitTestResult,
  getTestStatusByBookingId,
  getTestInstancesByCenter,
} from "../controllers/testInstanceController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, authorize("TECHNICIAN"), startTestInstance);
router.post("/submit", protect, authorize("TECHNICIAN"), submitTestResult);
router.get("/:bookingId/status", protect, getTestStatusByBookingId);
router.get(
  "/center/all",
  protect,
  authorize("ATS_ADMIN"),
  getTestInstancesByCenter
);

export default router;
