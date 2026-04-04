const MealMonthModel = require("../../models/v2/mealMonthModel");

exports.getAdminYearMonths = async (req, res) => {
    const manager = req.query.managerId;
    const find = {}
    if (manager !== 'null' || manager !== 'undefined') {
        find.mealManager = manager;
    }
    const yearMonth = await MealMonthModel.find(find)
    res.status(200).json({
        status: 'Success',
        result: yearMonth
    })
}