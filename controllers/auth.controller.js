const admin = require("../config/firebaseAdmin");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


/* ==================================
   Verify Firebase token & issue JWT
================================== */
exports.firebaseLogin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const idToken = authHeader.split(" ")[1];

    /* verify firebase token */
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const { email, name, picture } = decodedToken;

    /* find or create user */
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        photoURL: picture,
        role: "Student",
      });
    }

    /* create server JWT */
    const serverToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: serverToken,
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Firebase verification failed" });
  }
};
