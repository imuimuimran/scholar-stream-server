/* ===================================================
   ANALYTICS CONTROLLER (CLEAN VERSION)
=================================================== */

/* =============================
   SUMMARY (KPI CARDS)
============================= */
export const getDashboardStats = async (req, res) => {
  try {
    const db = req.db;

    const totalUsers = await db.collection("users").countDocuments();
    const totalApplications = await db.collection("applications").countDocuments();

    const revenueAgg = await db.collection("applications")
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

    res.json({
      totalUsers,
      totalApplications,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =============================
   APPLICATIONS BY CATEGORY
============================= */
export const getApplicationsByCategory = async (req, res) => {
  try {
    const db = req.db;

    const data = await db.collection("applications")
      .aggregate([
        {
          $group: {
            _id: "$scholarshipCategory", // ✅ IMPORTANT FIX
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

    const data = await db.collection("applications")
      .aggregate([
        {
          $group: {
            _id: "$applicationStatus", // ✅ FIXED FIELD NAME
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