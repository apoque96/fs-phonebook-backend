require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

let persons = [];

app.use(express.json());
app.use(express.static("dist"));
app.use(morgan("tiny"));
app.use(cors());

const errorHandler = (error, req, res, next) => {
  console.error(error.name);

  if (error.name === "CastError" || error.name === "TypeError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
};

const generateRandomId = () => {
  const id = Math.floor(Math.random() * 1000000);

  const exists = persons.find((n) => n.id === id);
  return exists ? generateRandomId() : id;
};

app.get("/", (req, res) => {
  Note.find({}).then((persons) => res.json(persons));
});

app.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(`
    <p>
        Phonebook has info for ${persons.length} people
    </p>
    <p>
        ${new Date().toString()}
    </p>`);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => (person ? res.json(person) : res.status(404).end()))
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    phone: body.phone,
  });

  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, phone } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, phone },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
