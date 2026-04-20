import express from "express";

import verifyJWT from "../middlewares/verifyJWT.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyModerator from "../middlewares/verifyModerator.js";

import {
  createApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateStatus,
  updateFeedback,
  deleteApplication,
} from "../controllers/applications.controller.js";

const router = express.Router();

/* ================= STUDENT ================= */
router.post("/", verifyJWT, createApplication);
router.get("/my", verifyJWT, getMyApplications);
router.delete("/:id", verifyJWT, deleteApplication);

/* ================= MODERATOR / ADMIN ================= */
router.get("/", verifyJWT, verifyModerator, getAllApplications);
router.patch("/:id/status", verifyJWT, verifyModerator, updateStatus);
router.patch("/:id/feedback", verifyJWT, verifyModerator, updateFeedback);

/* ================= PRIVATE ================= */
router.get("/:id", verifyJWT, getApplicationById);

export default router;
