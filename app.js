const express = require("express");
const app = express();
const cors = require("cors");
const cron = require('node-cron');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
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
const advanceMealSheetRouter = require("./routes/v2/advanceMealSheetRoutes");
const mealExpenseRouter = require("./routes/v2/mealExpenseDetailRoutes");
const borderMealRouter = require("./routes/v2/borderMealRoutes");
const depositRouter = require("./routes/v2/depositRoutes");

const allowedOrigins = [
  "https://kikhaben.vercel.app",
  "http://localhost:3000"
];

// ✅ Single, clean CORS setup — must be FIRST middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200 // Some browsers (IE11) choke on 204
}));

// ✅ Handle ALL preflight requests globally
app.options("*", cors());

app.use(morgan("dev"));
app.use("/public", express.static("public"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/meal", mealCountRouter);
app.use("/api/v1/foods", foodRouter);
app.use("/api/v1/year-month", yearMonthRouter);
app.use("/api/v1/product-categories", productCategoryRouter);
app.use("/api/v1/product-tags", productTagRouter);
app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v2/meal", mealRouter);
app.use("/api/v2/advance-meal-sheet", advanceMealSheetRouter);
app.use("/api/v2/meal-expense-details", mealExpenseRouter);
app.use("/api/v2/border-meal", borderMealRouter);

app.use("/api/v2/deposits", depositRouter);

// 404 Handler
app.all("*", (req, res, next) => {
  next(new AppError(`No route defined for ${req.originalUrl}`, 404));
});

// Error handler
app.use(errorController);

module.exports = app;