import User from "../models/User.js";
import Application from "../models/Application.js";

/* =============================
   SUMMARY (KPI CARDS)
============================= */
export const getDashboardStats = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();
    const totalApplications = await Application.countDocuments();

    const revenueResult = await Application.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$applicationFees",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult[0]?.totalRevenue || 0;

    res.status(200).json({
      totalUsers,
      totalApplications,
      totalRevenue,
    });

  } catch (error) {

    console.error(
      "Dashboard Stats Error:",
      error
    );

    res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
};

/* =============================
   APPLICATIONS BY CATEGORY
============================= */
export const getApplicationsByCategory = async (req, res) => {
  try {
    const db = req.db;

    if (!db) {
      return res.status(500).json({
        message: "Database not connected",
      });
    }

    const data = await db.collection("applications")
      .aggregate([
        {
          $group: {
            _id: "$scholarshipCategory", 
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
        { $sort: { count: -1 } },
      ])
      .toArray();

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =============================
   TOP UNIVERSITIES
============================= */
export const getApplicationsByUniversity = async (req, res) => {
  try {
    const db = req.db;

    if (!db) {
      return res.status(500).json({
        message: "Database not connected",
      });
    }

    const data = await db.collection("applications")
      .aggregate([
        {
          $group: {
            _id: "$universityName",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            university: "$_id",
            count: 1,
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ])
      .toArray();

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =============================
   APPLICATION STATUS
============================= */
export const getApplicationStatusStats = async (req, res) => {
  try {
    const db = req.db;

    if (!db) {
      return res.status(500).json({
        message: "Database not connected",
      });
    }

    const data = await db.collection("applications")
      .aggregate([
        {
          $group: {
            _id: "$applicationStatus",
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
   REVENUE OVER TIME
============================= */
export const getRevenueOverTime = async (req, res) => {
  try {
    const db = req.db;

    if (!db) {
      return res.status(500).json({
        message: "Database not connected",
      });
    }

    const data = await db.collection("applications")
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
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ])
      .toArray();

    const formatted = data.map(item => ({
      month: `${item._id.year}-${item._id.month}`,
      revenue: item.revenue,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};