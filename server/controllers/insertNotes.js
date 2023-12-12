const { Notes } = require("../models/notes");
const insertNotes = async (req, res) => {
  try {
    await Notes({
      email: req.body.email,
      title: req.body.title,
      content: req.body.content,
    }).save();
    res.status(200).send({ message: "Inserted Successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error Inserting Notes" });
  }
};

module.exports = { insertNotes };
