import mongoose from "mongoose";
import Review from "../models/Review.js";
import User from "../models/User.js";
import Scholarship from "../models/Scholarship.js";

/* ===================================================
   CREATE REVIEW
=================================================== */
export const createReview = async (req, res) => {
  try {

    const {
      scholarshipId,
      rating,
      comment,
    } = req.body;

    if (!scholarshipId || !rating || !comment) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const scholarship = await Scholarship.findById(
      scholarshipId
    );

    if (!scholarship) {
      return res.status(404).json({
        message: "Scholarship not found",
      });
    }

    const user = await User.findOne({
      email: req.user.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existing = await Review.findOne({
      scholarshipId,
      userId: user._id,
    });

    if (existing) {
      return res.status(400).json({
        message: "You already reviewed this scholarship",
      });
    }

    const review = await Review.create({
      scholarshipId,
      userId: user._id,

      scholarshipName:
        scholarship.scholarshipName,

      universityName:
        scholarship.universityName,

      reviewerName: user.name,
      userEmail: user.email,
      photoURL: user.photoURL,

      rating: Number(rating),
      comment,
    });

    res.status(201).json(review);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
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