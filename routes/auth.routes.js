const router = require("express").Router();
const { firebaseLogin } = require("../controllers/auth.controller");

router.post("/firebase", firebaseLogin);

module.exports = router;
