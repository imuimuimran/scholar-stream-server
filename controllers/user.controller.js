// import User from "../models/User.js";

// export const getUsers = async (req, res) => {
//   const { role } = req.query;

//   const filter = role ? { role } : {};
//   const users = await User.find(filter);

//   res.json(users);
// };

// export const updateRole = async (req, res) => {
//   const updated = await User.findByIdAndUpdate(
//     req.params.id,
//     { role: req.body.role },
//     { new: true }
//   );

//   res.json(updated);
// };

// export const deleteUser = async (req, res) => {
//   await User.findByIdAndDelete(req.params.id);
//   res.json({ message: "Deleted" });
// };


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

    if (!["Student", "Moderator", "Admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE USER ================= */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "Admin") {
      return res.status(403).json({ message: "Cannot delete admin" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};