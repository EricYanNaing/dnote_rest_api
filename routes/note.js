const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note");
const { body } = require("express-validator");

// GET
router.get("/notes", noteController.getNotes);

// Post
router.post("/create", [
  body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title is too short.")
    .isLength({ max: 30 })
    .withMessage("Title is too long."),
  body("content")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Content is too short."),
  noteController.createNote,
]);

module.exports = router;
