// module.exports = (req, res, next) => {
//   if (req.user.role !== "Admin") {
//     return res.status(403).json({ message: "Admin only access" });
//   }
//   next();
// };


export const verifyAdmin = async (req, res, next) => {
  const user = await req.db
    .collection("users")
    .findOne({ email: req.user.email });

  if (user?.role !== "Admin")
    return res.status(403).json({ message: "Admin only" });

  next();
};
