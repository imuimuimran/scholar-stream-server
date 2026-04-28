/* ===================================================
   ADMIN ANALYTICS CONTROLLER
   - KPI stats
   - Charts (category, university)
=================================================== */

/* =============================
   GET ANALYTICS SUMMARY
============================= */

import User from "../models/User.js";
import Application from "../models/Application.js";

export const getAnalyticsSummary = async (req, res) => {
  try {
    // total users
    const totalUsers = await User.countDocuments();

    // total applications
    const totalApplications = await Application.countDocuments();

    // total revenue (sum of totalAmount where paymentStatus = paid)
    const revenueResult = await Application.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({
      totalUsers,
      totalApplications,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};

/* =============================
   GET DASHBOARD SUMMARY
============================= */
export const getDashboardStats = async (req, res) => {
  try {
    const usersCol = req.db.collection("users");
    const appsCol = req.db.collection("applications");
    const scholarshipsCol = req.db.collection("scholarships");

    const totalUsers = await usersCol.countDocuments();
    const totalApplications = await appsCol.countDocuments();

    /* Total Revenue (only paid) */
    const revenueAgg = await appsCol
      .aggregate([
        { $match: { paymentStatus: "paid" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$applicationFees" },
          },
        },
      ])
      .toArray();

    const totalRevenue = revenueAgg[0]?.total || 0;

    const totalScholarships = await scholarshipsCol.countDocuments();

    res.json({
      totalUsers,
      totalApplications,
      totalRevenue,
      totalScholarships,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =============================
   APPLICATIONS BY CATEGORY (Pie Chart)
============================= */
export const getApplicationsByCategory = async (req, res) => {
  try {
    const appsCol = req.db.collection("applications");

    const data = await appsCol
      .aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            count: 1,
          },
        },
      ])
      .toArray();

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =============================
   APPLICATIONS BY UNIVERSITY (Bar Chart)
============================= */
export const getApplicationsByUniversity = async (req, res) => {
  try {
    const appsCol = req.db.collection("applications");

    const data = await appsCol
      .aggregate([
        {
          $group: {
            _id: "$universityName",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 }, // top 10
        {
          $project: {
            _id: 0,
            university: "$_id",
            count: 1,
          },
        },
      ])
      .toArray();

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =============================
   APPLICATION STATUS DISTRIBUTION
============================= */
export const getApplicationStatusStats = async (req, res) => {
  try {
    const appsCol = req.db.collection("applications");

    const data = await appsCol
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            status: "$_id",
            count: 1,
          },
        },
      ])
      .toArray();

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =============================
   REVENUE OVER TIME (Line Chart)
============================= */
export const getRevenueOverTime = async (req, res) => {
  try {
    const appsCol = req.db.collection("applications");

    const data = await appsCol
      .aggregate([
        { $match: { paymentStatus: "paid" } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$applicationFees" },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            revenue: 1,
          },
        },
      ])
      .toArray();

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};