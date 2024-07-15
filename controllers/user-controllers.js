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
