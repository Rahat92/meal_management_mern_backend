const express = require('express');
const { createFood, getFoods } = require('../controllers/v1/foodController');
const router = express.Router();

router
    .route('/')
    .get(getFoods)
    .post(createFood)

const foodRouter = router;
module.exports = foodRouter