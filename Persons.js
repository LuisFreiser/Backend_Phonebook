const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

//!Middlewares jsonParser y express.json
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("dist"));

//! Middleware personalizado para registrar el cuerpo de las solicitudes POST
app.use((req, res, next) => {
  if (req.method === "POST") {
    console.log("body:", req.body);
  }
  next();
});

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

//!Ruta para obtener datos del servidor
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  res.send(
    `Phonebook has info for ${persons.length} people <br> ${new Date()}`
  );
});

app.get("/persons", (req, res) => {
  res.json(persons);
});

//!Ruta para buscar datos del servidor
app.get("/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

//!Ruta para eliminar datos al servidor
app.delete("/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

//!Generando un id aleatorio
const generateRandomId = () => {
  // La función 'Math.floor(Math.random() * 100000)' genera un número aleatorio de 5 dígitos
  // La función 'String(randomId)' convierte el número en una cadena
  // La función 'padStart(5, "0")' agrega ceros a la izquierda hasta que la cadena tenga 5 caracteres
  const randomId = Math.floor(Math.random() * 100000);
  //  const fiveDigitsId = String(randomId).padStart(5, "0");
  return randomId;
};
//!Ruta para agregar datos al servidor
app.post("/persons", (req, res) => {
  const body = req.body;

  //!Validando que el body(name y number) no este vacío
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing hello",
    });
  } //!Validando que el body(name) no exista
  if (persons.some((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "the name already exists",
    });
  }
  //!Generando un nuevo objeto para almacenar los datos
  const newPerson = {
    id: generateRandomId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(newPerson);
  res.json(newPerson);
});

//!Estableciendo el puerto de escucha 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
