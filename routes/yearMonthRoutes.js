const express = require("express");
const { createYearMonth, getAllYearMonth,getYearMonth,deleteYearMonth } = require("../controllers/yearMonthController");
const { deleteAMonth } = require("../controllers/mealCountController");

const router = express.Router();

router
    .route('/')
    .post(createYearMonth)
    .get(getAllYearMonth)
router
    .route('/:id')
    .get(getYearMonth)
    .delete(deleteYearMonth)

module.exports = router;