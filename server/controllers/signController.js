const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const { Notes } = require("../models/notes");

const createController = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(409).send({ message: "Already Registered" });
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPass = await bcrypt.hash(req.body.pass, salt);
    await User({ ...req.body, pass: hashedPass }).save();
    res.status(200).send({ message: "User Created" });
  } catch (err) {
    res.status(500).send({ message: "Internal Error",error: err.message  });
  }
};

module.exports = { createController };
