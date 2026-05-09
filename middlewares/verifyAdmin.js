import User from "../models/User.js";

const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.user.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "Admin") {
      return res.status(403).json({
        message: "Admin only access",
      });
    }

    next();
  } catch (error) {
    console.error("VERIFY ADMIN ERROR:", error.message);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default verifyAdmin;