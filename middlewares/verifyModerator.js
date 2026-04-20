const verifyModerator = (req, res, next) => {
  if (!["Moderator", "Admin"].includes(req.user?.role)) {
    return res.status(403).json({ message: "Moderator only access" });
  }
  next();
};

export default verifyModerator;