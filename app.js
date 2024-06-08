const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// import routes
const noteRoute = require("./routes/note");

//connect mongodb
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(noteRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then((_) => {
    app.listen(8000);
    console.log("Connected to mongodb & ruuning on port 8000");
  })
  .catch((err) => {
    console.log(err);
  });
