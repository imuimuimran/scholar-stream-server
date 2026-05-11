import User from "../models/User.js";

const verifyModerator = async (req, res, next) => {
  try {
    const email = req.user.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      user.role !== "Moderator" &&
      user.role !== "Admin"
    ) {
      return res.status(403).json({
        message: "Moderator only access",
      });
    }

    req.user.role = user.role;

    next();

  } catch (error) {
    console.error(
      "VERIFY MODERATOR ERROR:",
      error.message
    );

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default verifyModerator;