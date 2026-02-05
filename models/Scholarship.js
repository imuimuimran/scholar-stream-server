const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    scholarshipName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    universityName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    universityImage: {
      type: String,
      required: true,
    },

    universityCountry: {
      type: String,
      required: true,
      index: true,
    },

    universityCity: {
      type: String,
      required: true,
    },

    universityWorldRank: {
      type: Number,
      required: true,
    },

    subjectCategory: {
      type: String,
      required: true,
      index: true,
    },

    scholarshipCategory: {
      type: String,
      enum: ["Full fund", "Partial", "Self-fund"],
      required: true,
      index: true,
    },

    degree: {
      type: String,
      enum: ["Diploma", "Bachelor", "Masters"],
      required: true,
      index: true,
    },

    tuitionFees: {
      type: Number,
      default: 0,
    },

    applicationFees: {
      type: Number,
      required: true,
      default: 0,
      index: true,
    },

    serviceCharge: {
      type: Number,
      required: true,
      default: 0,
    },

    applicationDeadline: {
      type: Date,
      required: true,
      index: true,
    },

    scholarshipPostDate: {
      type: Date,
      default: Date.now,
      index: true,
    },

    postedUserEmail: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    stipendDetails: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

/* ===== Indexes for Search & Sort ===== */
scholarshipSchema.index({ scholarshipName: "text", universityName: "text" });
scholarshipSchema.index({ applicationFees: 1 });
scholarshipSchema.index({ scholarshipPostDate: -1 });

module.exports = mongoose.model("Scholarship", scholarshipSchema);
