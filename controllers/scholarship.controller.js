const Scholarship = require("../models/Scholarship");

/* ==============================
   CREATE Scholarship (Admin)
============================== */
exports.createScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.create(req.body);
    res.status(201).json(scholarship);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ==============================
   GET All Scholarships
   search + filter + sort + pagination
============================== */
exports.getScholarships = async (req, res) => {
  try {
    const {
      search,
      country,
      category,
      degree,
      sort = "newest",
      page = 1,
      limit = 6,
    } = req.query;

    let query = {};

    /* search */
    if (search) {
      query.$text = { $search: search };
    }

    /* filters */
    if (country) query.universityCountry = country;
    if (category) query.scholarshipCategory = category;
    if (degree) query.degree = degree;

    /* sort */
    let sortOption = {};
    if (sort === "lowFees") sortOption.applicationFees = 1;
    else if (sort === "highFees") sortOption.applicationFees = -1;
    else sortOption.scholarshipPostDate = -1;

    const skip = (page - 1) * limit;

    const scholarships = await Scholarship.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Scholarship.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      scholarships,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ==============================
   GET Single
============================== */
exports.getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ message: "Not found" });

    res.json(scholarship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ==============================
   UPDATE (Admin)
============================== */
exports.updateScholarship = async (req, res) => {
  try {
    const updated = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* ==============================
   DELETE (Admin)
============================== */
exports.deleteScholarship = async (req, res) => {
  try {
    await Scholarship.findByIdAndDelete(req.params.id);
    res.json({ message: "Scholarship deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
