import mongoose from "mongoose";
import Review from "../models/Review.js";

/* ===================================================
   CREATE REVIEW
=================================================== */
export const createReview = async (req, res) => {
  try {
    const {
      scholarshipId,
      rating,
      comment,
      reviewerName,
      reviewerEmail,
      reviewerImage,
      universityName,
    } = req.body;

    if (!scholarshipId || !rating || !comment) {
      return res.status(400).json({
        message: "ScholarshipId, rating and comment are required",
      });
    }

    const existing = await Review.findOne({
      scholarshipId,
      userEmail: req.user.email,
    });

    if (existing) {
      return res.status(400).json({
        message: "You already reviewed this scholarship",
      });
    }

    const review = new Review({
      scholarshipId,
      userId: req.user.id,
      universityName,
      rating,
      comment,
      reviewerName,
      reviewerEmail,
      reviewerImage,
      userEmail: req.user.email,
    });

    await review.save();

    res.status(201).json(review);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===================================================
   GET REVIEWS BY SCHOLARSHIP
=================================================== */
export const getReviewsByScholarship = async (req, res) => {
  try {

    const reviews = await Review.find({
      scholarshipId: req.params.id,
    }).sort({ createdAt: -1 });

    res.json(reviews);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===================================================
   GET MY REVIEWS
=================================================== */
export const getMyReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      userEmail: req.user.email,
    }).sort({ createdAt: -1 });

    res.json(reviews);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===================================================
   GET ALL REVIEWS
=================================================== */
export const getAllReviews = async (req, res) => {
  try {

    const reviews = await Review.find()
      .sort({ createdAt: -1 });

    res.json(reviews);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===================================================
   UPDATE REVIEW
=================================================== */
export const updateReview = async (req, res) => {
  try {

    const { rating, comment } = req.body;

    const review = await Review.findOne({
      _id: req.params.id,
      userEmail: req.user.email,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.json(review);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===================================================
   DELETE REVIEW
=================================================== */
export const deleteReview = async (req, res) => {
  try {

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    const isPrivileged =
      req.user.role === "Admin" ||
      req.user.role === "Moderator";

    if (
      !isPrivileged &&
      review.userEmail !== req.user.email
    ) {
      return res.status(403).json({
        message: "Forbidden access",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      message: "Review deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};