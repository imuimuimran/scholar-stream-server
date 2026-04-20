import { ObjectId } from "mongodb";

/* ======================================================
   GET ALL (search + filter + sort + pagination)
====================================================== */
export const getScholarships = async (req, res) => {
  try {
    const db = req.db.collection("scholarships");

    /* query params */
    const {
      page = 1,
      limit = 6,
      search = "",
      country,
      category,
      sort,
    } = req.query;

    const skip = (page - 1) * limit;

    /* ================= FILTER ================= */
    const filter = {};

    /* search */
    if (search) {
      filter.$or = [
        { scholarshipName: { $regex: search, $options: "i" } },
        { universityName: { $regex: search, $options: "i" } },
        { degree: { $regex: search, $options: "i" } },
      ];
    }

    if (country) filter.country = country;
    if (category) filter.category = category;

    /* ================= SORT ================= */
    let sortOption = { createdAt: -1 };

    if (sort === "fees_asc") sortOption = { applicationFees: 1 };
    if (sort === "fees_desc") sortOption = { applicationFees: -1 };
    if (sort === "date_desc") sortOption = { createdAt: -1 };

    /* ================= DB QUERY ================= */
    const total = await db.countDocuments(filter);

    const data = await db
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    res.json({
      data,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   GET SINGLE
====================================================== */
export const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await req.db
      .collection("scholarships")
      .findOne({ _id: new ObjectId(req.params.id) });

    res.json(scholarship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   CREATE (Admin)
====================================================== */
export const createScholarship = async (req, res) => {
  try {
    const scholarship = {
      ...req.body,
      createdAt: new Date(),
    };

    const result = await req.db
      .collection("scholarships")
      .insertOne(scholarship);

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   UPDATE (Admin)
====================================================== */
export const updateScholarship = async (req, res) => {
  try {
    const result = await req.db.collection("scholarships").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   DELETE (Admin)
====================================================== */
export const deleteScholarship = async (req, res) => {
  try {
    const result = await req.db
      .collection("scholarships")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
