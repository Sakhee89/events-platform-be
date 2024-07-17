const Event = require("../models/event-model");
const User = require("../models/user-model");

exports.getEvents = (req, res) => {
  Event.find()
    .then((events) => res.status(200).send({ events: events }))
    .catch((error) => res.status(500).send({ message: error.message }));
};

exports.createEvent = (req, res) => {
  const { title, description, date, location, price, theme, createdBy } =
    req.body;

  if (!title || !description || !date || !location || !theme || !createdBy) {
    return res.status(400).json({ msg: "Invalid Fields" });
  }

  User.findById(createdBy)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      const newEvent = new Event({
        title,
        description,
        date,
        location,
        price,
        theme,
        createdBy,
      });

      return newEvent.save().then((event) => {
        res.status(201).json({ event: event });
      });
    })
    .catch((error) => {
      if (!res.headersSent) {
        res.status(500).json({ msg: error.message });
      }
    });
};
