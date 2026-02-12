require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* middlewares */
app.use(cors());
app.use(express.json());

/* DB */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

/* routes */
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/scholarships", require("./routes/scholarship.routes"));
app.use("/api/applications", require("./routes/application.routes"));
app.use("/api/reviews", require("./routes/review.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/payments", require("./routes/payment.routes"));

app.get("/", (req, res) => {
  res.send("ScholarStream Server Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
