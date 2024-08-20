const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password')
  process.exit(1) //! 1 terminate with error 0 terminate exit
}

const password = process.argv[2]

const url = `mongodb+srv://luisfreiser:${password}@clusterfullstackopen.eowyp.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=ClusterFullStackOpen`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Persons', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('Phonebook:')
    result.forEach((person) => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}
