const Food = require("../../models/foodModel");
const catchAsyncError = require("../../utils/catchAsyncError");

exports.createFood = catchAsyncError(async(req, res) => {
    const {name} = req.body;
    const food = await Food.create({
        name
    })
    res.status(201).json({
        status: 'Success',
        data: {
            food
        }
    })
})

exports.getFoods = catchAsyncError(async(req, res) => {
    const foods = await Food.find()
    res.status(201).json({
        status: 'Success',
        data: {
            foods
        }
    })
})