const { validationResult } = require("express-validator");
const Note = require("../models/note");
const { removeImg } = require("../utlis/remove_cv");

exports.getNotes = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 4;
  let totalNotes;
  let totalPages;

  Note.find()
    .countDocuments()
    .then((counts) => {
      totalNotes = counts;
      // totalNotes = 12
      // totalpages = totalNotes / perPage
      totalPages = Math.ceil(totalNotes / perPage);
      return Note.find()
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((notes) => {
      return res.status(200).json({ notes, totalNotes, totalPages });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.createNote = (req, res, next) => {
  const { title, content } = req.body;
  const cover_image = req.file;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed!",
      errorMessage: errors.array(),
    });
  }

  Note.create({
    title,
    content,
    cover_image: cover_image ? cover_image.path : "",
    author: req.userId,
  })
    .then((_) => {
      return res.status(201).json({
        message: "Note Created!",
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({
        message: "Something went wrong.",
      });
    });
};

// GET note/:id
exports.getNote = (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .populate("author", "userName")
    .then((note) => {
      return res.status(200).json(note);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong.",
      });
    });
};

exports.deleteNote = (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      if (note.author.toString() !== req.userId) {
        return res.status(401).json({
          message: "Not Authorized.",
        });
      }
      if (note.cover_image) {
        removeImg(note.cover_image);
      }
      return Note.findByIdAndDelete(id).then((_) => {
        res.status(202).json({
          message: "Post Deleted.",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong.",
      });
    });
};

exports.getOldNote = (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      if (note.author.toString() !== req.userId) {
        return res.status(401).json({
          message: "Not Authorized.",
        });
      }
      return res.status(200).json(note);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong.",
      });
    });
};

exports.updateNote = (req, res, next) => {
  const { note_id, title, content } = req.body;
  const cover_image = req.file;
  Note.findById(note_id)
    .then((note) => {
      if (note.author.toString() !== req.userId) {
        return res.status(401).json({
          message: "Not Authorized.",
        });
      }
      note.title = title;
      note.content = content;
      if (cover_image) {
        if (note.cover_image) {
          removeImg(note.cover_image);
        }
        note.cover_image = cover_image.path;
      }
      note.save();
    })
    .then((_) => {
      return res.status(200).json({
        message: "Note Updated successfully!",
      });
    })
    .catch((err) => console.log(err));
};
