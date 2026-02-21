const MealsModel = require("../../models/mealModel")

exports.createMeals = async(req,res) => {
    await MealsModel.create(req.body)
}