const router = require("express").Router();
const ctrl = require("../controllers/review.controller");
const verifyJWT = require("../middlewares/verifyJWT");

router.post("/", verifyJWT, ctrl.createReview);
router.get("/scholarship/:id", ctrl.getReviewsByScholarship);

router.patch("/:id", verifyJWT, ctrl.updateReview);
router.delete("/:id", verifyJWT, ctrl.deleteReview);

module.exports = router;
