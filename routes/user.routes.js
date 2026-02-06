const router = require("express").Router();
const ctrl = require("../controllers/user.controller");
const verifyJWT = require("../middlewares/verifyJWT");
const verifyAdmin = require("../middlewares/verifyAdmin");

router.get("/", verifyJWT, verifyAdmin, ctrl.getUsers);
router.patch("/:id/role", verifyJWT, verifyAdmin, ctrl.updateRole);
router.delete("/:id", verifyJWT, verifyAdmin, ctrl.deleteUser);

module.exports = router;
