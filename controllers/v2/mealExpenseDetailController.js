const ShoppingModel = require("../../models/v2/shoppingModel")

exports.createMealExpenseDetail = async(req,res) => {
    const expenseDetail = await ShoppingModel.create({
        borderMeal: req.body.borderMeal,
        type: req.body.type,
        productName: req.body.productName,
        productCount: req.body.productCount,
        unitPrice: req.body.unitPrice,
        category: req.body.categoryId,
        tags: req.body.tags
    })
    res.status(201).json({
        success: true,
        expenseDetail
    })
}