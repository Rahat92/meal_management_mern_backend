const express = require('express');
const { createMonthlySheet, getAdvanceMonthlySheet, getUserMonthlySheet, getRowMonthSheet } = require('../../controllers/v2/advanceMealSheetController');
const { protect, restrictedTo } = require('../../controllers/v1/authController');
const router = express.Router();

router
    .route('/')
    .post(protect, restrictedTo('admin'), createMonthlySheet)
router
    .route('/:id')
    .get(getAdvanceMonthlySheet)
router
    .route('/row-month-sheet/:monthId')
    .get(getRowMonthSheet)
router
    .route('/user/:id')
    .get(getUserMonthlySheet)

const advanceMealSheetRouter = router;
module.exports = advanceMealSheetRouter;