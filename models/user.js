const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  notes: {
    type: Schema.Types.ObjectId,
    ref: "Note",
  },
});

const userModel = model("User", userSchema);
module.exports = userModel;
