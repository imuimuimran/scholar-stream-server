import admin from "../config/firebaseAdmin.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ==================================
   Verify Firebase token & issue JWT
================================== */
export const firebaseLogin = async (req, res) => {
  try {
    console.log("AUTH HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    /* check authorization header */
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    /* get firebase token */
    const idToken = authHeader.split(" ")[1];

    console.log("Firebase token received");

    /* verify firebase token */
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    console.log("Firebase verified:", decodedToken.email);

    const email = decodedToken.email;

    const name =
      decodedToken.name ||
      decodedToken.displayName ||
      "Unknown User";

    const photoURL =
      decodedToken.picture ||
      decodedToken.photoURL ||
      "";

    /* find user */
    let user;

    try {
      user = await User.findOne({ email });

      /* create user if not exists */
      if (!user) {
        user = await User.create({
          name: name || "Unknown User",
          email,
          photoURL,
          role: "Student",
        });

        console.log("New user created ✅");

      } else {

        /* auto sync latest firebase info */
        user.name = name || user.name;
        user.photoURL = photoURL || user.photoURL;

        await user.save();

        console.log("Existing user synced ✅");
      }

    } catch (dbError) {
      console.error("DATABASE ERROR:", dbError.message);

      return res.status(500).json({
        message: "Database error",
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
      {
        expiresIn: "7d",
      }
    );

    /* success response */
    res.status(200).json({
      token: serverToken,
      user,
    });

  } catch (err) {
    console.error("Firebase ERROR:", err.message);

    res.status(401).json({
      message: "Firebase verification failed",
    });
  }
};