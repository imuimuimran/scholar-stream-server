import "./config/env.js";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import scholarshipsRoutes from "./routes/scholarships.routes.js";
import applicationsRoutes from "./routes/applications.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

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
app.use("/api/analytics", analyticsRoutes);

/* health check */
app.get("/", (req, res) => {
  res.send("ScholarStream API running");
});

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port 5000")
);
