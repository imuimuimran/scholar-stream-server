const User = require("../models/User");


exports.getUsers = async (req, res) => {
  const { role } = req.query;

  const filter = role ? { role } : {};
  const users = await User.find(filter);

  res.json(users);
};


exports.updateRole = async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true }
  );

  res.json(updated);
};


exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
