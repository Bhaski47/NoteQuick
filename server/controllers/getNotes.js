const { Notes } = require("../models/notes");

const getNotes = async (req, res) => {
  try {
    const notes = await Notes.find({ email: req.body.email });
    if (!notes) return res.status(200).send({ message: "No List" });
    res.status(200).send({ data: notes });
  } catch (err) {
    res.status(500).send("Internal Error");
  }
};

module.exports = { getNotes };
