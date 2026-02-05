const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    scholarshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scholarship",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    universityName: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
    },

    userImage: {
      type: String,
      default: "",
    },

    ratingPoint: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    reviewComment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    reviewDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* one review per student per scholarship */
reviewSchema.index({ scholarshipId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
