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

/* ================= DATABASE ================= */

await connectDB();

console.log("MongoDB connected ✅");

/* ================= MIDDLEWARES ================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);

/* Stripe webhook needs raw body */
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

app.use(express.json());

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.send("ScholarStream API running ✅");
});

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/scholarships", scholarshipsRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/analytics", analyticsRoutes);

/* ================= 404 ================= */

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

/* ================= EXPORT APP ================= */

export default app;