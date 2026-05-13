import mongoose from "mongoose";

import Application from "../models/Application.js";

/* ================= CREATE APPLICATION ================= */

export const createApplication = async (req, res) => {
  try {
    const application = new Application({
      ...req.body,
      userId: req.user.id,
      userEmail: req.user.email,
    });

    await application.save();

    res.status(201).json(application);

  } catch (error) {
    if (err.code === 11000) {
      return res.status(400).json({
        message:
          "You already applied for this scholarship",
      });
    }

    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= GET APPLICATION BY ID ================= */

export const getApplicationById = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid application id",
      });
    }

    const application =
      await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    const isPrivileged =
      req.user.role === "Admin" ||
      req.user.role === "Moderator";

    if (
      !isPrivileged &&
      application.userEmail !== req.user.email
    ) {
      return res.status(403).json({
        message: "Forbidden access",
      });
    }

    res.json(application);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= GET MY APPLICATIONS ================= */

export const getMyApplications = async (
  req,
  res
) => {
  try {

    const applications =
      await Application.find({
        userEmail: req.user.email,
      }).sort({ createdAt: -1 });

    res.json(applications);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= GET ALL APPLICATIONS ================= */

export const getAllApplications = async (
  req,
  res
) => {
  try {

    const applications =
      await Application.find().sort({
        createdAt: -1,
      });

    res.json(applications);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


/* ================= GET MY PAYMENTS ================= */

export const getMyPayments = async (
  req,
  res
) => {
  try {

    const payments =
      await Application.find({
        userEmail: req.user.email,
        paymentStatus: "paid",
      }).sort({
        createdAt: -1,
      });

    res.json(payments);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


/* ================= UPDATE PAYMENT ================= */

export const updatePaymentStatus = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const { transactionId, paymentStatus } =
      req.body;

    const updated =
      await Application.findByIdAndUpdate(
        id,
        {
          transactionId,
          paymentStatus,
        },
        { new: true }
      );

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */

export const deleteApplication = async (
  req,
  res
) => {
  try {

    const deleted =
      await Application.findOneAndDelete({
        _id: req.params.id,
        userEmail: req.user.email,
      });

    if (!deleted) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json({
      message: "Deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= UPDATE STATUS ================= */

export const updateStatus = async (
  req,
  res
) => {
  try {

    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "completed",
      "rejected",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const updated =
      await Application.findByIdAndUpdate(
        req.params.id,
        { applicationStatus: status, },
        { new: true }
      );

    if (!updated) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json(updated);

  } catch (error) {

    console.error(
      "UPDATE STATUS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= UPDATE FEEDBACK ================= */

export const updateFeedback = async (
  req,
  res
) => {
  try {

    const { feedback } = req.body;

    const updated =
      await Application.findByIdAndUpdate(
        req.params.id,
        { feedback },
        { new: true }
      );

    if (!updated) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};