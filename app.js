const express = require("express");
const cors = require('cors')
const app = express();
const userRouter = require("./routes/userRoutes");
const AppError = require("./uitls/AppError");
const errorControlller = require("./controllers/errorControlller");
const cookieParser = require("cookie-parser");
const mealCountRouter = require("./routes/mealCountRoutes");
const yearMonthRouter = require("./routes/yearMonthRoutes");
app.use("/public", express.static("public"));
app.use(express.json());
app.use(cors({origin:'*'}))
app.use(cookieParser());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/meal", mealCountRouter);
app.use("/api/v1/year-month", yearMonthRouter);
app.all("*", (req, res, next) => {
  next(new AppError("No route defined by this url", 400));
});
app.use(errorControlller);
module.exports = app;
