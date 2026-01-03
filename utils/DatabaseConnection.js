const mongoose = require("mongoose");

const connectToDb = () => {
  mongoose
    .connect(
      "mongodb+srv://khrahat92:1ZP6L8yY7fagaXwj@cluster0.c8qwi24.mongodb.net/mealManagement",
      // "mongodb://localhost:27017/mealManagement",
      {
        useNewurlParser: true,
      }
    )
    .then(() => console.log("Successfully connect Database with the app"));
};
// const connectToDb = () => {
//   mongoose
//     .connect(
//       "mongodb://127.0.0.1:27017/mealManagement",
//       {
//         useNewurlParser: true,
//       }
//     )
//     .then(() => console.log("Successfully connect Database with the app"));
// };

module.exports = connectToDb;
