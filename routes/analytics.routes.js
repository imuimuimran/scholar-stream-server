import express from "express";
import {
  getAnalyticsSummary,
  getDashboardStats,
  getApplicationsByCategory,
  getApplicationsByUniversity,
  getApplicationStatusStats,
  getRevenueOverTime,
} from "../controllers/analytics.controller.js";

import verifyJWT from "../middlewares/verifyJWT.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

/* ADMIN ONLY */
router.get("/stats", verifyJWT, verifyAdmin, getDashboardStats);

router.get(
  "/summary", 
  verifyJWT, 
  verifyAdmin, 
  getAnalyticsSummary
);

router.get(
  "/applications/category",
  verifyJWT,
  verifyAdmin,
  getApplicationsByCategory
);

router.get(
  "/applications/university",
  verifyJWT,
  verifyAdmin,
  getApplicationsByUniversity
);

router.get(
  "/applications/status",
  verifyJWT,
  verifyAdmin,
  getApplicationStatusStats
);

router.get(
  "/revenue",
  verifyJWT,
  verifyAdmin,
  getRevenueOverTime
);

export default router;