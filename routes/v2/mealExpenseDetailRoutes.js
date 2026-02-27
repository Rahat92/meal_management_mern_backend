const express = require('express');
const { createMealExpenseDetail } = require('../../controllers/v2/mealExpenseDetailController');
const router = express.Router();

router
    .route('/')
    .post(createMealExpenseDetail);
const mealExpenseRouter = router;
module.exports = mealExpenseRouter