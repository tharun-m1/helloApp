const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    serverName: "Hello app server",
    status: "Active",
  });
});
// ============================Routes=====================================
app.use("/", authRoutes);
// =======================================================================
app.use((err, req, res, next) => {
  status = err.status || 500;
  message = err.message || "Internal server error";
  return res.status(status).json({
    status,
    message,
  });
});
app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then((res) =>
      console.log(`server running at http://localhost:${process.env.PORT}`)
    )
    .catch((err) => {
      console.log("Connection error: ", err.message);
    });
});
