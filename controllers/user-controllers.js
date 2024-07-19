const User = require("../models/user-model");
const { isEmail } = require("validator");

exports.getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json({ users: users });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

exports.createUser = (req, res) => {
  const { firebaseUid, name, email, picture, role } = req.body;

  const newUser = new User({
    firebaseUid,
    name,
    email,
    picture,
    role,
  });

  newUser
    .save()
    .then((user) => {
      res.status(201).json({ user: user });
    })
    .catch((error) => {
      res.status(400).json({ msg: "Invalid Fields" });
    });
};

exports.getUserByEmail = (req, res) => {
  const { email } = req.params;

  if (!isEmail(email)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      res.status(200).json({ user: user });
    })
    .catch((error) => {
      res.status(500).json({ msg: error.message });
    });
};
