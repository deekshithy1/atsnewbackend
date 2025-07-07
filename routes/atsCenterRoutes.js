import express from "express";
import {
  getAllCenters,
  createCenter,
  getCenterByCode,
} from "../controllers/atsCenterController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("SUPER_ADMIN"), getAllCenters);
router.post("/", protect, authorize("SUPER_ADMIN"), createCenter);

router.get(
  "/code/:code",
  protect,
  authorize("ATS_ADMIN", "SUPER_ADMIN"),
  getCenterByCode
);

export default router;
