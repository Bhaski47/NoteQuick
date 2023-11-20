const Notes = require('../models/notes');

const updateNotes = async (req, res) => {
  try {
    const {id} = req.params;
    const comp = await Notes.findOneAndUpdate(
        { email: req.body.email },
        { $set: { [`data.${id}`]: req.body.data } },
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
