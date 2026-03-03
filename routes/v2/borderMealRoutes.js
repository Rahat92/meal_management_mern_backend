const express = require('express');
const { updateBorderMeal } = require('../../controllers/v2/borderMealController');
const router = express.Router();

router  
    .route('/:mealDay')
    .patch(updateBorderMeal)

const borderMealRouter = router;
module.exports = borderMealRouter;