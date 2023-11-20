const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  data: { type: Array },
});

const Notes = mongoose.model("notes", noteSchema);

module.exports = {Notes};
