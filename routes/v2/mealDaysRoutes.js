const express = require("express");
const { getMonthDays } = require("../../controllers/v2/mealDayController");
const router = express.Router();

router
    .route('/')
    .get(getMonthDays)
const mealDayRouter = router;
module.exports = mealDayRouter;