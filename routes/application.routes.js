const router = require("express").Router();
const ctrl = require("../controllers/application.controller");
const verifyJWT = require("../middlewares/verifyJWT");
const verifyModerator = require("../middlewares/verifyModerator");

router.post("/", verifyJWT, ctrl.createApplication);
router.get("/my", verifyJWT, ctrl.getMyApplications);

router.get("/", verifyJWT, verifyModerator, ctrl.getAllApplications);
router.patch("/:id", verifyJWT, verifyModerator, ctrl.updateStatus);

router.delete("/:id", verifyJWT, ctrl.deleteApplication);

module.exports = router;
