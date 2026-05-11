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
  getMyPayments,
  updatePaymentStatus,
} from "../controllers/applications.controller.js"; 

const router = express.Router();

/* ================= STUDENT ================= */
router.post("/", verifyJWT, createApplication);
router.get("/my", verifyJWT, getMyApplications);
router.get("/my-payments", verifyJWT, getMyPayments);
router.patch("/payment/:id", verifyJWT, updatePaymentStatus);
router.delete("/:id", verifyJWT, deleteApplication);

router.get("/:id", verifyJWT, getApplicationById);
/* ================= MODERATOR / ADMIN ================= */
router.get("/", verifyJWT, verifyModerator, getAllApplications);
router.patch("/:id/status", verifyJWT, verifyModerator, updateStatus);
router.patch("/:id/feedback", verifyJWT, verifyModerator, updateFeedback);


export default router;
