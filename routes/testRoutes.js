import express from "express";
import {
  startTestInstance,
  submitTestResult,
  getTestStatusByBookingId,
  getTestInstancesByCenter,
  markTestAsComplete,
  submitTest,
  getVisualTest
  
} from "../controllers/testController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";
import { uploadVisualImage } from "../controllers/testController.js";



const router = express.Router();

router.post("/start", protect, authorize("TECHNICIAN",'ATS_ADMIN'), startTestInstance);
router.post("/submit", protect, authorize("TECHNICIAN"), submitTestResult);
router.get("/:bookingId/status", protect, getTestStatusByBookingId);
router.post('/completed', protect, authorize('TECHNICIAN'), markTestAsComplete);
router.post("/submitTest/:id",protect,authorize('TECHNICIAN','ATS_ADMIN'),submitTest);
router.get(
  "/center/all",
  protect,
  getTestInstancesByCenter
);
router.post("/tests/:id/upload-image", uploadVisualImage);
router.get("/getTest/:id",getVisualTest);

export default router;
