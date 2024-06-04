const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please, enter the password");
  process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);
const url = `mongodb+srv://apoque96:${password}@cluster0.xf29fsd.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = mongoose.Schema({
  name: String,
  phone: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 5) {
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((person) => console.log(`${person.name} ${person.phone}`));
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: process.argv[3],
    phone: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.phone} to phonebook`);
    mongoose.connection.close();
  });
}
