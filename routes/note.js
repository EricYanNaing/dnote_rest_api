const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note");
const { body } = require("express-validator");

const authMiddleware = require("../middlewares/is-auth");

// GET
router.get("/notes", noteController.getNotes);

// Post
router.post("/create", authMiddleware, [
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

// GET /notes/:id
router.get("/notes/:id", noteController.getNote);

// Delete
router.delete("/delete/:id", authMiddleware, noteController.deleteNote);

// GET Edit
router.get("/edit/:id", authMiddleware, noteController.getOldNote);

// POST Edit
router.put("/edit", authMiddleware, noteController.updateNote);

module.exports = router;
