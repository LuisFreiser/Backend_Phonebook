//! importamos dotenv para leer variables de entorno.
require("dotenv").config();

const express = require("express");
const Person = require("./models/connectDB");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

//! Middlewares jsonParser y express.json
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("dist"));

//! Middleware personalizado para registrar el cuerpo de las solicitudes POST en consola.
app.use((req, res, next) => {
  if (req.method === "POST") {
    console.log("body:", req.body);
  }
  next();
});

//! Ruta para obtener datos de la base de datos.
app.get("/info", (req, res) => {
  Person.find({}).then((persons) =>
    res.send(
      `Phonebook has info for ${persons.length} people <br> ${new Date()}`
    )
  );
});

app.get("/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

//! Ruta para agregar datos a la base de datos.
app.post("/persons", (req, res, next) => {
  const body = req.body;

  // //!Validando que el body(name y number) no este vacío
  // if (!body.name) {
  //   return res.status(400).json({
  //     error: "Enter the person's name",
  //   });
  // }
  // //!Validando que el name no exista
  // if (Person.some((person) => person.name === body.name)) {
  //   return res.status(400).json({
  //     error: "the name already exists",
  //   });
  // }

  //! Generando un nuevo objeto para almacenar en la base de datos.
  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

// //!Ruta para buscar datos de la base de datos.
app.get("/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// //!Ruta para actualizar datos de la base de datos.
app.put("/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    {
      new: true, //! { new: true } devuelve el documento actualizado en lugar del documento original.
      runValidators: true, //! {runValidators: true} indica que debe ejecutar las validaciones definidas en el modelo Schema antes de actualizar el documento.
      context: "query", //! {context: 'query'} indica que se debe ejecutar la función en el contexto de consulta.
    }
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        //! {status: 404} indica que el recurso no fue encontrado Y devuelvo mi error personalizado en formato Json.
        res.status(404).json({
          error: "Person not found or was removed from the server",
        });
      }
    })
    .catch((error) => next(error));
});

// //!Ruta para eliminar datos de la base de datos.
app.delete("/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

//! Controlador (Middleware) de error 404.
const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  //! Verificando que el id sea correcto si es incorrecto me devuelve CastError 404.
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    //! Personalizando los mensajes de error y Utiliza una expresión regular para quitar parte del mensaje de error 404.
    const errorMessage = Object.values(error.errors).map((err) => {
      //! "Object.values" devuelve un array con los valores de las propiedades del objeto "error.errors".
      return err.message.replace(/^.*: /, "");
    });
    return res.status(400).send({ error: errorMessage });
  }
  next(error);
};

app.use(errorHandler);

//! Estableciendo el puerto de escucha 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
