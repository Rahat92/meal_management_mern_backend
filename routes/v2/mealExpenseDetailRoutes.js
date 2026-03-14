const express = require('express');
const {  getExpenseSummary, createOrUpdateMealExpenseDetail } = require('../../controllers/v2/mealExpenseDetailController');
const router = express.Router();
// /api/v2/meal-expense-details
router
    .route('/')
    .post(createOrUpdateMealExpenseDetail);

router
    .route('/expense-summary')
    .get(getExpenseSummary)
const mealExpenseRouter = router;
module.exports = mealExpenseRouter