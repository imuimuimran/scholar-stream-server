import express from "express";
import * as ctrl from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.get("/", verifyJWT, verifyAdmin, ctrl.getUsers);
router.patch("/:id/role", verifyJWT, verifyAdmin, ctrl.updateRole);
router.delete("/:id", verifyJWT, verifyAdmin, ctrl.deleteUser);

export default router; 
