const BorderMealModel = require("../../models/v2/borderMealModel")

exports.entryBorderToSheet = async (req, res) => {
    const borderSheet = await BorderMealModel.create({
        mealDay: req.query.mealDay,
        user: req.params.id,
        breakfast: req.body.breakfast,
        lunch: req.body.lunch,
        dinner: req.body.dinner,
    })
    res.status(201).json({
        success: true,
        borderSheet
    })
}