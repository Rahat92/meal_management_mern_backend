const express = require("express");
const cors = require("cors");
app.use(cors({
  origin: [
    "https://kikhaben.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));
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
const productCategoryRouter = require("./routes/productCategoryRoutes");
const productTagRouter = require("./routes/productTagRouter");
const morgan = require("morgan");
const advanceMealSheetRouter = require("./routes/v2/advanceMealSheetRoutes");
const mealExpenseRouter = require("./routes/v2/mealExpenseDetailRoutes");
const borderMealRouter = require("./routes/v2/borderMealRoutes");

const app = express();
app.use(morgan("dev"));
app.use("/public", express.static("public"));
app.use(express.json());

app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/meal", mealCountRouter);
app.use("/api/v1/foods", foodRouter);
app.use("/api/v1/year-month", yearMonthRouter);
app.use("/api/v1/product-categories", productCategoryRouter)
app.use("/api/v1/product-tags", productTagRouter)
app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v2/meal", mealRouter); // Uncommented

// advance mealsheetroute
app.use("/api/v2/advance-meal-sheet", advanceMealSheetRouter)
app.use("/api/v2/meal-expense-details", mealExpenseRouter)
app.use("/api/v2/border-meal", borderMealRouter)

// 404 Handler
app.all("*", (req, res, next) => {
  next(new AppError(`No route defined for ${req.originalUrl}`, 404));
});

// Error handler
app.use(errorController);

module.exports = app;
