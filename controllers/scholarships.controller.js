// const Scholarship = require("../models/Scholarship");

// /* ==============================
//    CREATE Scholarship (Admin)
// ============================== */
// exports.createScholarship = async (req, res) => {
//   try {
//     const scholarship = await Scholarship.create(req.body);
//     res.status(201).json(scholarship);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };


// /* ==============================
//    GET All Scholarships
//    search + filter + sort + pagination
// ============================== */
// exports.getScholarships = async (req, res) => {
//   try {
//     const {
//       search,
//       country,
//       category,
//       degree,
//       sort = "newest",
//       page = 1,
//       limit = 6,
//     } = req.query;

//     let query = {};

//     /* search */
//     if (search) {
//       query.$text = { $search: search };
//     }

//     /* filters */
//     if (country) query.universityCountry = country;
//     if (category) query.scholarshipCategory = category;
//     if (degree) query.degree = degree;

//     /* sort */
//     let sortOption = {};
//     if (sort === "lowFees") sortOption.applicationFees = 1;
//     else if (sort === "highFees") sortOption.applicationFees = -1;
//     else sortOption.scholarshipPostDate = -1;

//     const skip = (page - 1) * limit;

//     const scholarships = await Scholarship.find(query)
//       .sort(sortOption)
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Scholarship.countDocuments(query);

//     res.json({
//       total,
//       page: parseInt(page),
//       pages: Math.ceil(total / limit),
//       scholarships,
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// /* ==============================
//    GET Single
// ============================== */
// exports.getScholarshipById = async (req, res) => {
//   try {
//     const scholarship = await Scholarship.findById(req.params.id);
//     if (!scholarship) return res.status(404).json({ message: "Not found" });

//     res.json(scholarship);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// /* ==============================
//    UPDATE (Admin)
// ============================== */
// exports.updateScholarship = async (req, res) => {
//   try {
//     const updated = await Scholarship.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };


// /* ==============================
//    DELETE (Admin)
// ============================== */
// exports.deleteScholarship = async (req, res) => {
//   try {
//     await Scholarship.findByIdAndDelete(req.params.id);
//     res.json({ message: "Scholarship deleted" });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };



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
