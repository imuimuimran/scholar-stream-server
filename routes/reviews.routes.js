// import express from "express";
// import { verifyJWT } from "../middlewares/verifyJWT.js";

// const router = require("express").Router();
// const ctrl = require("../controllers/review.controller");
// const verifyJWT = require("../middlewares/verifyJWT");

// router.post("/", verifyJWT, ctrl.createReview);
// router.get("/scholarship/:id", ctrl.getReviewsByScholarship);

// router.patch("/:id", verifyJWT, ctrl.updateReview);
// router.delete("/:id", verifyJWT, ctrl.deleteReview);


// /* =============================
//    POST → create review
// ============================= */
// router.post("/", verifyJWT, async (req, res) => {
//   try {
//     const review = req.body;

//     const result = await req.db.collection("reviews").insertOne(review);

//     res.status(201).json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// /* =============================
//    GET → reviews by scholarship
// ============================= */
// router.get("/:id", async (req, res) => {
//   try {
//     const reviews = await req.db
//       .collection("reviews")
//       .find({ scholarshipId: req.params.id })
//       .toArray();

//     res.json(reviews);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;


// module.exports = router;



import express from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import {
  createReview,
  getReviewsByScholarship,
} from "../controllers/reviews.controller.js";

const router = express.Router();

router.post("/", verifyJWT, createReview);
router.get("/:id", getReviewsByScholarship);

export default router;

