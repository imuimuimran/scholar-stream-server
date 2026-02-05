const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    photoURL: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["Student", "Moderator", "Admin"],
      default: "Student",
      index: true,
    },

    // for analytics / fees
    totalPaid: {
      type: Number,
      default: 0,
    },

    // soft delete option
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// index for faster role filtering
userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);
