const express = require('express');
const router = express.Router();
const { createProductCategory, getProductCategories, deleteProductCategory, updateProductCategory, getExtraShoppingWithCategory, getMarketingWithCategory } = require('../controllers/v1/productCategoryController');

router
    .route('/')
    .get(getProductCategories)
    .post(createProductCategory)

router
    .route("/:id")
    .delete(deleteProductCategory)
    .patch(updateProductCategory)
router
    .route('/extra-shopping-summary/:managerId')
    .get(getExtraShoppingWithCategory)
router
    .route('/marketing-summary/:managerId')
    .get(getMarketingWithCategory)
const productCategoryRouter = router;
module.exports = productCategoryRouter;