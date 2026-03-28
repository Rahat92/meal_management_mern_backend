const express = require('express');
const { createMonthlySheet, getAdvanceMonthlySheet, getUserMonthlySheet, getRowMonthSheet, addUserToMonthSheet, getShoppingReport } = require('../../controllers/v2/advanceMealSheetController');
const { protect, restrictedTo } = require('../../controllers/v1/authController');
const router = express.Router();

router
    .route('/')
    .post(protect, restrictedTo('admin'), createMonthlySheet)

router
    .route('/:monthId')
    .get(getAdvanceMonthlySheet)
router
    .route('/row-month-sheet/:monthId')
    .get(getRowMonthSheet)
router
    .route('/user/:id')
    .get(getUserMonthlySheet)
router
    .route('/user-to-monthly-sheet/:monthId')
    .post(protect, restrictedTo('admin'), addUserToMonthSheet)

router
    .route('/shopping-report')
    .get(getShoppingReport)

const advanceMealSheetRouter = router;
module.exports = advanceMealSheetRouter;