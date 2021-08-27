require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("morgan");
const mongoose = require("mongoose");
const apiRouter = require("./routes/api");

mongoose.connect("mongodb://localhost:27017/jwt", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/users", apiRouter);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(3000);
