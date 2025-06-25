const express = require("express");
const cors = require("cors");
const cron = require('node-cron');
const cookieParser = require("cookie-parser");
const AppError = require("./utils/AppError");
const errorController = require("./controllers/errorController");

const userRouter = require("./routes/userRoutes");
const mealCountRouter = require("./routes/mealCountRoutes");
const yearMonthRouter = require("./routes/yearMonthRoutes");
const conversationRouter = require("./routes/conversationRoutes");
const messageRouter = require("./routes/messageRoutes");
const foodRouter = require("./routes/foodRoutes");
const mealRouter = require("./routes/mealRoutes");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));
app.use("/public", express.static("public"));
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/meal", mealCountRouter);
app.use("/api/v1/foods", foodRouter);
app.use("/api/v1/year-month", yearMonthRouter);
app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v2/meal", mealRouter); // Uncommented

// 404 Handler
app.all("*", (req, res, next) => {
  next(new AppError(`No route defined for ${req.originalUrl}`, 404));
});

// Error handler
app.use(errorController);

module.exports = app;
