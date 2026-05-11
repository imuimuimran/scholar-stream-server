import User from "../models/User.js";
import Application from "../models/Application.js";

/* =============================
   DASHBOARD STATS
============================= */
export const getDashboardStats = async (req, res) => {
  try {

    const totalUsers =
      await User.countDocuments();

    const totalApplications =
      await Application.countDocuments();

    const revenueResult =
      await Application.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult[0]?.totalRevenue || 0;

    res.json({
      totalUsers,
      totalApplications,
      totalRevenue,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =============================
   APPLICATIONS BY CATEGORY
============================= */
export const getApplicationsByCategory = async (req, res) => {
  try {

    const data = await Application.aggregate([
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
      {
        $sort: { count: -1 },
      },
    ]);

    res.json(data);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =============================
   APPLICATIONS BY UNIVERSITY
============================= */
export const getApplicationsByUniversity = async (req, res) => {
  try {

    const data = await Application.aggregate([
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
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.json(data);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =============================
   APPLICATION STATUS STATS
============================= */
export const getApplicationStatusStats = async (req, res) => {
  try {

    const data = await Application.aggregate([
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
    ]);

    res.json(data);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =============================
   REVENUE OVER TIME
============================= */
export const getRevenueOverTime = async (req, res) => {
  try {

    const data = await Application.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: {
            $sum: "$totalAmount",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const formatted = data.map((item) => ({
      month: `${item._id.year}-${item._id.month}`,
      revenue: item.revenue,
    }));

    res.json(formatted);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};