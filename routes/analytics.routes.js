import express from "express";

import {
  getDashboardStats,
  getApplicationsByCategory,
  getApplicationsByUniversity,
  getApplicationStatusStats,
  getRevenueOverTime,
} from "../controllers/analytics.controller.js";

import verifyJWT from "../middlewares/verifyJWT.js";
import verifyRole from "../middlewares/verifyRole.js";

const router = express.Router();

/* =========================
   ADMIN ONLY
========================= */

router.get(
  "/summary",
  verifyJWT,
  verifyRole("Admin"),
  getDashboardStats
);

router.get(
  "/university",
  verifyJWT,
  verifyRole("Admin"),
  getApplicationsByUniversity
);

router.get(
  "/revenue",
  verifyJWT,
  verifyRole("Admin"),
  getRevenueOverTime
);

/* =========================
   ADMIN + MODERATOR
========================= */

router.get(
  "/category",
  verifyJWT,
  verifyRole("Admin", "Moderator"),
  getApplicationsByCategory
);

router.get(
  "/status",
  verifyJWT,
  verifyRole("Admin", "Moderator"),
  getApplicationStatusStats
);

export default router;