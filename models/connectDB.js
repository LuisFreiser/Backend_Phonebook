const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long'], //! Validando y dando formato a los mensajes de error.
    required: [true, 'User name person required']
  },
  number: {
    type: String,
    required: [true, 'User phone number required'], //! Validando y dando formato a los mensajes de error.

    //! Validacion personalizada que el numero sea de 3 digitos y 9 digitos.
    validate: {
      validator: function (v) {
        return /\d{3}-\d{9}/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Persons', personSchema)
