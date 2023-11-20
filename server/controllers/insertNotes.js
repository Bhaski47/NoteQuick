const Notes = require('../models/notes');

const insertNotes = async (req, res) => {
    try {
        console.log(req.body.email);
        const user = await Notes.findOne({ email: req.body.email });
        if (!user) return res.status(403).send({ message: "Email is Invalid" });
        user.data.push(...req.body.data);
        await user.save();
        res.status(200).send({ message: "Inserted Successfully" });
    } catch (err) {
        res.status(500).send({ message: "Error Inserting Notes" });
    }
};

module.exports = { insertNotes };
