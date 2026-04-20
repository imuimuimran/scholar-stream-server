import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import {
  createReview,
  getReviewsByScholarship,
} from "../controllers/reviews.controller.js";

const router = express.Router();

router.post("/", verifyJWT, createReview);
router.get("/:id", getReviewsByScholarship);

export default router;

