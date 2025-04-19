// routes/mealRoutes.js
const express = require("express");
const { createMeal, updateUserLunch } = require("../controllers/v2/mealController");
const router = express.Router();

// Route to create a new meal
router
.route("/create-meal")
.post(createMeal)

router
    .route('/update-user-lunch')
    .patch(updateUserLunch)
const mealRouter = router;
module.exports = mealRouter;
