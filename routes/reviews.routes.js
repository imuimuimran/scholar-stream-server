import express from "express";

import verifyJWT from "../middlewares/verifyJWT.js";
import verifyModerator from "../middlewares/verifyModerator.js";

import {
  createReview,
  getReviewsByScholarship,
  getMyReviews,
  getAllReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviews.controller.js";

const router = express.Router();

/* ================= PUBLIC ================= */

/*
GET /api/reviews?scholarshipId=xxx
*/
router.get("/", getAllReviews);

router.get(
  "/scholarship/:id",
  getReviewsByScholarship
);

/* ================= STUDENT ================= */

router.post("/", verifyJWT, createReview);

router.get("/my", verifyJWT, getMyReviews);

router.patch("/:id", verifyJWT, updateReview);

router.delete("/:id", verifyJWT, deleteReview);

/* ================= MODERATOR ================= */

router.get(
  "/all",
  verifyJWT,
  verifyModerator,
  getAllReviews
);

export default router;