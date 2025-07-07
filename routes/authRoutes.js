import express from "express";
import { loginUser, getLoggedInUser } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/me", protect, getLoggedInUser);

export default router;
