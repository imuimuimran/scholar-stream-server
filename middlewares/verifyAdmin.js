const verifyAdmin = async (req, res, next) => {
  const user = await req.db
    .collection("users")
    .findOne({ email: req.user.email });

  if (user?.role !== "Admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};

export default verifyAdmin;