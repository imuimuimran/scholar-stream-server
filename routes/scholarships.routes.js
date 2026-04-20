import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

import {
  getScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
} from "../controllers/scholarships.controller.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getScholarships);
router.get("/:id", getScholarshipById);

/* ADMIN */
router.post("/", verifyJWT, verifyAdmin, createScholarship);
router.put("/:id", verifyJWT, verifyAdmin, updateScholarship);
router.delete("/:id", verifyJWT, verifyAdmin, deleteScholarship);

export default router;