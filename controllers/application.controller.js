const Application = require("../models/Application");


/* Student apply */
exports.createApplication = async (req, res) => {
  try {
    const app = await Application.create(req.body);
    res.status(201).json(app);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


/* My applications (student) */
exports.getMyApplications = async (req, res) => {
  const apps = await Application.find({ userEmail: req.user.email });
  res.json(apps);
};


/* Moderator view all */
exports.getAllApplications = async (req, res) => {
  const apps = await Application.find().populate("scholarshipId userId");
  res.json(apps);
};


/* update status */
exports.updateStatus = async (req, res) => {
  const updated = await Application.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};


/* delete */
exports.deleteApplication = async (req, res) => {
  await Application.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
