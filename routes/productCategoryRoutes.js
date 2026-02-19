const express = require('express');
const router = express.Router();
const { createProductCategory, getProductCategories, deleteProductCategory, updateProductCategory, getExtraShoppingWithCategory, getMarketingWithCategory, getAProductCategory } = require('../controllers/v1/productCategoryController');

router
    .route('/')
    .get(getProductCategories)
    .post(createProductCategory)

router
    .route("/:id")
    .get(getAProductCategory)
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