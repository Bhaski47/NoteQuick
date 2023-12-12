const { Notes } = require("../models/notes");

const updateNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const comp = await Notes.findByIdAndUpdate(
      id,
      { $set: { title: req.body.title, content: req.body.content } },
      { new: true }
    );
    if (!comp) {
      return res.status(404).send({ message: "Document not found" });
    }
    res.status(200).send({ message: "Updated Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error Updating" });
  }
};

module.exports = { updateNotes };
