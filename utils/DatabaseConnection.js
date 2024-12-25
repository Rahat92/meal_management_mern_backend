const mongoose = require("mongoose");

const connectToDb = () => {
  mongoose
    .connect(
      "mongodb+srv://khrahat92:1ZP6L8yY7fagaXwj@cluster0.c8qwi24.mongodb.net/mealManagement",
      {
        useNewurlParser: true,
      }
    )
    .then(() => console.log("Successfully connect Database with the app"));
};

console.log('')
module.exports = connectToDb;
