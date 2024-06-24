const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const multer = require("multer");
const path = require("path");

// import routes
const noteRoute = require("./routes/note");
const authRoute = require("./routes/auth");

//connect mongodb
const mongoose = require("mongoose");

const app = express();

const storageConfigure = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, suffix + "-" + file.originalname);
  },
});

const filterConfigure = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, undefined);
  }
};

app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  multer({ storage: storageConfigure, fileFilter: filterConfigure }).single(
    "cover_image"
  )
);

app.use(noteRoute);
app.use(authRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then((_) => {
    app.listen(8000);
    console.log("Connected to mongodb & ruuning on port 8000");
  })
  .catch((err) => {
    console.log(err);
  });
