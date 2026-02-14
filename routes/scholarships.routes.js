const router = require("express").Router();
const ctrl = require("../controllers/scholarship.controller");
const verifyAdmin = require("../middlewares/verifyAdmin");
const verifyJWT = require("../middlewares/verifyJWT");

router.get("/", ctrl.getScholarships);
router.get("/:id", ctrl.getScholarshipById);

router.post("/", verifyJWT, verifyAdmin, ctrl.createScholarship);
router.patch("/:id", verifyJWT, verifyAdmin, ctrl.updateScholarship);
router.delete("/:id", verifyJWT, verifyAdmin, ctrl.deleteScholarship);

module.exports = router;
