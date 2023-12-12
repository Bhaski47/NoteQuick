const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  title: { type: String },
  content: { type: String }
});

const Notes = mongoose.model("Notes", noteSchema);

module.exports = { Notes };
