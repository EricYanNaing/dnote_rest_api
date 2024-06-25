const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/note");
const { where } = require("../models/user");

router.post(
  "/register",
  [
    body("userName")
      .trim()
      .isLength({ min: 3 })
      .withMessage("User Name is too short.")
      .isLength({ max: 10 })
      .withMessage("User Name is too long.")
      .custom((value, { req }) => {
        return User.findOne({ userName: value }).then((user) => {
          if (user) {
            return Promise.reject("Username already in use");
          }
        });
      }),
    body("email")
      .isEmail()
      .withMessage("Email is invalid.")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then((user) => {
          if (user) {
            return Promise.reject("E-mail already in use");
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Password is too short.")
      .isLength({ max: 15 })
      .withMessage("Password is too long."),
  ],
  authController.register
);

//Post Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is invalid."),
    body("password")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Password is too short."),
  ],
  authController.login
);

module.exports = router;
