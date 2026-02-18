const express = require('express');
const { createProductTag, getProductTags } = require('../controllers/v1/productTagController');
const router = express.Router();

router.
route('/')
    .post(createProductTag)
    .get(getProductTags)

const productTagRouter = router;
module.exports = productTagRouter;
