import { ObjectId } from "mongodb";

/* CREATE */
export const createApplication = async (req, res) => {
  try {
    const db = req.db.collection("applications");

    const application = {
      ...req.body,
      userEmail: req.user.email,
      paymentStatus: req.body.paymentStatus || "paid",
      status: "pending",
      feedback: "",
      createdAt: new Date(),
    };

    const result = await db.insertOne(application);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL (Admin/Moderator) */
export const getAllApplications = async (req, res) => {
  try {
    const db = req.db.collection("applications");

    const apps = await db.find().toArray();

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET BY ID */
export const getApplicationById = async (req, res) => {
  try {
    const db = req.db.collection("applications");

    const app = await db.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!app) return res.status(404).json({ message: "Not found" });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET MY APPLICATIONS */
export const getMyApplications = async (req, res) => {
  try {
    const db = req.db.collection("applications");

    const apps = await db
      .find({ userEmail: req.user.email })
      .toArray();

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE STATUS */
export const updateStatus = async (req, res) => {
  try {
    const db = req.db.collection("applications");

    const { status } = req.body;

    await db.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status } }
    );

    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE FEEDBACK */
export const updateFeedback = async (req, res) => {
  try {
    const db = req.db.collection("applications");

    const { feedback } = req.body;

    await db.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { feedback } }
    );

    res.json({ message: "Feedback added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE */
export const deleteApplication = async (req, res) => {
  try {
    const db = req.db.collection("applications");

    const app = await db.findOne({
      _id: new ObjectId(req.params.id),
      userEmail: req.user.email,
    });

    if (!app) {
      return res.status(404).json({ message: "Not found" });
    }

    if (app.status !== "pending") {
      return res.status(400).json({
        message: "Cannot delete processed application",
      });
    }

    await db.deleteOne({ _id: app._id });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};