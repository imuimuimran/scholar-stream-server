const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
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

    userName: {
      type: String,
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
      index: true,
    },

    universityName: {
      type: String,
      required: true,
    },

    scholarshipCategory: {
      type: String,
      required: true,
    },

    degree: {
      type: String,
      required: true,
    },

    applicationFees: {
      type: Number,
      required: true,
    },

    serviceCharge: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    applicationStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "rejected"],
      default: "pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
      index: true,
    },

    stripePaymentIntentId: {
      type: String,
      default: "",
    },

    feedback: {
      type: String,
      default: "",
    },

    applicationDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* prevent duplicate application */
applicationSchema.index({ scholarshipId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
