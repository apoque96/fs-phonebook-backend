const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    phone: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    phone: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    phone: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    phone: "39-23-6423122",
  },
];

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

const generateRandomId = () => {
  const id = Math.floor(Math.random() * 1000000);

  const exists = persons.find((n) => n.id === id);
  return exists ? generateRandomId() : id;
};

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/info", (req, res) => {
  res.send(`
    <p>
        Phonebook has info for ${persons.length} people
    </p>
    <p>
        ${new Date().toString()}
    </p>`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((n) => n.id === id);
  person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  }
  if (!body.phone) {
    return res.status(400).json({
      error: "phone number missing",
    });
  }

  const exists = persons.find((person) => person.name === body.name);

  if (exists) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    phone: body.phone,
    id: generateRandomId(),
  };

  persons = persons.concat(person);
  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
