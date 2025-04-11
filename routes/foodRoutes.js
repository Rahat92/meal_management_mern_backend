const express = require('express');
const { createFood, getFoods } = require('../controllers/foodController');
const router = express.Router();

router
    .route('/')
    .get(getFoods)
    .post(createFood)

const foodRouter = router;
module.exports = foodRouter