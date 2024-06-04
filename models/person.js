const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to database ", url);
mongoose
  .connect(url)
  .then((result) => console.log("Succesfully connected"))
  .catch((error) =>
    console.log(`Could not connect to database. Error: ${error}`)
  );

const personSchema = mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  phone: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: (v) => /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(v),
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
