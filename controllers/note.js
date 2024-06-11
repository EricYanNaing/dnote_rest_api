const { validationResult } = require("express-validator");
const Note = require("../models/note");

exports.getNotes = (req, res, next) => {
  Note.find()
    .sort({ createdAt: -1 })
    .then((notes) => {
      return res.status(200).json(notes);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.createNote = (req, res, next) => {
  const { title, content } = req.body;

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
    author: "Annoymous",
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
  Note.findByIdAndDelete(id)
    .then((_) => {
      res.status(202).json({
        message: "Post Deleted.",
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
  Note.findById(note_id)
    .then((note) => {
      (note.title = title), (note.content = content);
      note.save();
    })
    .then((_) => {
      return res.status(200).json({
        message: "Note Updated successfully!",
      });
    })
    .catch((err) => console.log(err));
};
