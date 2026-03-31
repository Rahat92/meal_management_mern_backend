const express = require('express');
const { getAdminYearMonths } = require('../../controllers/v2/yearMonthController');
const { protect, restrictedTo } = require('../../controllers/v1/authController');
const router = express.Router();

router
    .route('/')
    .get(protect, restrictedTo('admin'), getAdminYearMonths)

const mealYearMonthRouter = router;
module.exports = mealYearMonthRouter;