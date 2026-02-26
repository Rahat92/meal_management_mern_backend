const express = require('express');
const { protect, restrictedTo } = require('../../controllers/v1/authController');
const router = express.Router();

router
    .route('/')
    .post(protect, restrictedTo('admin'), createMonthlySheet)
router
    .route('/:id')
    .get(getAdvanceMonthlySheet)

const advanceMealSheetRouter = router;
module.exports = advanceMealSheetRouter;