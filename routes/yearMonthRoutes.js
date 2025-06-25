const express = require("express");
const { createYearMonth, getAllYearMonth,getYearMonth,deleteYearMonth } = require("../controllers/yearMonthController");
const { deleteAMonth } = require("../controllers/v1/mealCountController");
const { protect, restrictedTo } = require("../controllers/v1/authController");

const router = express.Router();

router
    .route('/')
    .post(protect, restrictedTo('admin'), createYearMonth)
    .get(protect, getAllYearMonth)
router
    .route('/:id')
    .get(getYearMonth)
    .delete(protect, deleteYearMonth)

module.exports = router;