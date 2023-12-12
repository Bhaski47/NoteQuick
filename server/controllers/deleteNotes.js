const { Notes } = require("../models/notes");

const deleteNotes = async (req, res) => {
  try {
    const { id } = req.params;
    await Notes.findByIdAndDelete(id);
    res.status(200).send({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error Deleting" });
  }
};

module.exports = { deleteNotes };
