const ProductsTag = require("../../models/ProductTagModel")

exports.createProductTag = async (req, res) => {
    try {
        const productTag = await ProductsTag.create(req.body);
        res.status(201).json({
            status: "success",
            data: productTag
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

exports.getProductTags = async (req, res) => {
    try {
        let filter = {};
        if (req.query.categoryId) {
            filter.category = req.query.categoryId;
        }else {
            filter = {};
        }
        const productTags = await ProductsTag.find(filter);
        res.status(200).json({
            status: "success",
            data: productTags
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }   
}