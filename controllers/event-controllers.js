const Event = require("../models/event-model");

exports.getEvents = (req, res) => {
  Event.find()
    .then((events) => res.status(200).send({ events: events }))
    .catch((error) => res.status(500).send({ message: error.message }));
};

exports.createEvent = (req, res) => {
  const { title, description, date, location, price, theme, createdBy } =
    req.body;
  const event = new Event({
    title,
    description,
    date,
    location,
    price,
    theme,
    createdBy,
  });

  event
    .save()
    .then((event) => res.status(201).send({ event: event }))
    .catch((error) => res.status(400).json({ msg: "Invalid Fields" }));
};
