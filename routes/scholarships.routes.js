// const router = require("express").Router();
// const ctrl = require("../controllers/scholarship.controller");
// const verifyAdmin = require("../middlewares/verifyAdmin");
// const verifyJWT = require("../middlewares/verifyJWT");

// router.get("/", ctrl.getScholarships);
// router.get("/:id", ctrl.getScholarshipById);

// router.post("/", verifyJWT, verifyAdmin, ctrl.createScholarship);
// router.patch("/:id", verifyJWT, verifyAdmin, ctrl.updateScholarship);
// router.delete("/:id", verifyJWT, verifyAdmin, ctrl.deleteScholarship);

// module.exports = router;


import express from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

import {
  getScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
} from "../controllers/scholarships.controller.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getScholarships);
router.get("/:id", getScholarshipById);

/* ADMIN */
router.post("/", verifyJWT, verifyAdmin, createScholarship);
router.put("/:id", verifyJWT, verifyAdmin, updateScholarship);
router.delete("/:id", verifyJWT, verifyAdmin, deleteScholarship);

export default router;
