const { model, Schema } = require("mongoose");

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    content: {
      type: String,
      required: true,
      minLength: 5,
    },
    author: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const noteModel = model("Note", noteSchema);
module.exports = noteModel;
