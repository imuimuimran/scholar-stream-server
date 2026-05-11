import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized Access",
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.JWT_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({
            message: "Forbidden Access",
          });
        }

        /* ================= FETCH FRESH USER ================= */

        const user = await User.findById(decoded.id);

        if (!user) {
          return res.status(401).json({
            message: "User not found",
          });
        }

        if (user.isBlocked) {
          return res.status(403).json({
            message: "Account blocked",
          });
        }

        /* ================= ATTACH FRESH USER ================= */

        req.user = {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
        };

        next();
      }
    );
  } catch (error) {
    console.error("VERIFY JWT ERROR:", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default verifyJWT;