import { ObjectId } from "mongodb";

/* ===================================================
   CREATE REVIEW (Student)
=================================================== */
export const createReview = async (req, res) => {
  try {
    const db = req.db.collection("reviews");

    const review = {
      scholarshipId: req.body.scholarshipId,
      scholarshipName: req.body.scholarshipName,
      universityName: req.body.universityName,

      rating: Number(req.body.rating),
      comment: req.body.comment,

      userEmail: req.user.email,
      userName: req.user.name,
      userImage: req.user.photo,

      createdAt: new Date(),
    };

    const result = await db.insertOne(review);

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===================================================
   GET REVIEWS BY SCHOLARSHIP
=================================================== */
export const getReviewsByScholarship = async (req, res) => {
  try {
    const db = req.db.collection("reviews");

    const reviews = await db
      .find({ scholarshipId: req.params.id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===================================================
   GET MY REVIEWS (Student)
=================================================== */
export const getMyReviews = async (req, res) => {
  try {
    const db = req.db.collection("reviews");

    const reviews = await db
      .find({ userEmail: req.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===================================================
   GET ALL REVIEWS (Moderator/Admin)
=================================================== */
export const getAllReviews = async (req, res) => {
  try {
    const db = req.db.collection("reviews");

    const reviews = await db
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===================================================
   UPDATE REVIEW (Student)
=================================================== */
export const updateReview = async (req, res) => {
  try {
    const db = req.db.collection("reviews");

    const { rating, comment } = req.body;

    const review = await db.findOne({
      _id: new ObjectId(req.params.id),
      userEmail: req.user.email,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await db.updateOne(
      { _id: review._id },
      {
        $set: {
          rating: Number(rating),
          comment,
          updatedAt: new Date(),
        },
      }
    );

    res.json({ message: "Review updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===================================================
   DELETE REVIEW (Student/Moderator)
=================================================== */
export const deleteReview = async (req, res) => {
  try {
    const db = req.db.collection("reviews");

    const review = await db.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!review) {
      return res.status(404).json({ message: "Not found" });
    }

    // allow owner OR moderator/admin
    if (
      review.userEmail !== req.user.email &&
      !["Admin", "Moderator"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await db.deleteOne({ _id: review._id });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};