const express = require('express');
const router = express.Router();
const { createProductCategory, getProductCategories, deleteProductCategory, updateProductCategory, getExtraShoppingWithCategory } = require('../controllers/v1/productCategoryController');

router
    .route('/')
    .get(getProductCategories)
    .post(createProductCategory)
router
    .route('/summary')
    .get(getExtraShoppingWithCategory)
router
    .route("/:id")
    .delete(deleteProductCategory)
    .patch(updateProductCategory)

const productCategoryRouter = router;
module.exports = productCategoryRouter;