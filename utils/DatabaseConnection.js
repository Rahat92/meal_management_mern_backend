// const mongoose = require("mongoose");

// const connectToDb = () => {
//   mongoose
//     .connect(
//       "mongodb+srv://khrahat92:1ZP6L8yY7fagaXwj@cluster0.c8qwi24.mongodb.net/mealManagement",
//       // "mongodb://localhost:27017/mealManagement",
//       {
//         useNewurlParser: true,
//       }
//     )
//     .then(() => console.log("Successfully connect Database with the app"));
// };
// // const connectToDb = () => {
// //   mongoose
// //     .connect(
// //       "mongodb://127.0.0.1:27017/mealManagement",
// //       {
// //         useNewurlParser: true,
// //       }
// //     )
// //     .then(() => console.log("Successfully connect Database with the app"));
// // };

// module.exports = connectToDb;



const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectToDb = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  cached.conn = await cached.promise;

  console.log("MongoDB connected");
  return cached.conn;
};

module.exports = connectToDb;