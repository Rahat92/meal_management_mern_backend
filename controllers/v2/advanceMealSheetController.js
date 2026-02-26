const MealMonthModel = require("../../models/v2/MealMonthModel");
const MealDayModel = require("../../models/v2/MealDayModel");
const User = require("../../models/userModel");
const BorderMealModel = require("../../models/v2/borderMealModel");

exports.createMonthlySheet = async (req, res) => {
    try {
        const { year, month } = req.body;

        const mealManager = req.user._id;

        const existing = await MealMonthModel.findOne({ mealManager, year, month });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Monthly sheet already exists"
            });
        }

        const mealMonth = await MealMonthModel.create({
            mealManager,
            year,
            month
        });

        const daysInMonth = new Date(year, month, 0).getDate();

        const users = await User.find({
            mealManager,
            active: true,
            role: "user"
        }).select("_id");

        for (let day = 1; day <= daysInMonth; day++) {

            const dateObj = new Date(year, month, day);

            const mealDay = await MealDayModel.create({
                mealMonth: mealMonth._id,
                date: dateObj,
                day,
                month,
                year
            });

            const borderMeals = users.map(user => ({
                mealDay: mealDay._id,
                user: user._id
            }));
            
            await BorderMealModel.insertMany(borderMeals);
        }

        res.status(201).json({
            success: true,
            message: "Monthly sheet created successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAdvanceMonthlySheet = async (req, res) => {
    const mealMonthId = req.params.id;
    const sheet = await MealMonthModel.findById(mealMonthId).populate('mealManager mealDays')
    res.status(200).json({
        success: true,
        sheet
    })
}