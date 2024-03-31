const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const logController = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({ email: req.body.email });
    if (!user)
    return res.status(401).send({ message: "Invalid User or Password" });
  const validPassword = await bcrypt.compare(req.body.pass, user.pass);
  if (!validPassword)
  return res.status(401).send({ message: "Invalid Password" });
  const token = user.generateAuthToken();
  res.status(200).send({ data:token,message: "Logged Successfully" });
  } catch (err) {
    res.status(500).send({ message: "Login Error" });
  }
};

const validate = (data) => {
  const passOption = {
    min: 8,
    max: 30,
  };
  const schema = joi.object({
    email: joi.string().email().required().label("Email"),
    pass: passwordComplexity(passOption).required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = { logController };
