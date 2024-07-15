const User = require("../models/user-model");

exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).json({ users: users });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

exports.createUser = (req, res, next) => {
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
