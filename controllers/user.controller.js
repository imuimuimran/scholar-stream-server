import User from "../models/User.js";

/* ================= GET USERS ================= */
export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;

    const filter = role ? { role } : {};
    const users = await User.find(filter);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ROLE ================= */
export const updateRole = async (req, res) => {
  try {

    const { role } = req.body;

    if (
      !["Student", "Moderator", "Admin"]
        .includes(role)
    ) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    if (req.user.id === req.params.id) {
      return res.status(400).json({
        message:
          "You cannot change your own role",
      });
    }

    const updated =
      await User.findByIdAndUpdate(
        req.params.id,
        { role },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updated) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(updated);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ================= DELETE USER ================= */
export const deleteUser = async (req, res) => {
  try {

    if (req.user.id === req.params.id) {
      return res.status(400).json({
        message:
          "You cannot delete your own account",
      });
    }

    const user =
      await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "Admin") {
      return res.status(403).json({
        message: "Cannot delete admin",
      });
    }

    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "User deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};