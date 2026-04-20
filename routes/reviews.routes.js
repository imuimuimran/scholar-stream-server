import express from "express";

import {
  createReview,
  getReviewsByScholarship,
  getMyReviews,
  getAllReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviews.controller.js";

import verifyJWT from "../middlewares/verifyJWT.js";
import verifyModerator from "../middlewares/verifyModerator.js";

const router = express.Router();

/* PUBLIC */
router.get("/scholarship/:id", getReviewsByScholarship);

/* STUDENT */
router.post("/", verifyJWT, createReview);
router.get("/me", verifyJWT, getMyReviews);
router.patch("/:id", verifyJWT, updateReview);

/* MODERATOR / ADMIN */
router.get("/", verifyJWT, verifyModerator, getAllReviews);

/* DELETE (owner or moderator) */
router.delete("/:id", verifyJWT, deleteReview);

export default router;

