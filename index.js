// import reviewsRoutes from "./routes/review.routes.js";

// require("dotenv").config();

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();

// /* middlewares */
// app.use(cors());
// app.use(express.json());
// app.use("/api/reviews", reviewsRoutes);


// /* DB */
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch(console.error);

// /* routes */
// app.use("/api/users", require("./routes/user.routes"));
// app.use("/api/scholarships", require("./routes/scholarship.routes"));
// app.use("/api/applications", require("./routes/application.routes"));
// app.use("/api/reviews", require("./routes/review.routes"));
// app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/payments", require("./routes/payment.routes"));

// app.get("/", (req, res) => {
//   res.send("ScholarStream Server Running");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import scholarshipsRoutes from "./routes/scholarships.routes.js";
import applicationsRoutes from "./routes/applications.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* DB connection */
const db = await connectDB();

/* attach db to req */
app.use((req, res, next) => {
  req.db = db;
  next();
});

/* routes */
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/scholarships", scholarshipsRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/payments", paymentsRoutes);

/* health check */
app.get("/", (req, res) => {
  res.send("ScholarStream API running");
});

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port 5000")
);
