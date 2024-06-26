const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed!",
      errorMessage: errors.array(),
    });
  }

  const { userName, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashPassword) => {
      return User.create({
        email,
        userName,
        password: hashPassword,
      });
    })
    .then((result) => {
      res.status(201).json({
        message: `User is created! , UserId : ${result._id}`,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: "Something went wrong!.",
      });
    });
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed!",
        errorMessage: errors.array(),
      });
    }
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(401).json({
        message: "Email  doesn't exist.",
      });
    }
    const isMatch = bcrypt.compareSync(password, userDoc.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email or password doesn't match.",
      });
    }

    const token = jwt.sign(
      { email: userDoc.email, userId: userDoc._id },
      process.env.JWT_KEY,
      { expiresIn: "1hr" }
    );
    return res
      .status(200)
      .json({ token, userId: userDoc._id, user_mail: userDoc.email });
  } catch (err) {
    return res.status(401).json({
      message: "Email or password doesn't match.",
    });
  }
};

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "User is not authenticated." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const istokenmatch = jwt.verify(token, process.env.JWT_KEY);
    if (!istokenmatch) {
      return res.status(401).json({ message: "User is not authenticated." });
    }
    req.userId = istokenmatch.userId;
    res.json("ok");
    next();
  } catch {
    (err) => {
      return res.status(401).json({ message: "User is not authenticated." });
    };
  }
};
