const express = require("express");
const cors = require("cors");
const cron = require('node-cron');
const app = express();
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/AppError");
const errorControlller = require("./controllers/errorControlller");
const cookieParser = require("cookie-parser");
const mealCountRouter = require("./routes/mealCountRoutes");
const yearMonthRouter = require("./routes/yearMonthRoutes");
const conversationRouter = require("./routes/conversationRoutes");
const messageRouter = require("./routes/messageRoutes");
const foodRouter = require("./routes/foodRoutes");
const mealRouter = require("./routes/mealRoutes");




app.use("/public", express.static("public"));
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(cookieParser());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/meal", mealCountRouter);
app.use("/api/v1/foods", foodRouter);
app.use("/api/v1/year-month", yearMonthRouter);
app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/messages", messageRouter);


app.use("/api/v2/meal", mealRouter)

app.all("*", (req, res, next) => {
  next(new AppError("No route defined by this url", 400));
});

//  running a task every 10 second
// cron.schedule('*/30 * * * * *', () => {
//   // const users = [{ name: 'Rahat', number: '+8801761767178' }, { name: 'Shamim', number: '+8801744689840' }]
//   const users = [{ name: 'Rahat', number: '+8801761767178' }]
//   users.forEach(user => {
//     fetch(`http://45.120.38.242/api/sendsms?api_key=01319193270.VXMtkxGPG7XwoldS2a&type=text&phone=${user.number}&senderid=URCL&message=Hello ${user.name}.How are you today?.`).then((res) => res.json()).then((data) => console.log(data)).catch((err) => console.log(err))
//   });
// });

//  run a task every 10 minutes
// cron.schedule('*/10 * * * *', () => {
//   console.log('running a task every 10 minutes');
// });

// run a task every 1 hours
// cron.schedule('0 * * * *', () => {
//   console.log('running a task every 1 hours');
// });

// cron.schedule('0 0 * * *', () => {
//   console.log('running a task every day at midnight');
// });

// run a task every 50 second
// cron.schedule('*/50 * * * * *', () => {
//   console.log('running a task every 50 second');
// });
app.use(errorControlller);
module.exports = app;
