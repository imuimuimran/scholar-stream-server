const Review = require("../models/Review");


exports.createReview = async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json(review);
};


exports.getReviewsByScholarship = async (req, res) => {
  const reviews = await Review.find({
    scholarshipId: req.params.id,
  });
  res.json(reviews);
};


exports.updateReview = async (req, res) => {
  const updated = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};


exports.deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
