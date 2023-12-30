const mongoose = require("mongoose");

const connectToDb = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/messManagement", {
      useNewurlParser: true,
    })
    .then(() => console.log("Successfully connect Database with the app"));
};

module.exports = connectToDb;
