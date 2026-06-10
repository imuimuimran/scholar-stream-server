import mongoose from "mongoose";
import Scholarship from "../models/Scholarship.js";

/* ======================================================
   GET ALL (search + filter + sort + pagination)
====================================================== */
export const getScholarships = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 8,
      search = "",
      country = "",
      category = "",
      sort = "",
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    /* ================= FILTER ================= */
    const filter = {};

    if (search) {
      filter.$or = [
        { scholarshipName: { $regex: search, $options: "i" } },
        { universityName: { $regex: search, $options: "i" } },
        { degree: { $regex: search, $options: "i" } },
      ];
    }

    if (country) {
      filter.universityCountry = country;
    }

    if (category) {
      filter.scholarshipCategory = category;
    }

    /* ================= SORT ================= */
    let sortOption = { createdAt: -1 };

    if (sort === "fees_asc") {
      sortOption = { applicationFees: 1 };
    }

    if (sort === "fees_desc") {
      sortOption = { applicationFees: -1 };
    }

    if (sort === "date_desc") {
      sortOption = { createdAt: -1 };
    }

    /* ================= QUERY ================= */
    const total = await Scholarship.countDocuments(filter);

    const data = await Scholarship.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    res.json({
      data,
      totalPages: Math.ceil(total / limitNumber),
      currentPage: pageNumber,
    });

  } catch (err) {
    console.error("GET SCHOLARSHIPS ERROR:", err);

    res.status(500).json({
      message: "Failed to fetch scholarships",
      error: err.message,
    });
  }
};

/* ======================================================
   GET SINGLE
====================================================== */
export const getScholarshipById = async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid scholarship id",
      });
    }

    const scholarship =
      await Scholarship.findById(id);

    if (!scholarship) {
      return res.status(404).json({
        message: "Scholarship not found",
      });
    }

    res.json(scholarship);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ======================================================
   CREATE (Admin)
====================================================== */
export const createScholarship = async (req, res) => {
  try {
    const scholarship = new Scholarship({
      ...req.body,
      postedUserEmail: req.user?.email, // from JWT middleware
    });

    const result = await scholarship.save();

    res.status(201).json(result);
  } catch (err) {
    console.error("CREATE SCHOLARSHIP ERROR:", err);

    res.status(500).json({
      message: "Failed to create scholarship",
      error: err.message,
    });
  }
};

/* ======================================================
   UPDATE (Admin)
====================================================== */
export const updateScholarship = async (req, res) => {
  try {

    const updated =
      await Scholarship.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updated) {
      return res.status(404).json({
        message: "Scholarship not found",
      });
    }

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ======================================================
   DELETE (Admin)
====================================================== */
export const deleteScholarship = async (req, res) => {
  try {

    const deleted =
      await Scholarship.findByIdAndDelete(
        req.params.id
      );

    if (!deleted) {
      return res.status(404).json({
        message: "Scholarship not found",
      });
    }

    res.json({
      message: "Scholarship deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};