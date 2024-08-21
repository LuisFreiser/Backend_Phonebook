//!Importando libreria mongoose para conectar a la base de datos.
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI; //! Llamando la variable de entorno.

console.log("connecting to", url);

//! Conectando a la base de datos.
mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

//! Definiendo el esquema de la base de datos.
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Name must be at least 3 characters long"], //! Validando y dando formato a los mensajes de error.
    required: [true, "User name person required"],
  },
  number: {
    type: String,
    required: [true, "User phone number required"], //! Validando y dando formato a los mensajes de error.

    //! Validacion personalizada de mongoose que el numero tenga el formato "042-464748584".
    validate: {
      validator: function (v) {
        return /\d{3}-\d{9}/.test(v); //!Usando expresiones regulares.
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

//! Transformando un documento a JSON, eliminando campos innecesarios y convirtiendo el campo _id a una cadena.
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Persons", personSchema);
