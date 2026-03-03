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

exports.updateBorderMeal = async(req,res) => {
    console.log(req.body)
    try{
        const borderMealId = req.params.id;
        console.log(borderMealId)
        const borderMeal = await BorderMealModel.findByIdAndUpdate(borderMealId, {
            $set: {
                "lunch.meal": req.body.lunch.meal,
            }
        })
        console.log(borderMeal)
        res.status(200).json({
            success: true,
            borderMeal
        })
    }catch(err){
        console.log(err)
    }
}