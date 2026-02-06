require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

/* middlewares */
app.use(cors());
app.use(express.json());

/* DB */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

/* routes */
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/scholarships", require("./routes/scholarship.routes"));
app.use("/api/applications", require("./routes/application.routes"));
app.use("/api/reviews", require("./routes/review.routes"));


app.get("/", (_, res) => res.send("ScholarStream API running"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);

